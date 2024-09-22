const Playlist = require("../models/playlistModel");
const User = require("../models/User");
const Song = require("../models/songModel");
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

// CreatePlaylist Controller
const createPlaylist = async (req, res) => {
  const { song_id, user_id } = req.body;

  console.log("Song ID:", song_id);  // Log to see the song_id
  console.log("User ID:", user_id);  // Log to see the user_id

  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return res.status(404).json({ error: "No such User" });
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
        owner: user,
      });
  
      res.status(200).json(playlist);
  
    } catch (error) {
      // console.error("Error creating playlist:", error.message);
      res.status(500).json({ error: "An error occurred while creating the playlist" });
    }
  }
};


//get single Playlist
const getPlaylist = async (req, res) => {
    const user_id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(user_id)) {
        return res.status(404).json({ error: "No such User" });
    }

    const playlist = await Playlist.find({ _id: user_id });

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
};
