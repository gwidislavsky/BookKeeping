import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  businessType: "זעיר" | "פטור" | "מורשה";
  email?: string;
  // אפשר להוסיף שדות נוספים לפי הצורך
} 

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  businessType: { type: String, enum: ["זעיר", "פטור", "מורשה"], required: true },
  email: String,
});

export const User = mongoose.model<IUser>("User", UserSchema);