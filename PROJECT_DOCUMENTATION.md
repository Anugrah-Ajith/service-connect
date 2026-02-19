# Service Connect App - Project Documentation for Viva

## 1. Project Overview

**Project Name**: Service Connect App  
**Type**: Full-Stack Web Application (MERN Stack)

**Abstract**:  
The Service Connect App is a platform that seamlessly connects customers with skilled service providers (like Plumbers, Electricians, Mechanics, etc.). It acts as a bridge, allowing users to find, book, and pay for services online, while empowering professionals to manage their business, track earnings, and showcase their skills. The application includes three distinct user roles: Customers, Service Providers, and Administrators, each with tailored dashboards and functionalities.

---

## 2. Technology Stack

This section explains the tools and technologies used to build the project.

### Frontend (Client-Side)
*   **React.js (with Vite)**: A JavaScript library for building fast and interactive user interfaces. Vite is used as the build tool for superior development speed.
*   **TypeScript**: Adds static typing to JavaScript, reducing bugs and improving code quality.
*   **Tailwind CSS**: A utility-first CSS framework for rapid and responsive UI design.
*   **Zustand**: A small, fast state management solution (used for managing authentication state globally).
*   **React Router DOM**: Handles navigation between different pages in the application.
*   **Axios**: For making HTTP requests to the backend API.
*   **Lucide React**: For scalable vector icons.

### Backend (Server-Side)
*   **Node.js**: A runtime environment for executing JavaScript on the server.
*   **Express.js**: A web application framework for Node.js, used to build the API.
*   **TypeScript**: Used on the server as well for type safety.
*   **Socket.IO**: Enables real-time, bidirectional communication (used for chat features and updates).
*   **Multer**: Handling file uploads (e.g., profile pictures, certification documents).

### Database
*   **MongoDB**: An open-source NoSQL database used to store application data in a flexible, JSON-like format.
*   **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js.

### Additional Tools & APIs
*   **Stripe**: Payment processing gateway integration.
*   **JSON Web Tokens (JWT)**: For secure user authentication and authorization.
*   **Bcrypt.js**: For hashing passwords before storing them in the database.

---

## 3. System Architecture & Workflow

1.  **Client-Server Model**: The application follows a client-server architecture. The frontend (React) sends HTTP requests to the backend (Express API).
2.  **Authentication Flow**:
    *   User registers/logs in -> Server validates credentials -> Server issues a JWT (Token).
    *   The frontend stores this token and sends it in the header of subsequent requests (`Authorization: Bearer <token>`) to access protected routes.
3.  **Booking Workflow**:
    *   **Customer**: Browses providers -> Selects a provider -> Books a service.
    *   **Backend**: Creates a Booking record in MongoDB with status 'pending'.
    *   **Provider**: Sees the new request in their dashboard -> Accepts/Rejects it.
    *   **Status Update**: If accepted, status changes to 'confirmed'.

---

## 4. Key Features & Modules

### A. User Module (Customer)
*   **Registration/Login**: Users can sign up as customers.
*   **Dashboard**: Displays active bookings, quick links to services.
*   **Browse Providers**: Filter providers by category (Plumber, Electrician), rating, etc.
*   **Book Service**: Schedule a service with a specific provider.
*   **My Bookings**: View history of past and current bookings.

### B. Service Provider Module
*   **Profile Setup**: Providers can set their hourly rate, experience, availability, and upload certifications.
*   **Dashboard**: View earnings, upcoming jobs, and performance stats.
*   **Manage Bookings**: Accept or reject incoming service requests.
*   **Verification**: Upload documents for admin verification to get the "Verified" badge.

### C. Admin Dashboard (Super User)
*   **System Overview**: View total users, providers, bookings, and revenue stats.
*   **User Management**: View all users, activate/deactivate accounts.
*   **Provider Verification**: Review submitted documents and verify/approve service providers.
*   **Booking Oversight**: View all bookings happening on the platform.

---

## 5. Database Schema Design (MongoDB)

Explain the structure of your data models during the viva.

1.  **User Model (`User.model.ts`)**:
    *   Stores basic info: `firstName`, `lastName`, `email`, `password`, `role` (customer/admin/provider).
    *   Status flags: `isVerified`, `isActive`.

2.  **Service Provider Model (`ServiceProvider.model.ts`)**:
    *   Linked to User Model via `userId`.
    *   Stores business info: `businessName`, `skills`, `hourlyRate`, `experience`, `availability`, `verificationStatus`.

3.  **Booking Model (`Booking.model.ts`)**:
    *   Links `customerId` (User) and `serviceProviderId` (ServiceProvider).
    *   Stores appointment details: `date`, `time`, `status` (pending/confirmed/completed), `totalAmount`, `paymentStatus`.

---

## 6. Code Structure Explanation

When showing your code, focus on these key files:

### Backend (`server/src`)
*   **`index.ts`**: The entry point. Sets up the Express server, connects to MongoDB, mounts routes, and starts the server.
*   **`routes/`**: Contains API definitions.
    *   `auth.routes.ts`: `/register`, `/login`.
    *   `admin.routes.ts`: `/admin/stats`, `/admin/users` (Protected routes).
    *   `booking.routes.ts`: CRUD operations for bookings.
*   **`middleware/auth.middleware.ts`**: The gatekeeper. It checks if the request has a valid JWT token before allowing access to protected routes.

### Frontend (`client/src`)
*   **`App.tsx`**: The main component setting up routing.
*   **`store/authStore.ts`**: (If using Zustand) Manages the logged-in user's state globally, so you access user info from any component.
*   **`pages/`**:
    *   `HomePage.tsx`: Landing page with hero section and features.
    *   `AdminDashboard.tsx`: complex dashboard with charts/tables.
*   **`api/api.ts`**: Centralized Axios instance with interceptors to automatically attach the Auth token to every request.

---

## 7. Viva Questions & Answers

**Q1: How does authentication work in your app?**
**A**: I use JWT (JSON Web Tokens). When a user logs in, the server generates a token signed with a secret key. This token is sent to the client and stored (e.g., in localStorage). Every subsequent request includes this token in the header. The server verifies the signature to identify the user.

**Q2: What is the difference between SQL and NoSQL? Why did you choose MongoDB?**
**A**: SQL (like MySQL) is relational and table-based with fixed schemas. NoSQL (like MongoDB) is document-oriented and flexible. I chose MongoDB because its JSON-like documents map directly to objects in my JavaScript code, making development faster and schema changes easier (MERN stack synergy).

**Q3: How do you handle real-time features?**
**A**: (If applicable) I use Socket.IO. It establishes a persistent WebSocket connection between the client and server, allowing instant updates (like chat messages or booking status changes) without the client needing to refresh the page.

**Q4: How do you secure user passwords?**
**A**: I never store plain text passwords. I use `bcrypt.js` to hash passwords with a salt before saving them to the database. When a user logs in, I compare the hash of the entered password with the stored hash.

**Q5: What is the purpose of the `useEffect` hook in React?**
**A**: It allows us to perform side effects in function components, such as fetching data from an API when the component mounts or when a specific state variable changes.

**Q6: Explain the role of Middleware in Express.**
**A**: Middleware functions have access to the request (`req`) and response (`res`) objects. They can execute code, modify the request/response, and call the next middleware. I use them for authentication (checking tokens), error handling, and parsing JSON bodies.

---

## 8. Requirements for Viva Presentation

1.  **Working Demo**: Ensure your server is running (`npm run dev:server`) and client is running (`npm run dev:client`).
2.  **Database Access**: Have MongoDB Compass or your terminal open to show the actual data being stored.
3.  **Code Walkthrough**: Be ready to open `server/index.ts` and explain how the server starts, and `client/src/App.tsx` to explain routing.
4.  **Admin Access**: Have an admin account pre-created to show the "Admin Dashboard" capabilities.

## 9. Future Enhancements
*   Mobile Application (React Native).
*   AI-powered recommendation engine for finding providers.
*   Integration with Google Maps API for real-time tracking of providers.
