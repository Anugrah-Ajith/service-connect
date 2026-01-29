import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/api';
import toast from 'react-hot-toast';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface Booking {
  _id: string;
  serviceType: string;
  status: string;
  scheduledDate: string;
  scheduledTime: string;
  totalAmount: number;
  location: {
    city: string;
    state: string;
  };
  customerId?: {
    firstName: string;
    lastName: string;
  };
  serviceProviderId: {
    businessName?: string;
    userId: {
      firstName: string;
      lastName: string;
    };
  };
}

const MyBookingsPage = () => {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/my-bookings');
      setBookings(response.data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          {user?.role === 'customer' && (
            <Link
              to="/providers"
              className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Find Providers
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex space-x-2">
            {['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'All' : status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 mb-4">No bookings found</p>
            {user?.role === 'customer' && (
              <Link
                to="/providers"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Browse Service Providers
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const providerName = booking.serviceProviderId?.businessName || 
                `${booking.serviceProviderId?.userId?.firstName} ${booking.serviceProviderId?.userId?.lastName}`;
              const customerName = booking.customerId 
                ? `${booking.customerId.firstName} ${booking.customerId.lastName}`
                : '';

              return (
                <Link
                  key={booking._id}
                  to={`/bookings/${booking._id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 block"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-xl font-semibold text-gray-900 capitalize">
                          {booking.serviceType}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          booking.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(booking.scheduledDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{booking.scheduledTime}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{booking.location.city}, {booking.location.state}</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mt-3">
                        {user?.role === 'customer' 
                          ? `Provider: ${providerName}`
                          : `Customer: ${customerName}`}
                      </p>
                    </div>

                    <div className="text-right ml-4">
                      <p className="text-2xl font-bold text-primary-600">
                        ${booking.totalAmount.toFixed(2)}
                      </p>
                      <ArrowRight className="h-5 w-5 text-gray-400 mt-2 ml-auto" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;

