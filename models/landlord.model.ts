import mongoose, { Schema, Document, Types } from 'mongoose';

// Define the TypeScript interface for the Landlord schema
export interface ILandlord extends Document {
  name: string;
  contactInfo?: string;
  propertiesManaged: Types.ObjectId[];
}

// Define the Mongoose schema using the TypeScript interface
const landlordSchema: Schema<ILandlord> = new Schema(
  {
    name: { type: String, required: true },
    contactInfo: { type: String, required: false },
    propertiesManaged: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }]
  },
  { timestamps: true }
);

// Export the model with the ILandlord interface
const Landlord = mongoose.model<ILandlord>('Landlord', landlordSchema);
export default Landlord;

