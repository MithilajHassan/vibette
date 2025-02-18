import { connect as _connect } from 'mongoose';
import nodemon from 'nodemon';
// @desc    Mongoose configuration
// @file   < Config >
// @access  Private


const connect = async() => {
    try {
        await _connect(process.env.MONGO_URL)
        console.log('mongoDB is connected');
    } catch (error) {
        console.log(error);
        nodemon.restart();
    }
}

export default connect;

