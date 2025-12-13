const mongoose = require('mongoose');

/**
 * Establishes connection to MongoDB database
 * @returns {Promise<void>}
 */
async function connectDB() {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            throw new Error('MONGO_URI is not set in environment');
        }

        // Connect to MongoDB. Mongoose 7+ no longer requires or supports
        // `useNewUrlParser` and `useUnifiedTopology` options — let mongoose
        // use its sensible defaults.
        await mongoose.connect(uri);
        console.log('✓ MongoDB connected successfully');
        
       
        
        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected. Attempting to reconnect...');
        });
        
        mongoose.connection.on('reconnected', () => {
            console.log('✓ MongoDB reconnected');
        });
        
    } catch (error) {
        console.error("✗ MongoDB Connection Error:", error && error.message ? error.message : String(error));
        process.exit(1);
    }
}

module.exports = connectDB;