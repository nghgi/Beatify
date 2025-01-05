const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'active'
    },
    imageUrl: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },

    email_verfied: {
      type: Boolean,
      required: true,
    },

    favourites: [
      {
        songId: String,
      },
    ],

    role: {
      type: String,
      required: true,
    },

    auth_time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", UserSchema);
