import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import HomePage from './admin/HomePage';
import LoginPage from './admin/LoginPage';
import RegisterPage from './admin/RegisterPage';
import CustomerDashboardPage from './admin/CustomerDashboardPage';
import BrowseProvidersPage from './admin/BrowseProvidersPage';
import ProviderProfilePage from './admin/ProviderProfilePage';
import CreateBookingPage from './admin/CreateBookingPage';
import BookingDetailsPage from './admin/BookingDetailsPage';
import MyBookingsPage from './admin/MyBookingsPage';
import ServiceProviderDashboard from './admin/ServiceProviderDashboard';
import ServiceProviderProfileSetup from './admin/ServiceProviderProfileSetup';
import ProfilePage from './admin/ProfilePage';
import ChangePasswordPage from './admin/ChangePasswordPage';
import AdminDashboard from './admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { user } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />
        <Route path="/providers" element={<BrowseProvidersPage />} />
        <Route path="/providers/:id" element={<ProviderProfilePage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <CustomerDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book/:providerId"
          element={
            <ProtectedRoute>
              <CreateBookingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings/:id"
          element={
            <ProtectedRoute>
              <BookingDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/dashboard"
          element={
            <ProtectedRoute requiredRole="service_provider">
              <ServiceProviderDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/setup"
          element={
            <ProtectedRoute requiredRole="service_provider">
              <ServiceProviderProfileSetup />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePasswordPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;

