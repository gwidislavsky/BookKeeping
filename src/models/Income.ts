import mongoose, { Schema, Document } from "mongoose";
// ---------- מודל הכנסה ----------
export interface IIncome extends Document {
  receiptNumber: number;
  date: Date;
  client: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  amount: number;
  vat: number;
  paymentMethod: "cash" | "credit" | "check" | "bank_transfer";
  details?: string;
  printDate?: Date;
  paymentDetails: {
    last4Digits?: string;
    paymentsCount?: number;
    checkNumber?: string;
    accountNumber?: string;
    bankNumber?: string;
    dueDate?: Date;
  };
}

const IncomeSchema: Schema = new Schema({
  receiptNumber: { type: Number, required: true, unique: true },
  date: { type: Date, required: true },
  client: { type: Schema.Types.ObjectId, ref: "Client", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User" }, // אופציונלי
  amount: { type: Number, required: true },
  vat: { type: Number, required: true },
  paymentMethod: { type: String, enum: ["cash", "credit", "check", "bank_transfer"], required: true },
  details: { type: String },
  printDate: { type: Date },
  paymentDetails: {
    last4Digits: String,
    paymentsCount: Number,
    checkNumber: String,
    accountNumber: String,
    bankNumber: String,
    dueDate: Date,
  },
});

export const Income = mongoose.model<IIncome>("Income", IncomeSchema);