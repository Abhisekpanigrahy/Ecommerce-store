import mongoose from 'mongoose';
import 'dotenv/config';
import productModel from './models/productModel.js';

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/e-commerce`);
        console.log('MongoDB Connected');
    } catch (error) {
        console.log('MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

// Sample products data
const sampleProducts = [
    {
        name: "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse",
        description: "A beautiful striped blouse with flutter sleeves and peplum hem. Perfect for casual and formal occasions.",
        price: 49.99,
        image: [
            "https://via.placeholder.com/300x400?text=Product+1",
            "https://via.placeholder.com/300x400?text=Product+1+Alt"
        ],
        category: "Women",
        subCategory: "Topwear",
        sizes: ["S", "M", "L", "XL"],
        bestseller: true,
        date: Date.now()
    },
    {
        name: "Men's Casual Shirt",
        description: "High-quality casual shirt made from premium cotton fabric. Comfortable and stylish.",
        price: 59.99,
        image: [
            "https://via.placeholder.com/300x400?text=Product+2",
            "https://via.placeholder.com/300x400?text=Product+2+Alt"
        ],
        category: "Men",
        subCategory: "Topwear",
        sizes: ["M", "L", "XL", "XXL"],
        bestseller: true,
        date: Date.now()
    },
    {
        name: "Kids' T-Shirt",
        description: "Soft and comfortable t-shirt for kids. Available in multiple colors.",
        price: 29.99,
        image: [
            "https://via.placeholder.com/300x400?text=Product+3",
            "https://via.placeholder.com/300x400?text=Product+3+Alt"
        ],
        category: "Kids",
        subCategory: "Topwear",
        sizes: ["XS", "S", "M", "L"],
        bestseller: false,
        date: Date.now()
    },
    {
        name: "Women's Denim Jeans",
        description: "Classic denim jeans with perfect fit. Durable and stylish for everyday wear.",
        price: 79.99,
        image: [
            "https://via.placeholder.com/300x400?text=Product+4",
            "https://via.placeholder.com/300x400?text=Product+4+Alt"
        ],
        category: "Women",
        subCategory: "Bottomwear",
        sizes: ["XS", "S", "M", "L", "XL"],
        bestseller: true,
        date: Date.now()
    },
    {
        name: "Men's Formal Trousers",
        description: "Premium formal trousers perfect for office and business occasions.",
        price: 89.99,
        image: [
            "https://via.placeholder.com/300x400?text=Product+5",
            "https://via.placeholder.com/300x400?text=Product+5+Alt"
        ],
        category: "Men",
        subCategory: "Bottomwear",
        sizes: ["30", "32", "34", "36", "38"],
        bestseller: false,
        date: Date.now()
    },
    {
        name: "Kids' Shorts",
        description: "Comfortable shorts for kids with breathable fabric. Great for outdoor activities.",
        price: 34.99,
        image: [
            "https://via.placeholder.com/300x400?text=Product+6",
            "https://via.placeholder.com/300x400?text=Product+6+Alt"
        ],
        category: "Kids",
        subCategory: "Bottomwear",
        sizes: ["XS", "S", "M", "L"],
        bestseller: true,
        date: Date.now()
    },
    {
        name: "Women's Summer Dress",
        description: "Light and airy summer dress perfect for beach and casual outings.",
        price: 69.99,
        image: [
            "https://via.placeholder.com/300x400?text=Product+7",
            "https://via.placeholder.com/300x400?text=Product+7+Alt"
        ],
        category: "Women",
        subCategory: "Dress",
        sizes: ["XS", "S", "M", "L", "XL"],
        bestseller: true,
        date: Date.now()
    },
    {
        name: "Men's Polo Shirt",
        description: "Classic polo shirt in premium material. Versatile for casual and semi-formal wear.",
        price: 54.99,
        image: [
            "https://via.placeholder.com/300x400?text=Product+8",
            "https://via.placeholder.com/300x400?text=Product+8+Alt"
        ],
        category: "Men",
        subCategory: "Topwear",
        sizes: ["S", "M", "L", "XL", "XXL"],
        bestseller: false,
        date: Date.now()
    }
];

// Seed the database
const seedDatabase = async () => {
    try {
        await connectDB();
        
        // Clear existing products
        await productModel.deleteMany({});
        console.log('Cleared existing products');
        
        // Insert sample products
        const result = await productModel.insertMany(sampleProducts);
        console.log(`Successfully added ${result.length} products to the database!`);
        
        // Display added products
        console.log('\nAdded Products:');
        result.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name} - $${product.price}`);
        });
        
        process.exit(0);
    } catch (error) {
        console.log('Error seeding database:', error.message);
        process.exit(1);
    }
};

// Run the seed script
seedDatabase();
