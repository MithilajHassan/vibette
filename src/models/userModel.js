import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new Schema({
  name:{
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

  profilePic: {
    type: String,
    trim: true,
    default: "https://res.cloudinary.com/di9yf5j0d/image/upload/v1695795823/om0qyogv6dejgjseakej.png",
  },

  phone: {
    type: String,
    trim: true,
    minlength: 10,
    required:true
  },

  bio: {
    type: String,
    trim: true,
    maxlength: 200
  },
  online: {
    type: Boolean,
    default: false,
  },

  blocked: {
    type: Boolean,
    default: false,
  },

  verified: {
    type: Boolean,
    default: false,
  },
  role:{
    type:String,
    default:'User'
  },
  isPrivate:{
    type:Boolean,
    default:false
  },
  backGroundImage:{
    type: String,
    trim: true,
    default:'https://img.freepik.com/free-photo/artistic-blurry-colorful-wallpaper-background_58702-8192.jpg?size=626&ext=jpg&ga=GA1.1.1700460183.1712361600&semt=ais'
  }
 
},{
  timestamps: true
});


export default model('user', userSchema)
