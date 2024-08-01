const Song = require("../models/songModel");
const Album = require("../models/albumModel");
const Artist = require("../models/artistsModel");
const mongoose = require("mongoose");
const path = require('path');
const multer = require('multer'); // for handling file uploads
const fs = require("fs");

const getSongs = async (req, res) => {
  try {
    const songs = await Song.find({}).sort({ createdAt: -1 }).lean(); // Use lean for better performance

    // Fetch album and artists data for each song
    const songsWithDetails = await Promise.all(songs.map(async (song) => {
      const album = await Album.findById(song.album[0]).lean();
      const artists = await Artist.find({ _id: { $in: song.artists[0] } }).lean(); // Assuming song.artists is an array of artist IDs

      return {
        ...song,
        album,
        artists
      };
    }));

    // console.log(songsWithDetails); 

    res.header("Content-Type", "application/json");
    res.status(200).json(songsWithDetails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while fetching songs" });
  }
};


const updateAlbumTracks = async (albumId, songIds) => {
  try {
    const updatedAlbum = await Album.findByIdAndUpdate(
      albumId,
      { $push: { tracks: { $each: songIds } } },
      { new: true }
    );
    if (updatedAlbum) {
      console.log("Album updated:", updatedAlbum);
    } else {
      console.log("Album not found with ID:", albumId);
    }
  } catch (error) {
    console.error(`Error updating album tracks: ${error.message}`);
    throw error;
  }
};

const updateArtistTracks = async (artistIds, songIds) => {
  try {
    const result = await Artist.findByIdAndUpdate(
      artistIds,
      { $push: { tracks: { $each: songIds } } },
      { new: true }
    );;
    if (result) {
      console.log("Artist updated:", result);
    } else {
      console.log("No artists updated. Check artist IDs:", artistIds);
    }
  } catch (error) {
    console.error(`Error updating artist tracks: ${error.message}`);
    throw error;
  }
};

// const updateArtistTracks = async (artistIds, songIds) => {
//   try {
//     const result = await Artist.updateMany(
//       { _id: { $in: artistIds } },
//       { $push: { tracks: { $each: songIds } } }
//     );
//     if (result.nModified > 0) {
//       console.log("Artist updated:", result);
//     } else {
//       console.log("No artists updated. Check artist IDs:", artistIds);
//     }
//   } catch (error) {
//     console.error(`Error updating artist tracks: ${error.message}`);
//     throw error;
//   }
// };

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      if (file.fieldname === 'coverart') {
          cb(null, 'public/images/songs');
      } else if (file.fieldname === 'songpath') {
          cb(null, 'public/songs');
      }
  },
  filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

const createSong = async (req, res) => {
  const { title, subtitle, artists, album } = req.body;
  const coverart = req.files['coverart'] ? req.files['coverart'][0].path.replace(/\\/g, '/') : null;
  const songpath = req.files['songpath'] ? req.files['songpath'][0].path.replace(/\\/g, '/') : null;


  let emptyFields = [];

  if (!title) {
      emptyFields.push("title");
  }
  if (!subtitle) {
      emptyFields.push("subtitle");
  }
  if (!songpath) {
      emptyFields.push("songpath");
  }
  if (emptyFields.length > 0) {
      return res.status(400).json({ error: "Please fill in all fields", emptyFields });
  }

  try {

      // Create the song
      const song = await Song.create({
          title,
          subtitle,
          artists,
          album,
          coverart,
          songpath,
      });

      // Update album with the new song ID
      await updateAlbumTracks(album, [song._id]);

      // Update each artist with the new song ID
      await updateArtistTracks(artists, [song._id]);

      res.status(200).json(song);
  } catch (error) {
      console.error(error.message);
      res.status(400).json({ error: error.message });
  }
};

//get single song
// const getSong = async (req, res) => {
//     const songid = req.params.id;
//     const songPath = path.join(__dirname, '..', 'public/songs', songid);
  
//     fs.access(songPath, fs.constants.F_OK, (err) => {
//       if (err) {
//         return res.status(404).send('Image not found');
//       }
  
//       res.sendFile(songPath, (err) => {
//         if (err) {
//           console.error(err);
//           res.status(500).send('Server Error');
//         }
//       });
//     });
//   };

const getSong = async (req, res) => {
  const songid = req.params.id;
  const songPath = path.join(__dirname, '..', 'public', 'songs', songid);

  // Check if the file exists
  fs.access(songPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('File not found:', songPath);
      return res.status(404).send('Song not found');
    }

    // Stream the file to the client
    res.sendFile(songPath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        if (!res.headersSent) {
          res.status(500).send('Server Error');
        }
      }
    });

    // Handle client disconnection
    req.on('aborted', () => {
      console.warn('Request aborted by the client');
      if (!res.headersSent) {
        res.end();
      }
    });
  });
};

//delete a song
const deleteSong = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such song" });
  }

  const song = await Song.findOneAndDelete({ _id: id });

  if (!song) {
    return res.status(404).json({ error: "No such song" });
  }

  res.status(200).json(song);
};

//update a song
const updateSong = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such song" });
  }

  const song = await Song.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!song) {
    return res.status(404).json({ error: "No such song" });
  }

  res.status(200).json(song);
};

module.exports = {
  createSong,
  getSongs,
  getSong,
  deleteSong,
  updateSong,
  upload
};
