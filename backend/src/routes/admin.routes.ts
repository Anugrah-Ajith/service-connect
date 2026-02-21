import express from 'express';
import { User } from '../models/User.model.js';
import { Booking } from '../models/Booking.model.js';
import { ServiceProvider } from '../models/ServiceProvider.model.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply admin protection to all routes in this file
router.use(authenticate, authorize('admin'));

// Get admin dashboard stats
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ isDeleted: false });
        const totalProviders = await ServiceProvider.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const pendingVerifications = await ServiceProvider.countDocuments({ isVerified: false });

        // Get recent bookings
        const recentBookings = await Booking.find()
            .populate('customerId', 'firstName lastName')
            .populate({
                path: 'serviceProviderId',
                populate: {
                    path: 'userId',
                    select: 'firstName lastName'
                }
            })
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            stats: {
                totalUsers,
                totalProviders,
                totalBookings,
                pendingVerifications
            },
            recentBookings
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({ isDeleted: false }).sort({ createdAt: -1 });
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Get all service providers
router.get('/providers', async (req, res) => {
    try {
        const providers = await ServiceProvider.find()
            .populate('userId', 'firstName lastName email phone profilePhoto isVerified')
            .sort({ createdAt: -1 });
        res.json(providers);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Get all bookings
router.get('/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('customerId', 'firstName lastName email')
            .populate({
                path: 'serviceProviderId',
                populate: {
                    path: 'userId',
                    select: 'firstName lastName email'
                }
            })
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Verify a service provider
router.post('/providers/:id/verify', async (req, res) => {
    try {
        const provider = await ServiceProvider.findById(req.params.id);
        if (!provider) {
            return res.status(404).json({ message: 'Provider not found' });
        }

        provider.isVerified = true;
        await provider.save();

        // Also update the associated User model verification status
        await User.findByIdAndUpdate(provider.userId, { isVerified: true });

        res.json({ message: 'Provider verified successfully', provider });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Toggle user active status
router.post('/users/:id/toggle-active', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isActive = !user.isActive;
        await user.save();

        res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`, user });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
