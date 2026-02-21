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

### Profile & Account Management
- **User Profiles**: Comprehensive profiles for both customers and providers
- **Detailed Info**: Management of name, phone number, and email
- **Visual Identity**: Profile photo upload and display support
- **Trust Indicators**: Real-time verification status (Verified/Pending)
- **Security**: Secure password change functionality
- **Account Control**: Self-service account deactivation and deletion
- **Session Management**: Secure logout and persistent authentication state

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- React Router for navigation
- Zustand for state management
- Socket.io Client for real-time chat
- Stripe for payments
- Lucide React for consistent iconography
- React Hot Toast for sleek notifications

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
  - Create `.env` file in the `backend` directory:
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

## Detailed Project Structure

The application is divided into three main logical sections: **Frontend (Client)**, **Admin**, and **Backend (Server)**.

### 🌐 Frontend Section
Located in the `frontend/` directory, built with React and Vite.

- **`src/admin/`**:
  - `HomePage.tsx`: Main landing page
  - `LoginPage.tsx` / `RegisterPage.tsx`: Authentication pages
  - `CustomerDashboardPage.tsx`: Dashboard for customers
  - `BrowseProvidersPage.tsx`: Listing of available service providers
  - `ProviderProfilePage.tsx`: Individual provider profiles
  - `CreateBookingPage.tsx`: Booking initiation flow
  - `MyBookingsPage.tsx`: List of customer's bookings
  - `BookingDetailsPage.tsx`: Detailed view of a single booking (with chat)
  - `ServiceProviderDashboard.tsx`: Dashboard for service providers
  - `ServiceProviderProfileSetup.tsx`: Profile completion for providers
- **`src/components/`**:
  - `Navbar.tsx`: Responsive navigation with role-based links
  - `ChatWindow.tsx`: Real-time messaging interface
  - `Chatbot.tsx`: Support assistant
  - `Logo.tsx`: SVG application logo
  - `ProtectedRoute.tsx`: Route guard for authentication and roles

### 🛡️ Admin Section
Administrative features are integrated into both the client and server.

- **Frontend**:
  - `frontend/src/admin/AdminDashboard.tsx`: Comprehensive management interface for users, providers, and bookings.
- **Backend**:
  - `backend/src/routes/admin.routes.ts`: Secured API endpoints for administrative operations.

### ⚙️ Backend Section
Located in the `backend/` directory, built with Node.js, Express, and MongoDB.

- **`src/`**:
  - `index.ts`: Application entry point and server configuration
- **`src/models/`**:
  - `User.model.ts`: User accounts (Customer/Provider/Admin)
  - `ServiceProvider.model.ts`: Professional profiles and verification
  - `Booking.model.ts`: Service request records
  - `Message.model.ts`: Chat history
  - `Review.model.ts`: Customer feedback
- **`src/routes/`**: API endpoint definitions (auth, service-providers, bookings, payments, etc.)
- **`src/socket/`**: Real-time communication logic for chat and notifications
- **`src/middleware/`**: Authentication, role validation, and error handling
- **`src/utils/`**: Helper functions and constants


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

### 5. Test Profile Management
1. Click the **Profile Icon** in the navbar header
2. Select **Update Profile** to change contact details or profile photo
3. Select **Change Password** to update security credentials
4. Test **Deactivate Account** (requires confirmation)

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod` (local) or check Atlas connection
- Verify the connection string in `.env`

### Socket.io Connection Issues
- Check that the backend server is running on port 5000
- Verify `VITE_SOCKET_URL` in frontend `.env`

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
  cd frontend
  npm run build
  ```

2. Set production environment variables
3. Use a production MongoDB instance
4. Configure proper CORS settings
5. Use production Stripe keys
6. Deploy backend to services like Heroku, Railway, or AWS
7. Deploy frontend to Vercel, Netlify, or similar
