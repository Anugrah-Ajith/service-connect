import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import ChatWindow from '../components/ChatWindow';
import PaymentButton from '../components/PaymentButton';
import { Calendar, Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';

interface Booking {
  _id: string;
  serviceType: string;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  scheduledDate: string;
  scheduledTime: string;
  status: string;
  isEmergency: boolean;
  estimatedHours: number;
  totalAmount: number;
  paymentStatus: string;
  customerId: {
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

const BookingDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchBooking();
    }
  }, [id]);

  const fetchBooking = async () => {
    try {
      const response = await api.get(`/bookings/${id}`);
      setBooking(response.data);
    } catch (error) {
      toast.error('Failed to load booking');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status: string) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      toast.success('Status updated');
      fetchBooking();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">Booking not found</p>
        </div>
      </div>
    );
  }

  const isCustomer = user?.role === 'customer';
  const isProvider = user?.role === 'service_provider';
  const providerName = booking.serviceProviderId?.businessName || 
    `${booking.serviceProviderId?.userId?.firstName} ${booking.serviceProviderId?.userId?.lastName}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 capitalize mb-2">
                    {booking.serviceType}
                  </h1>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                    booking.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.status.replace('_', ' ')}
                  </span>
                  {booking.isEmergency && (
                    <span className="ml-2 inline-block px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
                      Emergency
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600">{booking.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(booking.scheduledDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Time</p>
                      <p className="font-semibold text-gray-900">{booking.scheduledTime}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold text-gray-900">
                      {booking.location.address}<br />
                      {booking.location.city}, {booking.location.state} {booking.location.zipCode}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {isCustomer ? 'Service Provider' : 'Customer'}
                  </h3>
                  <p className="text-gray-600">
                    {isCustomer ? providerName : 
                      `${booking.customerId.firstName} ${booking.customerId.lastName}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Actions */}
            {isProvider && booking.status === 'pending' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
                <div className="flex space-x-4">
                  <button
                    onClick={() => updateStatus('confirmed')}
                    className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Confirm Booking
                  </button>
                  <button
                    onClick={() => updateStatus('cancelled')}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Decline
                  </button>
                </div>
              </div>
            )}

            {isProvider && booking.status === 'confirmed' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <button
                  onClick={() => updateStatus('in_progress')}
                  className="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                >
                  Start Service
                </button>
              </div>
            )}

            {isProvider && booking.status === 'in_progress' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <button
                  onClick={() => updateStatus('completed')}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Mark as Completed</span>
                </button>
              </div>
            )}

            {isCustomer && booking.status === 'pending' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <button
                  onClick={() => updateStatus('cancelled')}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <XCircle className="h-5 w-5" />
                  <span>Cancel Booking</span>
                </button>
              </div>
            )}

            {/* Chat Window */}
            <ChatWindow bookingId={id!} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Type</span>
                  <span className="font-semibold capitalize">{booking.serviceType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Hours</span>
                  <span className="font-semibold">{booking.estimatedHours} hrs</span>
                </div>
                {booking.isEmergency && (
                  <div className="flex justify-between text-red-600">
                    <span>Emergency Surcharge</span>
                    <span>50%</span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-primary-600">
                      ${booking.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Payment Status</span>
                    <span className={`px-2 py-1 rounded text-sm font-semibold ${
                      booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                </div>
                {isCustomer && booking.paymentStatus === 'pending' && booking.status === 'completed' && (
                  <PaymentButton bookingId={booking._id} amount={booking.totalAmount} onSuccess={fetchBooking} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsPage;

