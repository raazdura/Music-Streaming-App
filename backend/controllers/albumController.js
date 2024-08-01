const Album = require("../models/albumModel");
const Artist = require("../models/artistsModel");
const mongoose = require("mongoose");
const path = require('path');
const multer = require('multer');
const fs = require("fs");

const getAlbums = async (req, res) => {
  const albumIds = req.query.ids ? req.query.ids.split(',') : [];

  try {
    let albums;

    if (albumIds.length === 0) {
      // Fetch all Albums sorted by creation date if no IDs are provided
      albums = await Album.find({}).sort({ createdAt: -1 });
    } else {
      // Fetch specific Albums by IDs
      albums = await Album.find({ _id: { $in: albumIds } });
    }

    res.header("Content-Type", "application/json");
    res.status(200).json(albums);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching Albums" });
  }
};

const updateAlbumTracks = async (artistIds, albumIds) => {
  try {
    console.log("Artist IDs:", artistIds);
    console.log("Album IDs:", albumIds);

    const result = await Artist.updateMany(
      { _id: { $in: artistIds } },
      { $push: { albums: { $each: albumIds } } }
    );

    console.log("Update Result:", result);

    if (result.n > 0) {
      console.log(`Artists matched: ${result.n}, Artists modified: ${result.nModified}`);
    } else {
      console.log("No artists matched. Check artist IDs:", artistIds);
    }
  } catch (error) {
    console.error(`Error updating artist albums: ${error.message}`);
    throw error;
  }
};

// Define storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/albums');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

const createAlbum = async (req, res) => {
  const { name, release_date, artists } = req.body;
  const image = req.file ? req.file.path.replace(/\\/g, '/') : null;
  console.log("Image Path:", image);

  let emptyFields = [];
  if (!name) {
      emptyFields.push("name");
  }
  if (!release_date) {
      emptyFields.push("release_date");
  }
  if (emptyFields.length > 0) {
      return res.status(400).json({ error: "Please fill in all fields", emptyFields });
  }

  try {
      const newAlbum = await Album.create({
          name,
          release_date,
          artists,
          image
      });

      // Update each artist with the new song ID
      await updateAlbumTracks(artists, [newAlbum._id]);

      res.status(200).json(newAlbum);
  } catch (error) {
      console.error(error.message);
      res.status(400).json({ error: error.message });
  }
};

// Get single Album
const getAlbum = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such album" });
  }

  try {
    const album = await Album.findById(id);

    if (!Album) {
      return res.status(404).json({ error: "No such album" });
    }

    res.status(200).json(album);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching the Album" });
  }
};

// Delete an Album
const deleteAlbum = async (req, res) => {
  const { albumId } = req.params;

    try {
        // Find the album
        const album = await Album.findById(albumId).populate('tracks');
        if (!album) {
            return res.status(404).json({ error: 'Album not found' });
        }

        // Get the song IDs
        const trackIds = album.tracks.map(track => track._id);

        // Delete the album
        await Album.findByIdAndDelete(albumId);

        // Delete the tracks
        await track.deleteMany({ _id: { $in: trackIds } });

        // Update artists to remove the track IDs
        await Artist.updateMany(
            { tracks: { $in: trackIds } },
            { $pull: { tracks: { $in: trackIds } } }
        );

        res.status(200).json({ message: 'Album and related tracks deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

// Update an Album
const updateAlbum = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such Album" });
  }

  try {
    const Album = await Album.findOneAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true } // To return the updated document
    );

    if (!Album) {
      return res.status(404).json({ error: "No such Album" });
    }

    res.status(200).json(Album);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while updating the Album" });
  }
};

module.exports = {
  createAlbum,
  getAlbums,
  getAlbum,
  deleteAlbum,
  updateAlbum,
  upload
};
