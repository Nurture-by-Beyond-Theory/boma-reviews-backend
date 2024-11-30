"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("../controllers/admin.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// User management routes
router.get('/users', auth_middleware_1.protect, auth_middleware_1.admin, admin_controller_1.getAllUsers);
router.delete('/users/:id', auth_middleware_1.protect, auth_middleware_1.admin, admin_controller_1.deleteUser);
// Route to fetch user activity and flagged content
router.get('/dashboard', auth_middleware_1.protect, auth_middleware_1.admin, admin_controller_1.getUserActivity);
// Suspend a user for a specified duration
router.put('/users/:userId/suspend', auth_middleware_1.protect, auth_middleware_1.admin, async (req, res) => {
    await (0, admin_controller_1.suspendUser)(req, res);
    return;
});
// Permanently ban a user
router.put('/users/:userId/ban', auth_middleware_1.protect, auth_middleware_1.admin, async (req, res) => {
    await (0, admin_controller_1.banUser)(req, res);
    return;
});
// Review management routes
router.get('/reviews', auth_middleware_1.protect, auth_middleware_1.admin, admin_controller_1.getAllReviews);
router.delete('/reviews/:id', auth_middleware_1.protect, auth_middleware_1.admin, admin_controller_1.deleteReview);
router.put('/reviews/:id/toggle', auth_middleware_1.protect, auth_middleware_1.admin, async (req, res) => {
    await (0, admin_controller_1.toggleReviewVisibility)(req, res);
    return;
}); // Toggle review visibility
// Flagged content management routes
router.get('/reviews/flagged', auth_middleware_1.protect, auth_middleware_1.admin, admin_controller_1.getFlaggedReviews); // View flagged reviews
router.put('/users/:userId/warn', auth_middleware_1.protect, auth_middleware_1.admin, async (req, res) => {
    await (0, admin_controller_1.warnUser)(req, res);
    return;
}); // Warn user
router.delete('/reviews/:reviewId', auth_middleware_1.protect, auth_middleware_1.admin, admin_controller_1.deleteFlaggedReview); // Delete flagged review
exports.default = router;
