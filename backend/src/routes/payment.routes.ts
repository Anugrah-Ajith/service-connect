import express, { Request, Response } from 'express';
import { Booking } from '../models/Booking.model.js';
import { authenticate, AuthRequest } from '../middleware/auth.middleware.js';
import { compareObjectIds } from '../utils/objectId.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_fallback', {
  apiVersion: '2023-10-16'
});

const router = express.Router();

// Create payment intent
router.post('/create-intent', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const bookingId = (req as Request).body?.bookingId;

    const booking = await Booking.findById(bookingId)
      .populate('customerId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (!compareObjectIds(booking.customerId, req.userId)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Booking already paid' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.totalAmount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        bookingId: booking._id.toString(),
        customerId: req.userId!
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: booking.totalAmount
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Confirm payment
router.post('/confirm', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { bookingId, paymentIntentId } = (req as Request).body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not successful' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.paymentStatus = 'paid';
    await booking.save();

    res.json({ message: 'Payment confirmed', booking });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

