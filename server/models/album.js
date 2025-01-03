const mongoose = require("mongoose");

const albumSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    artistName: {
      type: String,
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("album", albumSchema);
