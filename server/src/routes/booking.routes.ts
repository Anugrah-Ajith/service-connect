import express from 'express';
import { body, validationResult } from 'express-validator';
import { Booking } from '../models/Booking.model.js';
import { ServiceProvider } from '../models/ServiceProvider.model.js';
import { authenticate, AuthRequest } from '../middleware/auth.middleware.js';
import { compareObjectIds } from '../utils/objectId.js';

const router = express.Router();

// Create a booking
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    if (req.userRole !== 'customer') {
      return res.status(403).json({ message: 'Only customers can create bookings' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      serviceProviderId,
      serviceType,
      description,
      location,
      scheduledDate,
      scheduledTime,
      isEmergency,
      estimatedHours
    } = req.body;

    // Validation
    if (!serviceProviderId || !serviceType || !description || !location || !scheduledDate || !scheduledTime || !estimatedHours) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (estimatedHours <= 0) {
      return res.status(400).json({ message: 'Estimated hours must be greater than 0' });
    }

    const provider = await ServiceProvider.findById(serviceProviderId);
    if (!provider) {
      return res.status(404).json({ message: 'Service provider not found' });
    }

    if (!provider.isVerified) {
      return res.status(400).json({ message: 'Service provider is not verified' });
    }

    const totalAmount = provider.hourlyRate * estimatedHours * (isEmergency ? 1.5 : 1);

    const booking = new Booking({
      customerId: req.userId,
      serviceProviderId,
      serviceType,
      description,
      location,
      scheduledDate,
      scheduledTime,
      isEmergency,
      estimatedHours,
      totalAmount,
      status: 'pending'
    });

    await booking.save();
    const populated = await booking.populate('serviceProviderId', 'businessName hourlyRate')
      .populate('customerId', 'firstName lastName');

    res.status(201).json(populated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get bookings for current user
router.get('/my-bookings', authenticate, async (req: AuthRequest, res) => {
  try {
    let query: any = {};
    
    if (req.userRole === 'customer') {
      query.customerId = req.userId;
    } else {
      query.serviceProviderId = req.userId;
    }

    const bookings = await Booking.find(query)
      .populate('customerId', 'firstName lastName email phone')
      .populate('serviceProviderId', 'businessName hourlyRate')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get single booking
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customerId', 'firstName lastName email phone')
      .populate('serviceProviderId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    if (!compareObjectIds(booking.customerId, req.userId) && 
        !compareObjectIds(booking.serviceProviderId, req.userId)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(booking);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update booking status
router.patch('/:id/status', authenticate, async (req: AuthRequest, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Service providers can update to confirmed, in_progress, or completed
    if (req.userRole === 'service_provider' && 
        compareObjectIds(booking.serviceProviderId, req.userId)) {
      if (['confirmed', 'in_progress', 'completed'].includes(status)) {
        booking.status = status as any;
        await booking.save();
        return res.json(booking);
      }
    }

    // Customers can cancel
    if (req.userRole === 'customer' && 
        compareObjectIds(booking.customerId, req.userId)) {
      if (status === 'cancelled') {
        booking.status = status;
        await booking.save();
        return res.json(booking);
      }
    }

    res.status(403).json({ message: 'Unauthorized or invalid status update' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

