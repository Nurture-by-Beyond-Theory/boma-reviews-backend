import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';

// New User Registration with Password Confirmation
export const registerUser = async (req: Request, res: Response): Promise<void> => {

  const { username, email, password, confirmPassword, role, location, tenancyDate } = req.body;

  try {
    // Check if passwords match
    if (password !== confirmPassword) {
      res.status(400).json({ error: 'Passwords do not match' });
      return;
    }
   // Validate required fields
   if (!location || !location.country || !location.state || !location.address) {
    res.status(400).json({ error: 'Location details are incomplete' });
    return;
  }

  if (!tenancyDate?.startDate) {
    res.status(400).json({ error: 'Tenancy start date is required' });
    return;
  }
   // Check if the email already exists
   const existingUser = await User.findOne({ email });
   if (existingUser) {
     res.status(400).json({ error: 'Email is already registered' });
     return;
   }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);
    // Handle optional file upload
    const evidenceOfTenancy = req.file ? req.file.path : undefined;
    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role,
      location,
      reviews: [],
      authProvider: 'email',
      tenancyDate: {
        startDate: tenancyDate.startDate,
        endDate: tenancyDate.endDate || null, // Optional
      },
      evidenceOfTenancy,
    });
    console.log("User data to be saved:", user);
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({ error: 'Error registering user' });
  }
};

// Existing User Login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: 'Email not found' });
      return;
    }

    if (!bcrypt.compareSync(password, user.password || '')) {
      res.status(400).json({ error: 'Incorrect password' });
      return;
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get User Profile
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IUser;

    // Check if user is authenticated
    if (!user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const foundUser = await User.findById(user._id).select('-password'); // Exclude password
    if (!foundUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(foundUser);
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};