import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import newsletterRouter from './routes/newsletterRoute.js';



//  app congig 
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();


// middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());

// Safe static file serving
const uploadPath = process.env.VERCEL ? '/tmp/uploads' : 'uploads';
app.use('/uploads', express.static(uploadPath));



//  api endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/newsletter', newsletterRouter);




app.get('/', (req, res) => {
    res.send('API Is Working Properly');
});


app.listen(port, () => {
    console.log('-------------------------------------------');
    console.log('SERVER STARTED ON PORT: ' + port);
    console.log('TIME:', new Date().toLocaleString());
    console.log('-------------------------------------------');
});
