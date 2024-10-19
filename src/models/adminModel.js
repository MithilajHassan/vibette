const { Schema, model } = require('mongoose');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const adminSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: emailRegex,
    set: function (value) {
      return value.toLowerCase();
    },
  },

  password: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 30,
  },

  profilePic: {
    type: String,
    trim: true,
    default: "https://res.cloudinary.com/di9yf5j0d/image/upload/v1695795823/om0qyogv6dejgjseakej.png",
  }
},{
  timestamps: true
});

const Admin = model("admin", adminSchema);

module.exports = Admin;
