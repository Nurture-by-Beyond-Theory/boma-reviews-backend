"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProperty = exports.updateProperty = exports.addProperty = exports.listProperties = void 0;
const property_model_1 = __importDefault(require("../models/property.model"));
const landlord_model_1 = __importDefault(require("../models/landlord.model"));
const mongoose_1 = require("mongoose");
const ObjectId = mongoose_1.Types.ObjectId;
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
        const landlord = await landlord_model_1.default.findById(landlordId);
        if (!landlord) {
            res.status(404).json({ error: 'Landlord not found' });
            return;
        }
        const property = await property_model_1.default.create({ name, location, rent, amenities, landlord: landlordId });
        landlord.propertiesManaged.push(property._id);
        await landlord.save();
        res.status(201).json(property);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.addProperty = addProperty;
// Update property details
const updateProperty = async (req, res) => {
    const { propertyId } = req.params;
    const updates = req.body;
    try {
        const property = await property_model_1.default.findByIdAndUpdate(propertyId, updates, { new: true });
        if (!property) {
            res.status(404).json({ error: 'Property not found' });
            return;
        }
        res.json(property);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.updateProperty = updateProperty;
// Delete a property
const deleteProperty = async (req, res) => {
    const { propertyId } = req.params;
    try {
        const property = await property_model_1.default.findByIdAndDelete(propertyId);
        if (!property) {
            res.status(404).json({ error: 'Property not found' });
            return;
        }
        res.json({ message: 'Property deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.deleteProperty = deleteProperty;
