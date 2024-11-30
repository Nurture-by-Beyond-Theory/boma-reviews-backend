import express, { Router } from 'express';
import {
  getAllUsers,
  getUserActivity,
  deleteUser,
  suspendUser,
  banUser,
  getAllReviews,
  deleteReview,
  toggleReviewVisibility,
  getFlaggedReviews,
  warnUser,
  deleteFlaggedReview,
} from '../controllers/admin.controller';
import { protect, admin } from '../middleware/auth.middleware';

const router: Router = express.Router();

// User management routes
router.get('/users', protect, admin, getAllUsers);
router.delete('/users/:id', protect, admin, deleteUser);

// Route to fetch user activity and flagged content
router.get('/dashboard', protect, admin, getUserActivity);

// Suspend a user for a specified duration
router.put('/users/:userId/suspend', protect, admin, async (req, res) => {
  await suspendUser(req, res);
  return;
});



// Permanently ban a user
router.put('/users/:userId/ban', protect, admin, async (req, res) => {
  await banUser(req, res);
  return;
});

// Review management routes
router.get('/reviews', protect, admin, getAllReviews);
router.delete('/reviews/:id', protect, admin, deleteReview);
router.put('/reviews/:id/toggle', protect, admin, async (req, res) => {
  await toggleReviewVisibility(req, res);
  return;
}); // Toggle review visibility

// Flagged content management routes
router.get('/reviews/flagged', protect, admin, getFlaggedReviews); // View flagged reviews
router.put('/users/:userId/warn', protect, admin, async (req, res) => {
  await warnUser(req, res);
  return;
}); // Warn user
router.delete('/reviews/:reviewId', protect, admin, deleteFlaggedReview); // Delete flagged review

export default router;
