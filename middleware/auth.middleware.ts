import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';
import mongoose, { Types } from 'mongoose';


// Middleware to protect routes with ban and suspension checks
export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'No token, authorization denied' });
    return;
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const user = await User.findById(decoded.userId).select('-password') as IUser | null;
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (user.isBanned) {
      res.status(403).json({ error: 'Your account has been banned' });
      return;
    }

    if (user.isSuspended) {
      const now = new Date();
      if (user.suspensionExpiry && now > user.suspensionExpiry) {
        user.isSuspended = false;
        user.suspensionReason = null;
        user.suspensionExpiry = null;
        await user.save();
      } else {
        res.status(403).json({ error: 'Your account is suspended', reason: user.suspensionReason });
        return;
      }
    }

    req.user = { id: user._id as unknown as mongoose.Types.ObjectId, role: user.role };
 // Attaching user to request
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

// Middleware to restrict routes to admins
export const admin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user && (req.user as IUser).role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Admin privileges required' });
  }
  next();
};
