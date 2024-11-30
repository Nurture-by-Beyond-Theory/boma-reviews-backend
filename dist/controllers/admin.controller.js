"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLandlord = exports.updateLandlord = exports.addLandlord = exports.listLandlords = exports.deleteProperty = exports.addProperty = exports.listProperties = exports.banUser = exports.suspendUser = exports.getUserActivity = exports.deleteFlaggedReview = exports.warnUser = exports.getFlaggedReviews = exports.toggleReviewVisibility = exports.deleteReview = exports.getAllReviews = exports.deleteUser = exports.getAllUsers = void 0;
const mongoose_1 = require("mongoose"); // Ensure correct import
const user_model_1 = __importDefault(require("../models/user.model"));
const review_model_1 = __importDefault(require("../models/review.model"));
const property_model_1 = __importDefault(require("../models/property.model"));
const landlord_model_1 = __importDefault(require("../models/landlord.model"));
// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await user_model_1.default.find().select('-password');
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getAllUsers = getAllUsers;
// Delete a user
const deleteUser = async (req, res) => {
    try {
        await user_model_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.deleteUser = deleteUser;
// View all reviews (with an option to filter hidden reviews)
const getAllReviews = async (req, res) => {
    try {
        const reviews = await review_model_1.default.find().populate('property').populate('user', 'username');
        res.json(reviews);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getAllReviews = getAllReviews;
// Delete a review
const deleteReview = async (req, res) => {
    try {
        await review_model_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: 'Review deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.deleteReview = deleteReview;
// Hide or unhide a review
const toggleReviewVisibility = async (req, res) => {
    try {
        const review = await review_model_1.default.findById(req.params.id);
        if (!review)
            return res.status(404).json({ error: 'Review not found' });
        review.hidden = !review.hidden;
        await review.save();
        res.json({ message: `Review ${review.hidden ? 'hidden' : 'visible'}` });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.toggleReviewVisibility = toggleReviewVisibility;
// View all flagged reviews
const getFlaggedReviews = async (req, res) => {
    try {
        const flaggedReviews = await review_model_1.default.find({ flagged: true }).populate('property user', 'username');
        res.json(flaggedReviews);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getFlaggedReviews = getFlaggedReviews;
// Warn user (could add warning count or message in user profile)
const warnUser = async (req, res) => {
    try {
        const user = await user_model_1.default.findById(req.params.userId);
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        user.warningCount = (user.warningCount || 0) + 1;
        await user.save();
        res.json({ message: `User ${user.username} has been warned` });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.warnUser = warnUser;
// Delete flagged review
const deleteFlaggedReview = async (req, res) => {
    try {
        await review_model_1.default.findByIdAndDelete(req.params.reviewId);
        res.json({ message: 'Flagged review deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.deleteFlaggedReview = deleteFlaggedReview;
// Get user activity data
const getUserActivity = async (req, res) => {
    try {
        const users = await user_model_1.default.find().sort({ lastLogin: -1 }).limit(10);
        const flaggedReviews = await review_model_1.default.find({ flagged: true }).populate('user property').limit(10);
        res.json({ users, flaggedReviews });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getUserActivity = getUserActivity;
// Suspend a user
const suspendUser = async (req, res) => {
    const { userId } = req.params;
    const { reason, durationInDays } = req.body;
    try {
        const suspensionExpiry = new Date();
        suspensionExpiry.setDate(suspensionExpiry.getDate() + durationInDays);
        const user = await user_model_1.default.findByIdAndUpdate(userId, {
            isSuspended: true,
            suspensionReason: reason,
            suspensionExpiry
        }, { new: true });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        res.json({ message: `User suspended until ${suspensionExpiry}`, user });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.suspendUser = suspendUser;
// Ban a user permanently
const banUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await user_model_1.default.findByIdAndUpdate(userId, { isBanned: true }, { new: true });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User permanently banned', user });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.banUser = banUser;
// List all properties
const listProperties = async (req, res) => {
    try {
        const properties = await property_model_1.default.find().populate('landlord');
        res.json(properties);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.listProperties = listProperties;
// Add a new property
const addProperty = async (req, res) => {
    const { name, location, rent, amenities, landlordId } = req.body;
    try {
        // LandlordId is treated as an ObjectId
        const landlordObjectId = new mongoose_1.Types.ObjectId(landlordId);
        const landlord = await landlord_model_1.default.findById(landlordObjectId);
        if (!landlord)
            return res.status(404).json({ error: 'Landlord not found' });
        // Creating the property and casting landlordId explicitly
        const property = await property_model_1.default.create({
            name,
            location,
            rent,
            amenities,
            landlord: landlordObjectId
        });
        // Pushing the property ID to landlord's propertiesManaged array
        landlord.propertiesManaged.push(property._id); // Explicitly casting property._id to ObjectId
        await landlord.save();
        res.status(201).json(property);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.addProperty = addProperty;
// Delete a property
const deleteProperty = async (req, res) => {
    const { propertyId } = req.params;
    try {
        const property = await property_model_1.default.findByIdAndDelete(propertyId);
        if (!property)
            return res.status(404).json({ error: 'Property not found' });
        res.json({ message: 'Property deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.deleteProperty = deleteProperty;
// List all landlords
const listLandlords = async (req, res) => {
    try {
        const landlords = await landlord_model_1.default.find().populate('propertiesManaged');
        res.json(landlords);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.listLandlords = listLandlords;
// Add a new landlord
const addLandlord = async (req, res) => {
    const { name, contactInfo } = req.body;
    try {
        const landlord = await landlord_model_1.default.create({ name, contactInfo });
        res.status(201).json(landlord);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.addLandlord = addLandlord;
// Update landlord details
const updateLandlord = async (req, res) => {
    const { landlordId } = req.params;
    const updates = req.body;
    try {
        const landlord = await landlord_model_1.default.findByIdAndUpdate(landlordId, updates, { new: true });
        if (!landlord)
            return res.status(404).json({ error: 'Landlord not found' });
        res.json(landlord);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.updateLandlord = updateLandlord;
// Delete a landlord
const deleteLandlord = async (req, res) => {
    const { landlordId } = req.params;
    try {
        const landlord = await landlord_model_1.default.findByIdAndDelete(landlordId);
        if (!landlord) {
            return res.status(404).json({ error: 'Landlord not found' });
        }
        res.status(200).json({ message: 'Landlord deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.deleteLandlord = deleteLandlord;
