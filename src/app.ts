import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './Routes/User';
import clientRoutes from './Routes/Client';
import supplierRoutes from './Routes/Supplier';
import categoryRoutes from './Routes/Category';
import incomeRoutes from './Routes/Income';
import expenseRoutes from './Routes/Expense';

dotenv.config();
const app = express();
app.use(express.json());

// חיבור כל ה־routers ל־API
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/expenses', expenseRoutes);

// חיבור למסד הנתונים
mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// הפעלת השרת
app.listen(3000, () => console.log('Server running on port 3000'));

export default app;