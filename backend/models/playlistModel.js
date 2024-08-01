const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlaylistSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true },
  public: { type: Boolean, required: true },
  coverart: { type: String },
  followers: { type: Number, default: 0 },
  tracks: [
    {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'Music', required: true },
      position: { type: Number, required: true }
    }
  ]
});

const Playlist = mongoose.model("Playlist", PlaylistSchema);

module.exports = Playlist;
