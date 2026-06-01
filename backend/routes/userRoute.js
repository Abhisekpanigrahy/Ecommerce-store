import express from 'express';
import { loginUser, registerUser, adminLogin, getUserProfile, addAddress, updateAddress, deleteAddress, updateProfilePic, updateProfileInfo, toggleWishlist } from '../controllers/userController.js';
import authUser from '../middleware/auth.js';


const userRouter = express.Router();

userRouter.post('/register', registerUser); // Route for user registration
userRouter.post('/login', loginUser); // Route for user login       
userRouter.post('/admin', adminLogin); // Route for admin login
userRouter.post('/profile', authUser, getUserProfile); // Route for user profile
userRouter.post('/address/add', authUser, addAddress); // Route for adding address
userRouter.post('/address/update', authUser, updateAddress); // Route for updating address
userRouter.post('/address/delete', authUser, deleteAddress); // Route for deleting address
userRouter.post('/profile/update-pic', authUser, updateProfilePic); // Route for updating profile pic
userRouter.post('/profile/update', authUser, updateProfileInfo); // Route for updating profile info
userRouter.post('/wishlist/toggle', authUser, toggleWishlist); // Route for wishlist toggle

export default userRouter;
