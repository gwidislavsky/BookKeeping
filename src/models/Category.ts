import mongoose, { Schema, Document } from "mongoose";
 //---------- מודל קטגוריה ----------
export interface ICategory extends Document {
  name: string;
  description?: string;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  description: String,
});

export const Category = mongoose.model<ICategory>("Category", CategorySchema);