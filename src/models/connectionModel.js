const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConnectionSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  followers: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    default: [],
  },
  following: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      }
    ],
    default: [],
  },
  requested: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      }
    ],
    default: [],
  }
});

module.exports = mongoose.model("connection", ConnectionSchema);
