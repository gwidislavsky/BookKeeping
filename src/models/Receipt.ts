import mongoose, { Schema, Document } from 'mongoose';

export interface IReceipt extends Document {
  date: Date;
  amount: number;
  clientName: string;
  description?: string;
}

const ReceiptSchema = new Schema<IReceipt>({
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  clientName: { type: String, required: true },
  description: { type: String }
});

export const Receipt = mongoose.model<IReceipt>('Receipt', ReceiptSchema);