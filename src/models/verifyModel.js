import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const verifySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    trim: true,
    match: emailRegex,
    set: function (value) {
      return value.toLowerCase();
    }
  },

  password: {
    type: String,
  },

  phone: {
    type: String,
    trim: true,
    minlength: 10
  },

  token: {
    type: String || Number
  },

  used: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true
});


export default model('verify', verifySchema);
