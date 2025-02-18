import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const protect = asyncHandler(async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header.
            token = req.headers.authorization.split(' ')[1];  // Access the second element of the array.
            console.log('token',token);
            
            // Verify token.
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('decoded',decoded);
            

            // Get user from the token.
            req.user = await User.findById(decoded.id).select('-password');
            console.log('request',req.user);
            
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


export {
    protect
}