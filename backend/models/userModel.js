import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, default: "" },
    addressData: { type: Array, default: [] },
    cartData: { type: Object, default: {} },
    wishlist: { type: [String], default: [] }
},{minimize: false});


const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel;