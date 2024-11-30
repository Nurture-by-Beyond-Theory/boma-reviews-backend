import express, { Router, Request, Response } from 'express';
import { submitReview, getPropertyReviews } from '../controllers/review.controller';
import { protect } from '../middleware/auth.middleware';

const router: Router = express.Router();

// Route for submitting a review (authentication required)
router.post('/', protect, submitReview); // POST /api/reviews

// Route for fetching all reviews for a specific property
router.get('/:propertyId', getPropertyReviews); // GET /api/reviews/:propertyId

export default router; 
