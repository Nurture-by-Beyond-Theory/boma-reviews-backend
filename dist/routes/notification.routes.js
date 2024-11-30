"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const notification_model_1 = __importDefault(require("../models/notification.model"));
const router = express_1.default.Router();
// Fetch all notifications for admin
router.get('/', auth_middleware_1.protect, auth_middleware_1.admin, async (req, res) => {
    try {
        const notifications = await notification_model_1.default.find({ viewed: false });
        res.json(notifications);
    }
    catch (error) {
        console.error(error); // Logging the error for debugging purposes
        res.status(500).json({ error: 'Server error' });
    }
});
// Helper function to handle async errors in Express routes
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
// Mark notification as viewed
router.put('/:id/view', auth_middleware_1.protect, auth_middleware_1.admin, asyncHandler(async (req, res) => {
    try {
        const notification = await notification_model_1.default.findByIdAndUpdate(req.params.id, { viewed: true }, { new: true });
        if (!notification) {
            res.status(200).json({ message: 'Notification not found' });
            return;
        }
        res.json({ message: 'Notification marked as viewed' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}));
exports.default = router;
