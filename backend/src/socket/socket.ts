import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { Booking } from '../models/Booking.model.js';
import { compareObjectIds } from '../utils/objectId.js';

interface UserSocket extends Socket {
  userId?: string;
}

export const initializeSocket = (io: Server) => {
  io.use((socket: UserSocket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { userId: string; role: string };
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: UserSocket) => {
    console.log('User connected:', socket.userId);

    // Join user's personal room
    if (socket.userId) {
      socket.join(`user_${socket.userId}`);
    }

    // Join booking room when user opens a booking
    socket.on('join_booking', async (bookingId: string) => {
      try {
        const booking = await Booking.findById(bookingId);

        if (booking &&
          (compareObjectIds(booking.customerId, socket.userId) ||
            compareObjectIds(booking.serviceProviderId, socket.userId))) {
          socket.join(`booking_${bookingId}`);
        }
      } catch (error) {
        console.error('Error joining booking room:', error);
      }
    });

    // Handle chat messages
    socket.on('send_message', async (data: { bookingId: string; message: string }) => {
      try {
        const { Message } = await import('../models/Message.model.js');
        const booking = await Booking.findById(data.bookingId);

        if (booking &&
          (compareObjectIds(booking.customerId, socket.userId) ||
            compareObjectIds(booking.serviceProviderId, socket.userId))) {

          // Save to database
          const newMessage = new Message({
            bookingId: data.bookingId,
            senderId: socket.userId,
            content: data.message
          });

          await newMessage.save();

          const messageData = {
            bookingId: data.bookingId,
            senderId: socket.userId,
            message: data.message,
            timestamp: newMessage.createdAt
          };

          // Broadcast to booking room
          io.to(`booking_${data.bookingId}`).emit('new_message', messageData);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    // Handle location updates
    socket.on('update_location', async (data: { bookingId: string; location: { lat: number; lng: number } }) => {
      try {
        const booking = await Booking.findById(data.bookingId);

        if (booking && compareObjectIds(booking.serviceProviderId, socket.userId)) {
          // Notify customer of service provider location
          io.to(`user_${booking.customerId}`).emit('location_update', {
            bookingId: data.bookingId,
            location: data.location
          });
        }
      } catch (error) {
        console.error('Error updating location:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.userId);
    });
  });
};

