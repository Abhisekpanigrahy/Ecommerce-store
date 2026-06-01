import multer from 'multer';
import fs from 'fs';
import path from 'path';

const uploadDir = path.resolve('uploads');
fs.mkdirSync(uploadDir, { recursive: true });

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
