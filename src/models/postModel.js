const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const postSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },

  image: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    trim: true,
   
  },

  date: {
    type: Date,
    default: Date.now,
  },

  likes: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    default: [],
  },

  hidden: {
    type: Boolean,
    default: false,
  },

  blocked: {
    type: Boolean,
    default: false,
  },
  tags: {
    type: [String] ,
    default:[]
  },
  taggedUsers:{
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    default: [],
  },
  edited: {
    type: Date,
    default:Date.now
  },
  commentCount: {
    type: Number,
    default:0
}




},{
  timestamps: true
});


const Post = model("post", postSchema);

module.exports= Post