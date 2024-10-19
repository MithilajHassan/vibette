
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const verifySchema = new Schema({
  userName: {
    type: String,
    required: true,
    trim: true,
    minlength: 4,
    maxlength: 30,
    set: function (value) {
      return value.toLowerCase();
    },
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

  token:{
    type: String || Number
  },

  used:{
    type:Boolean,
    default:false
  }

},{
  timestamps: true
});


module.exports = model('verify', verifySchema);
