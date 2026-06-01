import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log('MongoDB Connected successfully');
        });

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        if (!process.env.MONGODB_URL) {
            throw new Error("MONGODB_URL is not defined in environment variables");
        }

        // Use the connection string as is, or append database name if needed
        const connectionUrl = process.env.MONGODB_URL.includes('?') 
            ? process.env.MONGODB_URL 
            : `${process.env.MONGODB_URL}/e-commerce`;

        await mongoose.connect(connectionUrl);
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
        // Don't exit process in serverless, but log it clearly
    }
}

export default connectDB;