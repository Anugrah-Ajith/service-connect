import express from 'express';
import { body, validationResult } from 'express-validator';
import { Review } from '../models/Review.model.js';
import { Booking } from '../models/Booking.model.js';
import { ServiceProvider } from '../models/ServiceProvider.model.js';
import { authenticate, AuthRequest } from '../middleware/auth.middleware.js';
import { compareObjectIds } from '../utils/objectId.js';

const router = express.Router();

// Create review
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    if (req.userRole !== 'customer') {
      return res.status(403).json({ message: 'Only customers can create reviews' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { bookingId, rating, comment } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (!compareObjectIds(booking.customerId, req.userId)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed bookings' });
    }

    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return res.status(400).json({ message: 'Review already exists for this booking' });
    }

    const review = new Review({
      bookingId,
      customerId: req.userId,
      serviceProviderId: booking.serviceProviderId,
      rating,
      comment
    });

    await review.save();

    // Update service provider rating
    const provider = await ServiceProvider.findById(booking.serviceProviderId);
    if (provider) {
      const reviews = await Review.find({ serviceProviderId: provider._id });
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      provider.rating = totalRating / reviews.length;
      provider.totalReviews = reviews.length;
      await provider.save();
    }

    res.status(201).json(review);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get reviews for a service provider
router.get('/provider/:providerId', async (req, res) => {
  try {
    const reviews = await Review.find({ serviceProviderId: req.params.providerId })
      .populate('customerId', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

