const mongoose = require("mongoose");
const ArtistSchema = require("../models/artistsModel");

const Schema = mongoose.Schema;

const songSchema = new Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    artists: [{ type: mongoose.Schema.Types.ObjectId, default: 'Unknown Artist', ref: 'Artist' }],
    album: [{ type: mongoose.Schema.Types.ObjectId, default: 'Single Release', ref: 'Album' }],
    coverart: { type: String },
    songpath: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Song", songSchema);
