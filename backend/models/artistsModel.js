var mongoose = require("mongoose");

// Artist Schema
var ArtistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    followers: { type: Number, default: 0 },
    genres: [{ type: String }],
    imagepath: { type: String, required: true },
    albums: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }],
    tracks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Artist", ArtistSchema);
