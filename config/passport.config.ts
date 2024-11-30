import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import mongoose, { Document } from 'mongoose';
import User, { IUser } from '../models/user.model';

// Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ providerId: profile.id, authProvider: 'google' });

    if (!user) {
      user = new User({
        username: profile.displayName,
        email: profile.emails?.[0].value,
        providerId: profile.id,
        authProvider: 'google',
        role: 'tenant', // default role or based on additional logic
      });
      await user.save();
    }
    done(null, user);
  } catch (error) {
    done(error, undefined);
  }
}));

// Facebook Strategy
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID as string,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
  callbackURL: '/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'emails'],
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ providerId: profile.id, authProvider: 'facebook' });

    if (!user) {
      user = new User({
        username: profile.displayName,
        email: profile.emails?.[0].value,
        providerId: profile.id,
        authProvider: 'facebook',
        role: 'tenant', // default role
      });
      await user.save();
    }
    done(null, user);
  } catch (error) {
    done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, (user as IUser & Document)._id);
});

passport.deserializeUser(async (id: mongoose.Types.ObjectId, done) => {
  try {
    const user = await User.findById(id) as IUser & Document;
    done(null, user);
  } catch (error) {
    done(error);
  }
});
