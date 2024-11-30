"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Mongoose schema with the defined interface
const reviewSchema = new mongoose_1.Schema({
    tenant: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    property: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Property', required: true },
    landlord: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Landlord', required: true },
    ratings: {
        utilities: { type: Number, required: true, min: 1, max: 5 },
        landlord: { type: Number, required: true, min: 1, max: 5 },
        neighborhood: { type: Number, required: true, min: 1, max: 5 },
    },
    comment: { type: String, required: true },
    hidden: { type: Boolean, default: false },
    flagged: { type: Boolean, default: false },
    reports: [
        {
            reason: { type: String },
            reportedBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
        },
    ],
    photoEvidence: [{ type: String }],
}, { timestamps: true });
// Exporting the model with the IReview interface applied
const Review = mongoose_1.default.model('Review', reviewSchema);
exports.default = Review;
