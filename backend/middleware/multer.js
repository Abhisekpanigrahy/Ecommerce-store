import multer from 'multer';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Use /tmp for Vercel compatibility, otherwise use local uploads folder
const uploadDir = process.env.VERCEL 
    ? path.join(os.tmpdir(), 'uploads') 
    : path.resolve('uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination:function(req, file, callback){
        callback(null, uploadDir);
    },
    filename:function(req, file, callback){
        const uniqueName = `${Date.now()}-${file.originalname}`;
        callback(null, uniqueName);
    }
});

const upload = multer({storage});

export default upload;
