import mongoose, { Schema, Document } from "mongoose";
// ---------- מודל הוצאה ----------
export interface IExpense extends Document {
  referenceNumber: number;
  date: Date;
  supplier: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
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
  supplier: { type: Schema.Types.ObjectId, ref: "Supplier", required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User" }, // אופציונלי
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