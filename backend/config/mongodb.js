import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log('MongoDB Connected successfully');
        });

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.set('bufferCommands', false);

        if (!process.env.MONGODB_URL) {
            throw new Error("MONGODB_URL is not defined in environment variables");
        }

        // Use the connection string as is, or append database name if needed
        const connectionUrl = process.env.MONGODB_URL.includes('?') 
            ? process.env.MONGODB_URL 
            : `${process.env.MONGODB_URL}/e-commerce`;

        await mongoose.connect(connectionUrl, {
            serverSelectionTimeoutMS: 5000, // Keep trying to connect for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            family: 4 // Use IPv4, skip trying IPv6
        });
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
        // Don't exit process in serverless, but log it clearly
    }
}

export default connectDB;