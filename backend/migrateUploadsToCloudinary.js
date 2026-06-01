import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import connectDB from './config/mongodb.js';
import productModel from './models/productModel.js';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const uploadLocalFile = async (localPath) => {
  try {
    const res = await cloudinary.uploader.upload(localPath, {
      resource_type: 'image',
      quality: 'auto',
      fetch_format: 'auto'
    });
    return res.secure_url;
  } catch (err) {
    console.error('Cloudinary upload error for', localPath, err.message);
    return null;
  }
};

const migrate = async () => {
  await connectDB();

  const products = await productModel.find({});
  console.log('Found', products.length, 'products');

  for (const p of products) {
    let updated = false;
    const newImages = [];
    for (const imgUrl of p.image || []) {
      try {
        if (typeof imgUrl === 'string' && imgUrl.includes('/uploads/')) {
          const filename = imgUrl.split('/').pop();
          const localPath = path.join(process.cwd(), 'uploads', filename);
          if (fs.existsSync(localPath)) {
            console.log('Uploading', localPath);
            const secure = await uploadLocalFile(localPath);
            if (secure) {
              newImages.push(secure);
              updated = true;
              continue;
            }
          } else {
            console.warn('Local file not found:', localPath);
          }
        }
        // not an uploads URL or failed to upload -> keep original
        newImages.push(imgUrl);
      } catch (err) {
        console.error('Error processing image', imgUrl, err.message);
        newImages.push(imgUrl);
      }
    }

    if (updated) {
      p.image = newImages;
      await p.save();
      console.log('Updated product', p._id);
    } else {
      console.log('No updates for product', p._id);
    }
  }

  console.log('Migration complete');
  process.exit(0);
};

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
