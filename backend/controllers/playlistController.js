const Playlist = require("../models/playlistModel");
const User = require("../models/User");
const Song = require("../models/songModel");
const mongoose = require("mongoose");
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const getPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({}).sort({ createdAt: -1 });

    console.log(playlists); 

    res.header("Content-Type", "application/json");
    res.status(200).json(playlists);
  } catch (err) {
    res.status(500).json({ error: "An error occurred while fetching Playlists" });
  }
};

// CreatePlaylist Controller
const createPlaylist = async (req, res) => {
  const { song_id, user_id } = req.body;

  console.log("Song ID:", song_id);  
  console.log("User ID:", user_id); 

  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return res.status(404).json({ error: "Invalid ObjectId" });
  }
  
  const user = await User.findById(user_id);  
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  if (!mongoose.Types.ObjectId.isValid(song_id)) {
    const title = `My Playlist #${song_id}`;
    try {
      const playlist = await Playlist.create({
        name: title,
        owner: user,
      });
      console.log(playlist);


      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { $push: { playlists: playlist._id } },
        { new: true, useFindAndModify: false }
      );

      if(!updatedUser) { res.status(500).json({ error: "An error occurred while updating user's playlist" }); }
      // console.log(updatedUser);
  
      res.status(200).json(playlist);
  
    } catch (error) {
      console.error("Error creating playlist:", error.message);
      res.status(500).json({ error: "An error occurred while creating the playlist" });
    }
  }
  else{
    try {
      const song = await Song.findById(song_id);
  
      const title = song ? song.title : res.status(400).json({ message: 'Song not found' });
  
      const playlist = await Playlist.create({
        name: title,
        tracks: [song._id], // Inserting song._id into the 'tracks' array
        owner: user._id,
      });
  
      console.error("Playlist created:", playlist);

      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { $push: { playlists: playlist._id } },
        { new: true, useFindAndModify: false }
      );

      if(!updatedUser) { res.status(500).json({ error: "An error occurred while updating user's playlist" }); }
      console.log(updatedUser);

      res.status(200).json(playlist);
  
    } catch (error) {
      console.error("Error creating playlist:", error.message);
      res.status(500).json({ error: "An error occurred while creating the playlist" });
    }
  }
};

// Set up storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/playlists');  // Define where to store the images (ensure this folder exists)
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);  // Create unique filename
  },
});


const upload = multer({ storage: storage });

const updatePlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  let coverart = req.file ? req.file.path.replace(/\\/g, '/') : null;
  console.log("PlaylistId:", playlistId);
  console.log("Name:", name);
  console.log("Description:", description);
  console.log("Image Path:", coverart);

  try {
    // Find the playlist by ID
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    // If there's a new image, delete the old one from the server
    if (coverart && playlist.coverart) {
      const oldImagePath = path.join(__dirname, '..', 'uploads', playlist.coverart);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);  // Delete the old image file
      }
    }

    // Update playlist details
    playlist.name = name || playlist.name;
    playlist.description = description || playlist.description;
    if (coverart) {
      playlist.coverart = coverart;  // Update image if a new one is uploaded
    }

    // Save the updated playlist to the database
    const updatedPlaylist = await playlist.save();
    console.log("Updated Playlist:", updatePlaylist);

    res.json(updatedPlaylist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

//get single Playlist
const getPlaylist = async (req, res) => {
  const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No such User" });
    }

    const playlist = await Playlist.findById(id)
      .populate({
        path: 'owner',
        model: 'User',
      })
      .populate({
        path: 'tracks',
        model: 'Song', 
        populate: {
          path: 'album',
          model: 'Album',
        },
      });
      
    console.log(playlist);

    if (!playlist) {
        return res.status(404).json({ error: "No such Playlist" });
    }
    
    res.status(200).json(playlist);
};

//delete a Playlist
const deletePlaylist = async (req, res) => {
  const { playlistid } = req.body;


  if (!mongoose.Types.ObjectId.isValid(playlistid)) {
    return res.status(404).json({ error: "No such Playlist" });
  }

  const playlist = await Playlist.findOneAndDelete({ _id: playlistid });

  if (!playlist) {
    return res.status(404).json({ error: "No such Playlist" });
  }

  res.status(200).json(playlist);
};

//update a Playlist
// const updatePlaylist = async (req, res) => {
//   const { id } = req.params;
//   console.log(id);

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(404).json({ error: "No such Playlist" });
//   }

//   const playlist = await Playlist.findOneAndUpdate(
//     { _id: id },
//     {
//       ...req.body,
//     }
//   );

//   if (!playlist) {
//     return res.status(404).json({ error: "No such Playlist" });
//   }

//   res.status(200).json(playlist);
// };

const addSong = async (req, res) => {
  const { playlistid, songid } = req.body;
  console.log(playlistid);
  console.log(songid);

  try {
    const playlist = await Playlist.findById(playlistid);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    const song = await Song.findById(songid);

    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }

    if (playlist.tracks.includes(songid)) {
      return res.status(400).json({ message: 'Song is already in the playlist' });
    }

    playlist.tracks.push(song._id);

    await playlist.save();

    res.status(200).json({
      message: 'Song added to playlist successfully',
      playlist,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding song to playlist', error });
  }
};

const removeSong = async (req, res) => {
  const { playlistid, songid } = req.body;

  try {
    const playlist = await Playlist.findById(playlistid);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    const song = await Song.findById(songid);

    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }

    if (!playlist.tracks.includes(songid)) {
      return res.status(400).json({ message: 'Song is not in the playlist' });
    }

    playlist.tracks.pull(song._id);

    await playlist.save();

    res.status(200).json({
      message: 'Song removed from playlist successfully',
      playlist,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error removing song from playlist', error });
  }
};


const deleteAll = async (req, res) => {
  try {
    const result = await Playlist.deleteMany({});
    console.log(`Deleted ${result.deletedCount} playlists`);
    res.status(200).json({ Deleted: `Deleted ${result.deletedCount} playlists` });

  } catch (error) {
    console.error('Error deleting playlists:', error);
    return res.status(404).json({ error: "'Error deleting playlists" });

  }
};

module.exports = {
  createPlaylist,
  getPlaylists,
  getPlaylist,
  deletePlaylist,
  updatePlaylist,
  deleteAll,
  addSong,
  removeSong,
  upload
};
