import mongoose, { Schema, Document, Types } from 'mongoose';

// TypeScript interface for the Property schema
export interface IProperty extends Document {
  name: string;
  location: string;
  rent: number;
  amenities?: string[];
  landlord: Types.ObjectId;
  isListed?: boolean;
  averageRating?: number;
  reviews?: Types.ObjectId[];
  photos?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Mongoose schema with the defined interface
const propertySchema: Schema<IProperty> = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    rent: { type: Number, required: true },
    amenities: [String],
    landlord: { type: mongoose.Schema.Types.ObjectId, ref: 'Landlord', required: true },
    isListed: { type: Boolean, default: true },
    averageRating: { type: Number, default: 0 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    photos: [{ type: String }],
  },
  { timestamps: true }
);

// Exporting the model with the IProperty interface applied
const Property = mongoose.model<IProperty>('Property', propertySchema);
export default Property;
