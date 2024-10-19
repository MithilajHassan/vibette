const mongoose = require('mongoose')
const nodemon = require('nodemon');
// @desc    Mongoose configuration
// @file   < Config >
// @access  Private


const connect = async() => {
    try {
        await mongoose.connect("mongodb://localhost:27017/VibeHunt")
        console.log('mongoDB is connected');
    } catch (error) {
        console.log(error);
        nodemon.restart();
    }
}

module.exports = connect;

