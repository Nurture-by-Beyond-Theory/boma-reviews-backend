"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_facebook_1 = require("passport-facebook");
const user_model_1 = __importDefault(require("../models/user.model"));
// Google Strategy
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await user_model_1.default.findOne({ providerId: profile.id, authProvider: 'google' });
        if (!user) {
            user = new user_model_1.default({
                username: profile.displayName,
                email: profile.emails?.[0].value,
                providerId: profile.id,
                authProvider: 'google',
                role: 'tenant', // default role or based on additional logic
            });
            await user.save();
        }
        done(null, user);
    }
    catch (error) {
        done(error, undefined);
    }
}));
// Facebook Strategy
passport_1.default.use(new passport_facebook_1.Strategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'emails'],
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await user_model_1.default.findOne({ providerId: profile.id, authProvider: 'facebook' });
        if (!user) {
            user = new user_model_1.default({
                username: profile.displayName,
                email: profile.emails?.[0].value,
                providerId: profile.id,
                authProvider: 'facebook',
                role: 'tenant', // default role
            });
            await user.save();
        }
        done(null, user);
    }
    catch (error) {
        done(error, null);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await user_model_1.default.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error);
    }
});
