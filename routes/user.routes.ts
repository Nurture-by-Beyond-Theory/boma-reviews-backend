// backend/routes/user.routes.ts
import express, { Router } from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware'; // Importing the middleware
import passport from 'passport';

const router: Router = express.Router();

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/'); // Redirect after successful login
  });

  // Facebook OAuth
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  });

// POST /api/users/register
router.post('/register', registerUser);

// POST /api/users/login
router.post('/login', loginUser); 

// GET /api/users/profile
router.get('/profile', protect, getUserProfile); 

export default router;
