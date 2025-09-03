import mongoose, { Schema, Document } from "mongoose";

// ---------- מודל ספק ----------
export interface ISupplier extends Document {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  companyId?: string;
}

const SupplierSchema: Schema = new Schema({
  name: { type: String, required: true },
  phone: String,
  email: String,
  address: String,
  companyId: String,
});

export const Supplier = mongoose.model<ISupplier>("Supplier", SupplierSchema);