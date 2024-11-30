// Temporary 
import { Request, Response } from 'express';
import Property from '../models/property.model';
import Landlord from '../models/landlord.model';
import { Types } from 'mongoose';

const ObjectId = Types.ObjectId;


// List all properties
export const listProperties = async (req: Request, res: Response): Promise<void> => {
  try {
    const properties = await Property.find().populate('landlord');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Add a new property
export const addProperty = async (req: Request, res: Response): Promise<void> => {
  const { name, location, rent, amenities, landlordId } = req.body;

  try {
    const landlord = await Landlord.findById(landlordId);
    if (!landlord) {
      res.status(404).json({ error: 'Landlord not found' });
      return;
    }

    const property = await Property.create({ name, location, rent, amenities, landlord: landlordId });
    landlord.propertiesManaged.push(property._id as Types.ObjectId);
    await landlord.save();

    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update property details
export const updateProperty = async (req: Request, res: Response): Promise<void> => {
  const { propertyId } = req.params;
  const updates = req.body;

  try {
    const property = await Property.findByIdAndUpdate(propertyId, updates, { new: true });
    if (!property) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a property
export const deleteProperty = async (req: Request, res: Response): Promise<void> => {
  const { propertyId } = req.params;

  try {
    const property = await Property.findByIdAndDelete(propertyId);
    if (!property) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }

    res.json({ message: 'Property deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
