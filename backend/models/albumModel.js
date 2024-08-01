const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AlbumSchema = new Schema({
  name: { type: String, required: true},
  image: { type: String },
  release_date: { type: String, required: true },
  artists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }],
  tracks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }], 
});

const Album = mongoose.model("Album", AlbumSchema);

module.exports = Album;
