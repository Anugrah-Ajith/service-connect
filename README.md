# Service Connect App

A comprehensive platform connecting skilled workers (plumbers, electricians, mechanics, carpenters) with customers who need their services quickly and safely.

## Features

### Core Features
- **Service Provider Registration**: Skilled professionals can register and verify their profiles
- **Customer Requests**: Customers can choose services and view nearby professionals
- **Instant Connection**: Booking, chat, and scheduling capabilities
- **Payment System**: Safe and secure payment processing
- **Reviews & Ratings**: Build trust through customer feedback
- **Support & Safety**: Verified workers and in-app support

### Bonus Features
- Live location tracking for real-time updates
- Emergency repair option for urgent needs
- Subscription plans for regular home maintenance
- Chatbot to assist customers in describing problems
- Training partnerships to upskill service providers

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- React Router for navigation
- Zustand for state management
- Socket.io Client for real-time chat
- Stripe for payments

### Backend
- Node.js with Express and TypeScript
- MongoDB with Mongoose
- Socket.io for real-time communication
- JWT for authentication
- Stripe API for payments
- bcryptjs for password hashing

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)

### Installation

1. Install all dependencies:
```bash
npm run install:all
```

2. Set up environment variables:
   - Create `.env` file in the `server` directory:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password
   ```

3. Run the development servers:
```bash
npm run dev
```

The app will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Project Structure

```
service-connect-app/
├── client/          # React frontend
├── server/          # Express backend
└── README.md
```

## Social Impact

This app addresses several social problems:
- **Employment & Income Generation**: Provides job opportunities for skilled workers
- **Trust & Safety**: Verification and reviews build customer confidence
- **Time Efficiency**: Customers can quickly find reliable help
- **Digital Inclusion**: Brings local workers into the digital economy
- **Community Support**: Encourages local employment and helps small businesses grow


## Testing the Application

### 1. Create Accounts
1. Register as a **Customer**
2. Register as a **Service Provider**
3. Complete the service provider profile setup

### 2. Test Booking Flow
1. As a customer, browse providers
2. Select a provider and view their profile
3. Click "Book Now" and fill in booking details
4. Create the booking

### 3. Test Chat
1. Open a booking detail page
2. Use the chat window to send messages
3. Messages appear in real-time for both parties

### 4. Test Payments
1. Complete a booking as a service provider
2. As customer, view booking details
3. Use the payment button to pay (test mode with Stripe)

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod` (local) or check Atlas connection
- Verify the connection string in `.env`

### Socket.io Connection Issues
- Check that the backend server is running on port 5000
- Verify `VITE_SOCKET_URL` in client `.env`

### Payment Issues
- Stripe keys are required for payment functionality
- Use test keys from Stripe dashboard for development
- Test card: `4242 4242 4242 4242`

### Port Already in Use
- Change ports in `.env` files if 5000 or 5173 are in use
- Update `CLIENT_URL` and `VITE_SOCKET_URL` accordingly

## Production Deployment

1. Build the frontend:
   ```bash
   cd client
   npm run build
   ```

2. Set production environment variables
3. Use a production MongoDB instance
4. Configure proper CORS settings
5. Use production Stripe keys
6. Deploy backend to services like Heroku, Railway, or AWS
7. Deploy frontend to Vercel, Netlify, or similar
