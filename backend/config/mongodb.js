import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log('MongoDB Connected successfully');
        });

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        // Enable buffering again to handle initial connection delay gracefully
        mongoose.set('bufferCommands', true);

        if (!process.env.MONGODB_URL) {
            throw new Error("MONGODB_URL is not defined in environment variables");
        }

        // Use the connection string as is, or append database name if needed
        const connectionUrl = process.env.MONGODB_URL.includes('?') 
            ? process.env.MONGODB_URL 
            : `${process.env.MONGODB_URL}/e-commerce`;

        await mongoose.connect(connectionUrl, {
            serverSelectionTimeoutMS: 10000, // Increase to 10 seconds
            socketTimeoutMS: 45000,
            family: 4
        });
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
        // Don't exit process in serverless, but log it clearly
    }
}

export default connectDB;