const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel');
require('dotenv').config();

const protect = asyncHandler(async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header.
            token = req.headers.authorization.split(' ')[1];  // Access the second element of the array.

            // Verify token.
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token.
            req.user = await User.findById(decoded.id).select('-password');
            if (req.user.blocked) {
               
                res.status(403).json({status:401, message: 'User is blocked. Access denied.' });
                return;
            }
            if (!req.user || req.user.role !== 'User') {
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


module.exports={
    protect
}