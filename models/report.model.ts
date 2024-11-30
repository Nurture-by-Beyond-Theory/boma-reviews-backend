import mongoose, { Schema, Document, Types } from 'mongoose';

// TypeScript interface for the Report schema
export interface IReport extends Document {
  reportingUser: Types.ObjectId;
  reportedReview: Types.ObjectId;
  reportReason: string;
  status?: 'pending' | 'resolved';
  createdAt?: Date;
  updatedAt?: Date;
}

// Mongoose schema with the defined interface for Report
const reportSchema: Schema<IReport> = new Schema(
  {
    reportingUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reportedReview: { type: mongoose.Schema.Types.ObjectId, ref: 'Review', required: true },
    reportReason: { type: String, required: true },
    status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
  },
  { timestamps: true }
);

// Exporting the model with the IReport interface applied
const Report = mongoose.model<IReport>('Report', reportSchema);
export default Report;
