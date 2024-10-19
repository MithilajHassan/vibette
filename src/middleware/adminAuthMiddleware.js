const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
require('dotenv').config();

const protect = asyncHandler(async (req, res, next) => {
    let token;
     console.log('hi');
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header.
            token = req.headers.authorization.split(' ')[1];  // Access the second element of the array.

            // Verify token.
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get admin from the token by email.
            req.admin = await User.findById(decoded.id).select('-password');
            // Check if the user is an admin
            if (!req.admin || req.admin.role !== 'Admin') {
                res.status(403).json({ status: 403, message: 'Forbidden. Admin access required.' });
                return;
            }
            next();
        } catch (error) {
            console.log(error);
            res.status(401);
            throw new Error('Not Authorized');
        }
    }

    if (!token) {
        console.log('indieeeeeeee');
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

module.exports = {
    protect
};
