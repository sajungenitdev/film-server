const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Mongoose v6+ connects without deprecated options
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Optional: Add event listeners for connection issues
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });
        
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        // Don't exit the process in development
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
};

module.exports = connectDB;