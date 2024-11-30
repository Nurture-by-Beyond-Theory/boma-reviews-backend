import express, { Router, Request, Response, NextFunction } from 'express';
import { protect, admin } from '../middleware/auth.middleware';
import Notification from '../models/notification.model';

const router: Router = express.Router();

// Fetch all notifications for admin
router.get('/', protect, admin, async (req: Request, res: Response) => {
  try {
    const notifications = await Notification.find({ viewed: false });
    res.json(notifications);
  } catch (error) {
    console.error(error); // Logging the error for debugging purposes
    res.status(500).json({ error: 'Server error' });
  }
});

// Helper function to handle async errors in Express routes
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Mark notification as viewed
router.put('/:id/view', protect, admin, asyncHandler(async (req: Request, res: Response) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { viewed: true }, { new: true });
    if (!notification) {
      res.status(200).json({ message: 'Notification not found' });
      return; 
    }
    res.json({ message: 'Notification marked as viewed' });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: 'Server error' });
  }
}));

export default router;
