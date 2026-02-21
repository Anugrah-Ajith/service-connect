import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import ChatWindow from '../components/ChatWindow';
import PaymentButton from '../components/PaymentButton';
import { Calendar, Clock, MapPin, XCircle, Mail, Phone } from 'lucide-react';

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
        {/* Status Header & Progress Tracker */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Booking Reference</p>
              <h1 className="text-xl font-mono font-bold text-gray-900">#{booking._id.slice(-8).toUpperCase()}</h1>
            </div>
            <div className="mt-4 md:mt-0">
              <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm ${booking.status === 'completed' ? 'bg-green-500 text-white' :
                booking.status === 'confirmed' ? 'bg-blue-500 text-white' :
                  booking.status === 'in_progress' ? 'bg-amber-500 text-white' :
                    booking.status === 'cancelled' ? 'bg-red-500 text-white' :
                      'bg-gray-400 text-white'
                }`}>
                {booking.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-100">
              <div
                style={{
                  width:
                    booking.status === 'pending' ? '25%' :
                      booking.status === 'confirmed' ? '50%' :
                        booking.status === 'in_progress' ? '75%' :
                          booking.status === 'completed' ? '100%' : '0%'
                }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${booking.status === 'cancelled' ? 'bg-red-500 w-full' : 'bg-primary-600'
                  }`}
              ></div>
            </div>
            <div className="flex text-xs text-gray-500 justify-between font-medium">
              <span className={booking.status === 'pending' ? 'text-primary-600 font-bold' : ''}>Requested</span>
              <span className={booking.status === 'confirmed' ? 'text-primary-600 font-bold' : ''}>Confirmed</span>
              <span className={booking.status === 'in_progress' ? 'text-primary-600 font-bold' : ''}>In Progress</span>
              <span className={booking.status === 'completed' ? 'text-primary-600 font-bold' : ''}>Completed</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Service Details</h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Service Requested</h3>
                  <p className="text-xl font-bold text-gray-900 capitalize">{booking.serviceType}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Task Description</h3>
                  <p className="text-gray-700 leading-relaxed text-lg bg-gray-50 p-4 rounded-xl border border-gray-100 italic">
                    "{booking.description}"
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                    <Calendar className="h-6 w-6 text-primary-600 mr-4" />
                    <div>
                      <p className="text-xs text-gray-500">Scheduled Date</p>
                      <p className="font-bold text-gray-900">{new Date(booking.scheduledDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                    <Clock className="h-6 w-6 text-primary-600 mr-4" />
                    <div>
                      <p className="text-xs text-gray-500">Preferred Time</p>
                      <p className="font-bold text-gray-900">{booking.scheduledTime}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start p-4 bg-gray-50 rounded-xl">
                  <MapPin className="h-6 w-6 text-primary-600 mr-4 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500">Service Location</p>
                    <p className="font-bold text-gray-900 leading-snug">
                      {booking.location.address}<br />
                      {booking.location.city}, {booking.location.state} {booking.location.zipCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Window */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Communication Center</h2>
                <span className="text-xs text-green-500 font-bold flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                  Live Chat
                </span>
              </div>
              <ChatWindow bookingId={id!} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Payment & Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-primary-600 px-6 py-4">
                <h2 className="text-lg font-bold text-white">Price Summary</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Base Rate</span>
                  <span className="font-medium">${(booking.totalAmount / (booking.isEmergency ? 1.5 : 1)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Time</span>
                  <span className="font-medium">{booking.estimatedHours} hrs</span>
                </div>
                {booking.isEmergency && (
                  <div className="flex justify-between text-red-500 font-bold text-sm">
                    <span>Emergency Surcharge (50%)</span>
                    <span>Included</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="flex justify-between items-end">
                    <span className="text-gray-900 font-bold">Grand Total</span>
                    <span className="text-3xl font-black text-primary-600">${booking.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <div className={`w-full py-2 rounded-lg text-center font-bold text-xs uppercase tracking-widest ${booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                    {booking.paymentStatus === 'paid' ? 'Invoice Paid' : 'Payment Required'}
                  </div>
                </div>

                {isCustomer && booking.paymentStatus === 'pending' && booking.status === 'completed' && (
                  <div className="pt-4">
                    <PaymentButton bookingId={booking._id} amount={booking.totalAmount} onSuccess={fetchBooking} />
                  </div>
                )}
              </div>
            </div>

            {/* Provider Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                {isCustomer ? 'Your Service Expert' : 'Client Profile'}
              </h3>
              <div className="flex items-center mb-6">
                <div className="h-14 w-14 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-black text-xl mr-4 shadow-inner">
                  {(isCustomer ? providerName : booking.customerId.firstName).charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg leading-tight">
                    {isCustomer ? providerName : `${booking.customerId.firstName} ${booking.customerId.lastName}`}
                  </h4>
                  <p className="text-sm text-gray-500">Service Professional</p>
                </div>
              </div>

              <div className="space-y-3">
                {isProvider && (
                  <>
                    <div className="flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors cursor-pointer">
                      <Mail className="h-4 w-4 mr-3" />
                      {(booking.customerId as any).email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors cursor-pointer">
                      <Phone className="h-4 w-4 mr-3" />
                      {(booking.customerId as any).phone}
                    </div>
                  </>
                )}
                <button className="w-full mt-4 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all active:scale-95">
                  View Full Profile
                </button>
              </div>
            </div>

            {/* Cancellation Action */}
            {isCustomer && booking.status === 'pending' && (
              <button
                onClick={() => updateStatus('cancelled')}
                className="w-full flex items-center justify-center py-4 px-4 rounded-2xl font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-all group"
              >
                <XCircle className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" />
                Cancel Request
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsPage;

