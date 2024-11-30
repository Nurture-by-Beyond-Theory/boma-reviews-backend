import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import reviewRoutes from './routes/review.routes'; 
import { protect, admin } from './middleware/auth.middleware';
import adminRoutes from './routes/admin.routes';
import propertyRoutes from './routes/property.routes';
import userRoutes from './routes/user.routes';

dotenv.config();

const app = express();
connectDB();

app.use(
   cors({
     origin: '*', // Allow all origins. Replace '*' with your frontend's URL in production, e.g., 'http://localhost:3000'
     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed HTTP methods
     allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
     credentials: true,
   })
 );

app.use(express.json());

// Protected /api/reviews routes
app.use('/api/reviews', protect, reviewRoutes);

// Admin routes
app.use('/api/admin', adminRoutes);
// app.use('/api/admin', require('./routes/admin.routes'));

// Example admin protected route
// app.get('/api/admin/data', protect, admin, (req: Request, res: Response) => {
   // res.json({ message: 'This is protected admin data' });
// });

// User and property routes
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);

export default app; // Export the app
