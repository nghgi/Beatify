const mongoose = require("mongoose");

const SongSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },
    songUrl: {
      type: String,
      required: true,
    },
    // album: {
    //   type: String,
    // },
    // artist: {
    //   type: String,
    //   required: true,
    // },
    albumId: { type: mongoose.Schema.Types.ObjectId, ref: "album"},
    artistId: { type: mongoose.Schema.Types.ObjectId, ref: "artist", required: true },
    language: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("song", SongSchema);
