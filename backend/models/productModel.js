import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Array, required: true },
    category:{ type: String, required: true },
    subCategory:{ type: String, required: true},
    sizes:{ type: Array, required: true },
    bestseller:{ type: Boolean, default: false },
    reviews: {
        type: [
            {
                userId: { type: String, required: true },
                name: { type: String, required: true },
                rating: { type: Number, required: true },
                comment: { type: String, default: "" },
                createdAt: { type: Date, default: Date.now }
            }
        ],
        default: []
    },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    date:{ type: Date, required: true }
})

const productModel = mongoose.models.product || mongoose.model('product', productSchema); 

export default productModel;