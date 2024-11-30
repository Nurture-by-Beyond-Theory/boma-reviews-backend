import mongoose, { Schema, Document } from 'mongoose';

// TypeScript interface for the User schema
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password?: string;
  authProvider: 'email' | 'google' | 'facebook';
  providerId?: string; // Social provider ID
  role: 'tenant' | 'landlord' | 'admin';  // Enumerated role values
  reviews: mongoose.Types.ObjectId[];
  lastLogin?: Date;
  warningCount?: number;
  createdAt?: Date;
  isSuspended?: boolean;
  suspensionReason?: string | null;
  suspensionExpiry?: Date | null;
  isBanned?: boolean;
  location: {
    country: string;
    state: string;
    address: string;
  };
  tenancyDate?: {
    startDate: Date; // Required
    endDate?: Date;  // Optional
  };
  evidenceOfTenancy?: string; // Optional
}

// Mongoose schema with the defined interface
const userSchema: Schema<IUser> = new Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String }, // Optional to allow social sign-up
  authProvider: {
    type: String,
    enum: ['email', 'google', 'facebook'],
    required: true,
  },
  providerId: { type: String, default: null },
  role: {
    type: String,
    enum: ['tenant', 'landlord', 'admin'],
    required: true,
  },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  lastLogin: { type: Date },
  warningCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  isSuspended: { type: Boolean, default: false },
  suspensionReason: { type: String, default: null },
  suspensionExpiry: { type: Date, default: null },
  isBanned: { type: Boolean, default: false },
  location: {
    country: { type: String, required: true },
    state: { type: String, required: true },
    address: { type: String, required: true },
  },
});

// Exporting the model with the IUser interface applied
const User = mongoose.model<IUser>('User', userSchema);
export default User;



