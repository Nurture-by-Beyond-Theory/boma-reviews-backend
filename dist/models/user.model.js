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
const userSchema = new mongoose_1.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String }, // Optional to allow social sign-up
    authProvider: {
        type: String,
        enum: ['email', 'google', 'facebook'],
        required: true,
    },
    providerId: { type: String, default: null },
    role: {
        type: String,
        enum: ['tenant', 'landlord', 'admin'],
        required: true,
    },
    reviews: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Review' }],
    lastLogin: { type: Date },
    warningCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    isSuspended: { type: Boolean, default: false },
    suspensionReason: { type: String, default: null },
    suspensionExpiry: { type: Date, default: null },
    isBanned: { type: Boolean, default: false },
    location: {
        country: { type: String, required: true },
        state: { type: String, required: true },
        address: { type: String, required: true },
    },
});
// Exporting the model with the IUser interface applied
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
