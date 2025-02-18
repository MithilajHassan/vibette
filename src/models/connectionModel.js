import { Schema, model } from 'mongoose';


const ConnectionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  followers: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    default: [],
  },
  following: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      }
    ],
    default: [],
  },
  requested: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      }
    ],
    default: [],
  }
});

export default model("connection", ConnectionSchema);
