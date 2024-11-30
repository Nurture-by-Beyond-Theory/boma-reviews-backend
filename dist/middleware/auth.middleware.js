"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
// Middleware to protect routes with ban and suspension checks
const protect = async (req, res, next) => {
    let token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'No token, authorization denied' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await user_model_1.default.findById(decoded.userId).select('-password');
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
            }
            else {
                res.status(403).json({ error: 'Your account is suspended', reason: user.suspensionReason });
                return;
            }
        }
        req.user = { id: user._id, role: user.role };
        // Attaching user to request
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};
exports.protect = protect;
// Middleware to restrict routes to admins
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    }
    else {
        res.status(403).json({ error: 'Admin privileges required' });
    }
    next();
};
exports.admin = admin;
