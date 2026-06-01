import validator from 'validator';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}



// Route for user login
const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        // Check if user exists or not
        if (!user) {
            return res.json({ success: false, message: 'User does not exist' });
        }

        const isMatch = await bcryptjs.compare(password, user.password);


        // if password is matched
        if (isMatch) {
            const token = createToken(user._id);
            res.json({ success: true, token });
        }

        // if password is not matched
        else {
            res.json({ success: false, message: 'Invalid credentials' });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}


// Route for user registration
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists or not

        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: 'User already exists' });
        }


        // validating email format and strong password
        if (!validator.isEmail) {
            return res.json({ success: false, message: 'please enter a valid email' });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: 'please enter a strong password' });
        }

        // Hashing password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);


        // Creating new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
        });

        const user = await newUser.save();

        const token = createToken(user._id);

        res.json({ success: true, token });



    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}




// Route for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const adminEmail = process.env.ADMIN_EMAIL?.trim().replace(/^["']|["']$/g, '');
        const adminPassword = process.env.ADMIN_PASSWORD?.trim().replace(/^["']|["']$/g, '');

        if (email.trim() === adminEmail && password === adminPassword) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const getUserProfile = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId;
        const user = await userModel.findById(userId).select('-password');

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, user });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Add Address
const addAddress = async (req, res) => {
    try {
        const { userId, address } = req.body;
        const user = await userModel.findById(userId);
        
        const addressWithId = { ...address, id: Date.now().toString() };
        let addressData = user.addressData || [];
        addressData.push(addressWithId);

        await userModel.findByIdAndUpdate(userId, { addressData });
        res.json({ success: true, message: "Address added successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Update Address
const updateAddress = async (req, res) => {
    try {
        const { userId, addressId, updatedAddress } = req.body;
        const user = await userModel.findById(userId);
        
        let addressData = user.addressData.map(addr => addr.id === addressId ? { ...updatedAddress, id: addressId } : addr);

        await userModel.findByIdAndUpdate(userId, { addressData });
        res.json({ success: true, message: "Address updated successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Delete Address
const deleteAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.body;
        const user = await userModel.findById(userId);
        
        let addressData = user.addressData.filter(addr => addr.id !== addressId);

        await userModel.findByIdAndUpdate(userId, { addressData });
        res.json({ success: true, message: "Address deleted successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Update Profile Pic
const updateProfilePic = async (req, res) => {
    try {
        const { userId, image } = req.body;
        await userModel.findByIdAndUpdate(userId, { image });
        res.json({ success: true, message: "Profile picture updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Toggle wishlist item
const toggleWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.userId || req.body.userId;

        if (!productId) {
            return res.json({ success: false, message: 'Product ID is required.' });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: 'User not found.' });
        }

        const isWishlisted = user.wishlist.includes(productId);
        let wishlist = [...user.wishlist];

        if (isWishlisted) {
            wishlist = wishlist.filter((id) => id !== productId);
        } else {
            wishlist.push(productId);
        }

        user.wishlist = wishlist;
        await user.save();

        const updatedUser = await userModel.findById(userId).select('-password');
        res.json({ success: true, message: isWishlisted ? 'Removed from wishlist.' : 'Added to wishlist.', user: updatedUser });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Update Profile Info
const updateProfileInfo = async (req, res) => {
    try {
        const { userId, name } = req.body;
        await userModel.findByIdAndUpdate(userId, { name });
        res.json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { loginUser, registerUser, adminLogin, getUserProfile, addAddress, updateAddress, deleteAddress, updateProfilePic, updateProfileInfo, toggleWishlist };
