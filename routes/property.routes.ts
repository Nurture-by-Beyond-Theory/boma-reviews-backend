import express, { Router, Request, Response } from 'express';
import Property from '../models/property.model';

const router: Router = express.Router();

// Example route for getting properties (customize as needed)
router.get('/', (req: Request, res: Response) => {
    res.send('List of properties');
});

// Global search endpoint for properties and reviews by location
router.get('/search', async (req: Request, res: Response) => {
  const { country, region, city, street } = req.query;

  try {
      // Building the location filter dynamically
      const locationFilter: any = {};
      if (country) locationFilter.location = new RegExp(country as string, 'i');
      if (region) locationFilter.location = new RegExp(region as string, 'i');
      if (city) locationFilter.location = new RegExp(city as string, 'i');
      if (street) locationFilter.location = new RegExp(street as string, 'i');

      // Querying properties based on location filter and populating reviews
      const properties = await Property.find(locationFilter)
          .populate({
              path: 'reviews',   // Assuming 'reviews' is an array of review ObjectIds in Property
              select: 'tenant ratings comment createdAt', // Select specific fields if needed
              populate: {
                  path: 'tenant', // Populate tenant information for each review, if desired
                  select: 'name' // Customized to only retrieve tenant's name
              }
          })
          .exec();

      res.status(200).json(properties);
  } catch (error) {
      res.status(500).json({ message: 'Error retrieving properties and reviews', error });
  }
});

export default router;