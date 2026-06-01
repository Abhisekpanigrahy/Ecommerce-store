import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log('Using existing MongoDB connection');
        return;
    }

    try {
        mongoose.connection.on('connected', () => {
            isConnected = true;
            console.log('MongoDB Connected successfully');
        });

        mongoose.connection.on('error', (err) => {
            isConnected = false;
            console.error('MongoDB connection error:', err);
        });

        if (!process.env.MONGODB_URL) {
            throw new Error("MONGODB_URL is not defined in environment variables");
        }

        // Use the connection string as is, or append database name if needed
        const connectionUrl = process.env.MONGODB_URL.includes('?') 
            ? process.env.MONGODB_URL 
            : `${process.env.MONGODB_URL}/e-commerce`;

        await mongoose.connect(connectionUrl, {
            serverSelectionTimeoutMS: 15000, // Increase to 15 seconds for slower networks
            socketTimeoutMS: 45000,
            family: 4
        });
        
        isConnected = true;
    } catch (error) {
        isConnected = false;
        console.error("Failed to connect to MongoDB:", error.message);
    }
}

export default connectDB;