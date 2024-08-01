const Playlist = require("../models/playlistModel");
const mongoose = require("mongoose");
const multer = require('multer');

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

// Define storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.fieldname === 'image') {
        cb(null, 'images/playlists');
      }
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
});
  
const upload = multer({ storage: storage });

// CreatePlaylist Controller
const createPlaylist = async (req, res) => {
  const { name, description, owner, release_date, public } = req.body;
  const image = req.files['image'] ? req.files['image'][0].path : null;

  let emptyFields = [];

  if (!name) {
    emptyFields.push("name");
  }
  if (!owner) {
    emptyFields.push("owner");
  }
  if (!release_date) {
    emptyFields.push("release_date");
  }
  if (!public) {
    emptyFields.push("public");
  }
  if (emptyFields.length > 0) {
    return res.status(400).json({ error: "Please fill in all fields", emptyFields });
  }

  try {
    // Normalize paths to use forward slashes. Change \ to /
    const normalizedimage = image ? image.replace(/\\/g, '/') : null;
    
    const playlist = await Playlist.create({
        name,
        description,
        owner,
        public,
        coverart: normalizedimage,
        release_date,
        // followers,
        // tracks: JSON.parse(tracks) // assuming tracks is sent as a JSON string
    });
    res.status(200).json(playlist);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

//get single Playlist
const getPlaylist = async (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No such Playlist" });
    }

    const playlist = await Playlist.findById({ _id: id });

    if (!playlist) {
        return res.status(404).json({ error: "No such Playlist" });
    }
    
    res.status(200).json(playlist);
  };

//delete a Playlist
const deletePlaylist = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such Playlist" });
  }

  const playlist = await Playlist.findOneAndDelete({ _id: id });

  if (!playlist) {
    return res.status(404).json({ error: "No such Playlist" });
  }

  res.status(200).json(playlist);
};

//update a Playlist
const updatePlaylist = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such Playlist" });
  }

  const playlist = await Playlist.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!playlist) {
    return res.status(404).json({ error: "No such Playlist" });
  }

  res.status(200).json(playlist);
};

module.exports = {
  createPlaylist,
  getPlaylists,
  getPlaylist,
  deletePlaylist,
  updatePlaylist,
  upload
};
