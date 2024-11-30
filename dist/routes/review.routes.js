"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const review_controller_1 = require("../controllers/review.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Route for submitting a review (authentication required)
router.post('/', auth_middleware_1.protect, review_controller_1.submitReview); // POST /api/reviews
// Route for fetching all reviews for a specific property
router.get('/:propertyId', review_controller_1.getPropertyReviews); // GET /api/reviews/:propertyId
exports.default = router;
