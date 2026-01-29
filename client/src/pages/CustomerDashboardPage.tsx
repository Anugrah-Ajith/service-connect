import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuthStore } from '../store/authStore';
import { Wrench, Plus, Clock, Star, Calendar, ChevronRight, Zap, Droplet, Truck, Paintbrush, Hammer, Search } from 'lucide-react';
import api from '../api/api';
import toast from 'react-hot-toast';

interface Booking {
  _id: string;
  serviceType: string;
  status: string;
  scheduledDate: string;
  totalAmount: number;
  serviceProviderId: {
    businessName?: string;
    userId: {
      firstName: string;
      lastName: string;
    };
  };
}

const CustomerDashboardPage = () => {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/my-bookings');
      setBookings(response.data.slice(0, 5));
    } catch (error) {
      console.error('Failed to load bookings', error);
      // toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: 'Plumber', icon: Droplet, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { name: 'Electrician', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    { name: 'Mechanic', icon: Wrench, color: 'text-red-400', bg: 'bg-red-500/20' },
    { name: 'Carpenter', icon: Hammer, color: 'text-orange-400', bg: 'bg-orange-500/20' },
    { name: 'Painter', icon: Paintbrush, color: 'text-purple-400', bg: 'bg-purple-500/20' },
    { name: 'Movers', icon: Truck, color: 'text-green-400', bg: 'bg-green-500/20' },
  ];

  return (
    <div className="min-h-screen bg-dark-900 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[100px] pointer-events-none" />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold font-heading mb-2">
              Hello, <span className="text-gradient">{user?.firstName}</span>
            </h1>
            <p className="text-dark-300">Ready to find the perfect professional?</p>
          </div>
          <Link
            to="/providers"
            className="mt-4 md:mt-0 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary-500/20 flex items-center"
          >
            <Search className="h-5 w-5 mr-2" />
            Browse All Providers
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="mb-12 animate-slide-up">
          <h2 className="text-xl font-bold font-heading mb-6 flex items-center">
            <Wrench className="h-5 w-5 mr-2 text-primary-400" />
            Quick Services
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, index) => (
              <Link
                key={index}
                to={`/providers?category=${cat.name.toLowerCase()}`}
                className="glass-card p-6 rounded-2xl border-white/5 hover:border-primary-500/30 hover:bg-dark-800 transition-all duration-300 group text-center flex flex-col items-center"
              >
                <div className={`p-4 rounded-full mb-3 ${cat.bg} group-hover:scale-110 transition-transform`}>
                  <cat.icon className={`h-6 w-6 ${cat.color}`} />
                </div>
                <span className="font-semibold text-dark-200 group-hover:text-white transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Active Bookings Section */}
          <div className="lg:col-span-2 glass-card rounded-2xl border-white/5 p-8 animate-fade-in delay-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold font-heading flex items-center">
                <Calendar className="h-6 w-6 mr-2 text-primary-400" />
                Active Bookings
              </h2>
              <Link to="/my-bookings" className="text-sm text-primary-400 hover:text-primary-300 font-medium hover:underline">
                View History
              </Link>
            </div>

            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="h-24 bg-dark-800 rounded-xl"></div>
                ))}
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12 bg-dark-800/50 rounded-xl border border-white/5 border-dashed">
                <Calendar className="h-12 w-12 text-dark-500 mx-auto mb-4" />
                <p className="text-dark-300 mb-6">No active bookings</p>
                <Link
                  to="/providers"
                  className="inline-flex items-center text-primary-400 hover:text-primary-300 font-bold"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Book a Service
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <Link
                    key={booking._id}
                    to={`/bookings/${booking._id}`}
                    className="flex justify-between items-center p-5 bg-dark-800/50 border border-white/5 rounded-xl hover:border-primary-500/30 hover:bg-dark-800 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-dark-700 flex items-center justify-center text-dark-300 font-bold border border-white/5">
                        {booking.serviceType.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-white capitalize group-hover:text-primary-400 transition-colors">
                          {booking.serviceType}
                        </h3>
                        <p className="text-sm text-dark-400">
                          with {booking.serviceProviderId?.businessName ||
                            `${booking.serviceProviderId?.userId?.firstName} ${booking.serviceProviderId?.userId?.lastName}`}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full mb-1 ${booking.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          booking.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400' :
                            booking.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-dark-700 text-dark-300'
                        }`}>
                        {booking.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <p className="text-sm text-dark-400 flex items-center justify-end gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(booking.scheduledDate).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions Side Panel */}
          <div className="glass-card rounded-2xl border-white/5 p-8 h-fit animate-fade-in delay-200">
            <h2 className="text-xl font-bold font-heading mb-6 text-white">Need Help?</h2>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                <div className="flex items-center mb-2">
                  <Star className="h-5 w-5 text-yellow-400 mr-2" />
                  <h3 className="font-bold text-yellow-100">Priority Support</h3>
                </div>
                <p className="text-sm text-yellow-200/70 mb-3">Get faster responses for urgent issues.</p>
                <button className="w-full py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 text-sm font-bold rounded-lg transition-colors border border-yellow-500/30">
                  Contact Support
                </button>
              </div>

              <Link to="/my-bookings" className="flex items-center justify-between p-4 bg-dark-800/50 hover:bg-dark-800 rounded-xl transition-colors group">
                <span className="text-dark-200 group-hover:text-white font-medium">Past Bookings</span>
                <ChevronRight className="h-4 w-4 text-dark-400 group-hover:text-white" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CustomerDashboardPage;

