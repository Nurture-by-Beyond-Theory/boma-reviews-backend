import mongoose, { Schema, Document, Types } from 'mongoose';

// TypeScript interface for the Notification schema
export interface INotification extends Document {
  type: 'flagged_content' | 'suspicious_activity';
  message: string;
  user?: Types.ObjectId;
  createdAt?: Date;
  viewed?: boolean;
}

// Mongoose schema using the TypeScript interface
const notificationSchema: Schema<INotification> = new Schema(
  {
    type: { 
      type: String, 
      enum: ['flagged_content', 'suspicious_activity'], 
      required: true 
    },
    message: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Associated user
    createdAt: { type: Date, default: Date.now },
    viewed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Exporting the model with the INotification interface
const Notification = mongoose.model<INotification>('Notification', notificationSchema);
export default Notification;

