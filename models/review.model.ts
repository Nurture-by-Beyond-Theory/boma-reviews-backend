import mongoose, { Schema, Document, Types } from 'mongoose';

// TypeScript interface for the Review schema
export interface IReview extends Document {
  tenant: Types.ObjectId;
  property: Types.ObjectId;
  landlord: Types.ObjectId;
  ratings: {
    utilities: number;
    landlord: number;
    neighborhood: number;
  };
  comment: string;
  hidden?: boolean;
  flagged?: boolean;
  reports?: { reason: string; reportedBy: Types.ObjectId }[];
  photoEvidence?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Mongoose schema with the defined interface
const reviewSchema: Schema<IReview> = new Schema(
  {
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    landlord: { type: mongoose.Schema.Types.ObjectId, ref: 'Landlord', required: true },
    ratings: {
      utilities: { type: Number, required: true, min: 1, max: 5 },
      landlord: { type: Number, required: true, min: 1, max: 5 },
      neighborhood: { type: Number, required: true, min: 1, max: 5 },
    },
    comment: { type: String, required: true },
    hidden: { type: Boolean, default: false },
    flagged: { type: Boolean, default: false },
    reports: [
      {
        reason: { type: String },
        reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
    ],
    photoEvidence: [{ type: String }],
  },
  { timestamps: true }
);

// Exporting the model with the IReview interface applied
const Review = mongoose.model<IReview>('Review', reviewSchema);
export default Review;
