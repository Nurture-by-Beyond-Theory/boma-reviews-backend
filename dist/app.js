"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const review_routes_1 = __importDefault(require("./routes/review.routes"));
const auth_middleware_1 = require("./middleware/auth.middleware");
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const property_routes_1 = __importDefault(require("./routes/property.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, db_1.default)();
app.use((0, cors_1.default)({
    origin: '*', // Allow all origins. Replace '*' with your frontend's URL in production, e.g., 'http://localhost:3000'
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
    credentials: true,
}));
app.use(express_1.default.json());
// Protected /api/reviews routes
app.use('/api/reviews', auth_middleware_1.protect, review_routes_1.default);
// Admin routes
app.use('/api/admin', admin_routes_1.default);
// app.use('/api/admin', require('./routes/admin.routes'));
// Example admin protected route
// app.get('/api/admin/data', protect, admin, (req: Request, res: Response) => {
// res.json({ message: 'This is protected admin data' });
// });
// User and property routes
app.use('/api/users', user_routes_1.default);
app.use('/api/properties', property_routes_1.default);
exports.default = app; // Export the app
