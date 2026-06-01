import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
  secure: true
});

const remoteUrl = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';
console.log('testing remote upload URL', remoteUrl);
cloudinary.uploader.upload(remoteUrl, {
  resource_type: 'image',
  quality: 'auto',
  fetch_format: 'auto'
})
  .then((res) => {
    console.log('remote upload ok', res.secure_url);
  })
  .catch((err) => {
    console.error('remote upload error', err.message, err.http_code, err.http_body || err);
  });

