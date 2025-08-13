import express from 'express';
import { fileURLToPath} from 'url';
import path from 'path';
import chalk from 'chalk';
process.env.FORCE_COLOR = 3;
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import couponRoutes from './routes/couponRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import cookieParser from 'cookie-parser';


//configure env
dotenv.config();

// Resolve __dirname (since you're using ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// connect to DB
import connectDB from './config/db.js';
connectDB();


//App Initialization
const app = express();



//middleware
app.use(cookieParser());
app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true
    }));
app.use(express.json());
app.use(morgan('dev'));

// Server static files from the (public/images/images.jpg)
app.use(express.static(path.join(__dirname, 'public')));


// Route Imports
import authRoutes from './routes/authRout.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';


// API route
 app.use("/api/v1/auth",authRoutes);
 app.use("/api/v1/category", categoryRoutes );
 app.use("/api/v1/product", productRoutes);
 app.use("/api/v1/payment", paymentRoutes);
 app.use("/api/v1/coupon", couponRoutes);
 app.use("/api/v1/cart", cartRoutes);

//Test route
app.get('/',(req,res) => {
    res.send({ 
       messege: 'Welcome to Aircart API'
    });
});
// server start
const port=process.env.PORT || 8080;
const mode=process.env.DEV_MODE || "development";

app.listen(port,() =>{
    console.log(chalk.bgGreen.white(`Server is Running on ${process.env.dev_mode} mode on port ${port}` ));
});