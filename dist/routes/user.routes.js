"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/routes/user.routes.ts
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware"); // Importing the middleware
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
// Google OAuth
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/'); // Redirect after successful login
});
// Facebook OAuth
router.get('/facebook', passport_1.default.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport_1.default.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/');
});
// POST /api/users/register
router.post('/register', user_controller_1.registerUser);
// POST /api/users/login
router.post('/login', user_controller_1.loginUser);
// GET /api/users/profile
router.get('/profile', auth_middleware_1.protect, user_controller_1.getUserProfile);
exports.default = router;
