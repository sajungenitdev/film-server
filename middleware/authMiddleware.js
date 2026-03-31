const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;
    
    console.log('=== Auth Middleware Debug ===');
    console.log('Headers received:', JSON.stringify(req.headers, null, 2));
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            console.log('Token extracted:', token);
            
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Decoded token:', decoded);
            
            // Get user from token
            req.user = await User.findById(decoded.id).select('-password');
            console.log('User found:', req.user ? req.user.email : 'No user found');
            
            if (!req.user) {
                console.log('User not found in database');
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }
            
            console.log('Auth successful for user:', req.user.email);
            next();
        } catch (error) {
            console.error('Auth middleware error:', error.message);
            console.error('Error type:', error.name);
            
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token'
                });
            }
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token expired'
                });
            }
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }
    }
    
    if (!token) {
        console.log('No token provided');
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no token'
        });
    }
};

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Access denied. Admin only.'
        });
    }
};

module.exports = { protect, adminOnly };