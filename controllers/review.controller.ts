import { Request, Response, NextFunction } from 'express';
import Notification from '../models/notification.model';
import Review, { IReview } from '../models/review.model';
import Property, { IProperty } from '../models/property.model';
import Landlord, { ILandlord } from '../models/landlord.model';
import mongoose, { Types } from 'mongoose';
import User, { IUser } from '../models/user.model';



// Controller function to submit a review
export const submitReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tenantId, landlordId, ratings, comment, propertyDetails } = req.body;

    // Validate required fields
    if (!propertyDetails || !propertyDetails.location || !propertyDetails.rent) {
      res.status(400).json({ error: 'Property details must include location and rent.' });
      return;
    }

    // Validate tenantId format
    if (!mongoose.isValidObjectId(tenantId)) {
      res.status(400).json({ error: 'Invalid tenant ID format.' });
      return;
    }

    // Convert tenantId to ObjectId if needed
    const tenantObjectId = new mongoose.Types.ObjectId(tenantId);

    // Check if landlord exists or create a new one
    let landlord = await Landlord.findById(landlordId);
    if (!landlord) {
      landlord = new Landlord({ _id: landlordId, name: 'Default Name' });
      await landlord.save();
    }

    // Check if property exists or create a new one
    let property = await Property.findOne({ address: propertyDetails.address });
    if (!property) {
      property = new Property({
        address: propertyDetails.address,
        name: propertyDetails.name || 'Unnamed Property',
        location: propertyDetails.location,
        rent: propertyDetails.rent,
        amenities: propertyDetails.amenities || [],
        landlord: landlord._id,
      });
      await property.save();
    }

    // Create and save the review
    const review = new Review({
      tenant: tenantObjectId,
      property: property._id,
      landlord: landlord._id,
      ratings,
      comment,
    });

    await review.save();

    res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (error) {
    console.error('Error submitting review:', error); // Detailed logging
    res.status(500).json({ error: 'An error occurred while submitting the review.' });
  }
};

// Flag a review as inappropriate
export const flagReview = async (req: Request, res: Response): Promise<void> => {
  const { reviewId } = req.params;
  const { reason } = req.body;

  try {
    const userId = (req.user as IUser)?._id;
if (!userId) {
  res.status(401).json({ message: 'User not authenticated' });
  return;
}
    // Ensuring user ID is retrieved from `req.user.id`
    const user = await User.findById(userId) as IUser | null;
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ error: 'Review not found' }) as unknown as void;


    review.flagged = true;
    if (!review.reports) review.reports = []; 
    if ((req.user as IUser)?._id) {
      review.reports.push({ reason, reportedBy: (req.user as IUser)._id as unknown as mongoose.Types.ObjectId });
      req.user = { id: user._id as unknown as mongoose.Types.ObjectId, role: user.role };

    }
    await review.save();

    // Create a notification for the admin
    await Notification.create({
      type: 'flagged_content',
      message: `Review flagged for: ${reason}`,
      user: (req.user as IUser)?._id // The user who flagged the content
    });

    res.status(200).json({ message: 'Review flagged and notification sent to admin' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get reviews for a specific property
export const getPropertyReviews = async (req: Request, res: Response): Promise<void> => {
  const { propertyId } = req.params;

  try {
    // Find all reviews for the specified property
    const reviews = await Review.find({ property: propertyId })
      .populate('tenant', 'username') // Populate tenant details
      .populate('landlord', 'username'); // Populate landlord details

    res.status(200).json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
