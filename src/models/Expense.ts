import mongoose, { Schema, Document } from "mongoose";
// ---------- מודל הוצאה ----------
export interface IExpense extends Document {
  referenceNumber: number;
  date: Date;
  supplier: string; // אפשר להחליף ל-ObjectId אם יש מודל ספק
  category: string; // אפשר להחליף ל-ObjectId אם יש מודל קטגוריה
  amount: number;
  vat: number;
  paymentMethod: "cash" | "credit" | "check" | "bank_transfer";
  referenceDoc?: string;
  details?: string;
  fileUrl?: string;
  paymentDetails: {
    last4Digits?: string;
    paymentsCount?: number;
    checkNumber?: string;
    accountNumber?: string;
    bankNumber?: string;
    dueDate?: Date;
  };
}

const ExpenseSchema: Schema = new Schema({
  referenceNumber: { type: Number, required: true, unique: true },
  date: { type: Date, required: true },
  supplier: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  vat: { type: Number, required: true },
  paymentMethod: { type: String, enum: ["cash", "credit", "check", "bank_transfer"], required: true },
  referenceDoc: { type: String },
  details: { type: String },
  fileUrl: { type: String },
  paymentDetails: {
    last4Digits: String,
    paymentsCount: Number,
    checkNumber: String,
    accountNumber: String,
    bankNumber: String,
    dueDate: Date,
  },
});
export const Expense = mongoose.model<IExpense>("Expense", ExpenseSchema);