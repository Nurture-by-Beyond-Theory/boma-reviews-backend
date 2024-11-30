import { Request, Response } from 'express';
import mongoose, { Types, ObjectId } from 'mongoose'; // Ensure correct import
import User from '../models/user.model';
import Review from '../models/review.model';
import Property from '../models/property.model';
import Landlord from '../models/landlord.model';

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// View all reviews (with an option to filter hidden reviews)
export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find().populate('property').populate('user', 'username');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a review
export const deleteReview = async (req: Request, res: Response) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Hide or unhide a review
export const toggleReviewVisibility = async (req: Request, res: Response) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });

    review.hidden = !review.hidden;
    await review.save();

    res.json({ message: `Review ${review.hidden ? 'hidden' : 'visible'}` });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// View all flagged reviews
export const getFlaggedReviews = async (req: Request, res: Response) => {
  try {
    const flaggedReviews = await Review.find({ flagged: true }).populate('property user', 'username');
    res.json(flaggedReviews);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Warn user (could add warning count or message in user profile)
export const warnUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.warningCount = (user.warningCount || 0) + 1;
    await user.save();

    res.json({ message: `User ${user.username} has been warned` });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete flagged review
export const deleteFlaggedReview = async (req: Request, res: Response) => {
  try {
    await Review.findByIdAndDelete(req.params.reviewId);
    res.json({ message: 'Flagged review deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user activity data
export const getUserActivity = async (req: Request, res: Response) => {
  try {
    const users = await User.find().sort({ lastLogin: -1 }).limit(10);
    const flaggedReviews = await Review.find({ flagged: true }).populate('user property').limit(10);

    res.json({ users, flaggedReviews });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Suspend a user
export const suspendUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { reason, durationInDays }: { reason: string; durationInDays: number } = req.body;

  try {
    const suspensionExpiry = new Date();
    suspensionExpiry.setDate(suspensionExpiry.getDate() + durationInDays);

    const user = await User.findByIdAndUpdate(
      userId,
      {
        isSuspended: true,
        suspensionReason: reason,
        suspensionExpiry
      },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: `User suspended until ${suspensionExpiry}`, user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Ban a user permanently
export const banUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { isBanned: true },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User permanently banned', user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// List all properties
export const listProperties = async (req: Request, res: Response) => {
  try {
    const properties = await Property.find().populate('landlord');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Add a new property
export const addProperty = async (req: Request, res: Response) => {
  const { name, location, rent, amenities, landlordId } = req.body;

  try {
    // LandlordId is treated as an ObjectId
    const landlordObjectId = new Types.ObjectId(landlordId as string);
    const landlord = await Landlord.findById(landlordObjectId);
    if (!landlord) return res.status(404).json({ error: 'Landlord not found' });

    // Creating the property and casting landlordId explicitly
    const property = await Property.create({
      name,
      location,
      rent,
      amenities,
      landlord: landlordObjectId
    });

    // Pushing the property ID to landlord's propertiesManaged array
    landlord.propertiesManaged.push(property._id as Types.ObjectId); // Explicitly casting property._id to ObjectId
    await landlord.save();

    res.status(201).json(property);
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: 'Server error' });
  }
};
// Delete a property
export const deleteProperty = async (req: Request, res: Response) => {
  const { propertyId } = req.params;

  try {
    const property = await Property.findByIdAndDelete(propertyId);
    if (!property) return res.status(404).json({ error: 'Property not found' });

    res.json({ message: 'Property deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// List all landlords
export const listLandlords = async (req: Request, res: Response) => {
  try {
    const landlords = await Landlord.find().populate('propertiesManaged');
    res.json(landlords);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Add a new landlord
export const addLandlord = async (req: Request, res: Response) => {
  const { name, contactInfo } = req.body;

  try {
    const landlord = await Landlord.create({ name, contactInfo });
    res.status(201).json(landlord);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update landlord details
export const updateLandlord = async (req: Request, res: Response) => {
  const { landlordId } = req.params;
  const updates = req.body;

  try {
    const landlord = await Landlord.findByIdAndUpdate(landlordId, updates, { new: true });
    if (!landlord) return res.status(404).json({ error: 'Landlord not found' });

    res.json(landlord);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a landlord
export const deleteLandlord = async (req: Request, res: Response) => {
  const { landlordId } = req.params;

  try {
    const landlord = await Landlord.findByIdAndDelete(landlordId);
    if (!landlord) {
      return res.status(404).json({ error: 'Landlord not found' });
    }
    res.status(200).json({ message: 'Landlord deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
