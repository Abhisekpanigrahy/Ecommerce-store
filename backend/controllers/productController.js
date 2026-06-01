import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModel.js';
import userModel from '../models/userModel.js';



// function for add product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];


        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);


        console.log("Filtered images:", images);

        let imagesUrl = await Promise.all(

            images.map(async (item) => {
                try {
                    let result = await cloudinary.uploader.upload(item.path, { 
                        resource_type: 'image',
                        quality: 'auto',
                        fetch_format: 'auto'
                    });
                    return result.secure_url;
                } catch (error) {
                    console.error('Cloudinary upload failed:', error.message, error.http_code || error);
                    throw new Error('Cloudinary upload failed: ' + error.message);
                }
            })
        )

        console.log(name, description, price, category, subCategory, sizes, bestseller);
        console.log(imagesUrl);


        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            image: imagesUrl,
            date: Date.now()
        }

        console.log(productData);
        const product = new productModel(productData);
        await product.save();

        res.json({ success: true, message: "Product added successfully" });


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}





// function for list product
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}





// function for submit product review
const addReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const reviewerId = req.userId || req.body.userId;

        if (!productId || !rating) {
            return res.json({ success: false, message: "Product ID and rating are required." });
        }

        const product = await productModel.findById(productId);
        if (!product) {
            return res.json({ success: false, message: "Product not found." });
        }

        const user = await userModel.findById(reviewerId);
        if (!user) {
            return res.json({ success: false, message: "User not found." });
        }

        const numericRating = Number(rating);
        if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
            return res.json({ success: false, message: "Rating must be a number between 1 and 5." });
        }

        const existingReviewIndex = product.reviews.findIndex(
            (review) => review.userId === reviewerId
        );

        const reviewPayload = {
            userId: reviewerId,
            name: user.name || "Anonymous",
            rating: numericRating,
            comment: comment?.trim() || "",
            createdAt: new Date()
        };

        if (existingReviewIndex >= 0) {
            product.reviews[existingReviewIndex] = reviewPayload;
        } else {
            product.reviews.push(reviewPayload);
        }

        product.reviewCount = product.reviews.length;
        product.averageRating =
            product.reviews.reduce((sum, item) => sum + item.rating, 0) / product.reviewCount;

        await product.save();

        res.json({ success: true, message: "Review submitted successfully.", product });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// function for removing product 
const removeProduct = async (req, res) => {

    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Product Removed Successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}




// function for single product info
const singleProduct = async (req, res) => {

    try {
        const { productId } = req.body;
        const product = await productModel.findById(productId);
        res.json({ success: true, product });
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    } 
}


// function for update product
const updateProduct = async (req, res) => {
    try {
        const { id, name, description, price, category, subCategory, sizes, bestseller } = req.body;

        const image1 = req.files && req.files.image1 && req.files.image1[0];
        const image2 = req.files && req.files.image2 && req.files.image2[0];
        const image3 = req.files && req.files.image3 && req.files.image3[0];
        const image4 = req.files && req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        let updateData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes)
        };

        if (images.length > 0) {
            let imagesUrl = await Promise.all(
                images.map(async (item) => {
                    try {
                        let result = await cloudinary.uploader.upload(item.path, { 
                            resource_type: 'image',
                            quality: 'auto',
                            fetch_format: 'auto'
                        });
                        return result.secure_url;
                    } catch (error) {
                        console.error('Cloudinary upload failed:', error.message, error.http_code || error);
                        throw new Error('Cloudinary upload failed: ' + error.message);
                    }
                })
            );
            updateData.image = imagesUrl;
        }

        await productModel.findByIdAndUpdate(id, updateData);

        res.json({ success: true, message: "Product updated successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { listProducts, addProduct, addReview, removeProduct, singleProduct, updateProduct };
