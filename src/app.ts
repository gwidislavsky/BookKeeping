import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './Routes/User';
import clientRoutes from './Routes/Client';
import supplierRoutes from './Routes/Supplier';
import categoryRoutes from './Routes/Category';
import incomeRoutes from './Routes/Income';
import expenseRoutes from './Routes/Expense';
import uploadRouter from './Routes/Upload';
import receiptRouter from './Routes/Receipt';
import reportRouter from './Routes/Report';
import { connectDB } from './config/db';
connectDB();
dotenv.config();
const app = express();
app.use(express.json());

// חיבור כל ה־routers ל־API
app.use('/api/upload', uploadRouter);
app.use('/api/receipts', receiptRouter);
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/reports', reportRouter);

// חיבור למסד הנתונים
mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// הפעלת השרת
app.listen(3000, () => console.log('Server running on port 3000'));

export default app;