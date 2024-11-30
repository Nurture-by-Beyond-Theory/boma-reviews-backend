"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const property_model_1 = __importDefault(require("../models/property.model"));
const router = express_1.default.Router();
// Example route for getting properties (customize as needed)
router.get('/', (req, res) => {
    res.send('List of properties');
});
// Global search endpoint for properties and reviews by location
router.get('/search', async (req, res) => {
    const { country, region, city, street } = req.query;
    try {
        // Building the location filter dynamically
        const locationFilter = {};
        if (country)
            locationFilter.location = new RegExp(country, 'i');
        if (region)
            locationFilter.location = new RegExp(region, 'i');
        if (city)
            locationFilter.location = new RegExp(city, 'i');
        if (street)
            locationFilter.location = new RegExp(street, 'i');
        // Querying properties based on location filter and populating reviews
        const properties = await property_model_1.default.find(locationFilter)
            .populate({
            path: 'reviews', // Assuming 'reviews' is an array of review ObjectIds in Property
            select: 'tenant ratings comment createdAt', // Select specific fields if needed
            populate: {
                path: 'tenant', // Populate tenant information for each review, if desired
                select: 'name' // Customized to only retrieve tenant's name
            }
        })
            .exec();
        res.status(200).json(properties);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving properties and reviews', error });
    }
});
exports.default = router;
