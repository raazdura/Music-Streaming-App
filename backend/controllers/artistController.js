const Artist = require("../models/artistsModel");
const User = require("../models/User");
const Song = require("../models/songModel")
const Album = require("../models/albumModel")
const mongoose = require("mongoose");
const path = require('path');
const multer = require('multer');
const fs = require("fs");

const getArtists = async (req, res) => {
  const artistIds = req.query.ids ? req.query.ids.split(',') : [];

  try {
    let artists;

    if (artistIds.length === 0) {
      // Fetch all artists sorted by creation date if no IDs are provided
      artists = await Artist.find({}).sort({ createdAt: -1 });
    } else {
      // Fetch specific artists by IDs
      artists = await Artist.find({ _id: { $in: artistIds } });
    }

    res.header("Content-Type", "application/json");
    res.status(200).json(artists);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching artists" });
  }
};

// Define storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/artists');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

const createArtist = async (req, res) => {
  try {
    const { name, genres} = req.body;
    const image = req.file ? req.file.path.replace(/\\/g, '/') : null;

    if (!name || !image) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    // Log received data
    console.log("Received Data:");
    console.log("Name:", name);
    console.log("Genres:", genres);
    console.log("Image Path:", image);

    const artist = await Artist.create({
      name,
      genres,
      imagepath: image
    });

    res.status(200).json(artist);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

// Get single artist
const getArtist = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such Artist" });
  }

  try {
    const artistDetails = await Artist.findById(id)
      .populate({
        path: 'albums',
        model: 'Album',
      })
      .populate({
        path: 'tracks',
        model: 'Song',
        populate: {
          path: 'album',
          model: 'Album',
        },
      });

    res.status(200).json(artistDetails);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while fetching the Artist" });
  }
};

// Delete an Artist
const deleteArtist = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such Artist" });
  }

  try {
    const artist = await Artist.findOneAndDelete({ _id: id });

    if (!artist) {
      return res.status(404).json({ error: "No such Artist" });
    }

    res.status(200).json(artist);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while deleting the Artist" });
  }
};

// Update an Artist
const updateArtist = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such Artist" });
  }

  try {
    const artist = await Artist.findOneAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true } // To return the updated document
    );

    if (!artist) {
      return res.status(404).json({ error: "No such Artist" });
    }

    res.status(200).json(artist);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while updating the Artist" });
  }
};

const followArtist = async (req, res) => {
  const { userid, artistId } = req.body;

  try {
    // Logic to add the follow relationship in the database
    // For example, you could use Mongoose to find the user and update their followed artists
    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const artist = await Artist.findById(artistId);
    if (!user) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    // Assuming you have a "followedArtists" field in your user model
    user.followedArtists.push(artistId);
    await user.save();

    artist.followersCount += 1; // Increment the follower count
    await artist.save();

    res.status(200).json({ message: 'Artist followed successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error following artist', error });
  }
}

module.exports = {
  createArtist,
  getArtists,
  getArtist,
  deleteArtist,
  updateArtist,
  followArtist,
  upload
};
