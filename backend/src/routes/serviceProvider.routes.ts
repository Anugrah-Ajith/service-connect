import express from 'express';
import { body, validationResult } from 'express-validator';
import { ServiceProvider } from '../models/ServiceProvider.model.js';
import { authenticate, AuthRequest } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all service providers (for customers to browse)
router.get('/', async (req, res) => {
  try {
    const { serviceType, city, minRating, verified } = req.query;
    let query: any = {};

    if (serviceType) {
      query.serviceTypes = serviceType;
    }
    if (city) {
      query['location.city'] = new RegExp(city as string, 'i');
    }
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }
    if (verified === 'true') {
      query.isVerified = true;
    }

    const providers = await ServiceProvider.find(query)
      .populate('userId', 'firstName lastName email phone')
      .select('-availability')
      .sort({ rating: -1 });

    res.json(providers);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get nearby service providers
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, serviceType, maxDistance = 50 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude required' });
    }

    const providers = await ServiceProvider.find({
      serviceTypes: serviceType || { $exists: true },
      isVerified: true,
      'location.coordinates.lat': {
        $gte: Number(lat) - 0.5,
        $lte: Number(lat) + 0.5
      },
      'location.coordinates.lng': {
        $gte: Number(lng) - 0.5,
        $lte: Number(lng) + 0.5
      }
    })
      .populate('userId', 'firstName lastName email phone')
      .sort({ rating: -1 })
      .limit(20);

    res.json(providers);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get single service provider
router.get('/:id', async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id)
      .populate('userId', 'firstName lastName email phone');
    
    if (!provider) {
      return res.status(404).json({ message: 'Service provider not found' });
    }

    res.json(provider);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Create/Update service provider profile
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    if (req.userRole !== 'service_provider') {
      return res.status(403).json({ message: 'Only service providers can create profiles' });
    }

    const existingProfile = await ServiceProvider.findOne({ userId: req.userId });
    if (existingProfile) {
      return res.status(400).json({ message: 'Profile already exists. Use PUT to update.' });
    }

    const provider = new ServiceProvider({
      ...req.body,
      userId: req.userId
    });

    await provider.save();
    const populated = await provider.populate('userId', 'firstName lastName email phone');
    res.status(201).json(populated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update service provider profile
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id);
    
    if (!provider) {
      return res.status(404).json({ message: 'Service provider not found' });
    }
    
    if (provider.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    Object.assign(provider, req.body);
    await provider.save();
    const populated = await provider.populate('userId', 'firstName lastName email phone');
    res.json(populated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get my profile (for service provider)
router.get('/profile/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const provider = await ServiceProvider.findOne({ userId: req.userId })
      .populate('userId', 'firstName lastName email phone');
    
    if (!provider) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(provider);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

