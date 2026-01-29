import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { Clock, DollarSign, Calendar, AlertCircle, TrendingUp, Power, CheckCircle, XCircle } from 'lucide-react';

interface Booking {
  _id: string;
  serviceType: string;
  status: string;
  scheduledDate: string;
  totalAmount: number;
  customerId: {
    firstName: string;
    lastName: string;
  };
}

interface ProviderStats {
  totalBookings: number;
  completedBookings: number;
  pendingBookings: number;
  totalEarnings: number;
}

const ServiceProviderDashboard = () => {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<ProviderStats>({
    totalBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
    totalEarnings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true); // Mock availability state

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/my-bookings');
      const bookingsData = response.data;
      setBookings(bookingsData.slice(0, 5));

      // Calculate stats
      const completed = bookingsData.filter((b: Booking) => b.status === 'completed');
      const pending = bookingsData.filter((b: Booking) =>
        ['pending', 'confirmed', 'in_progress'].includes(b.status)
      );
      const earnings = completed.reduce((sum: number, b: Booking) => sum + b.totalAmount, 0);

      setStats({
        totalBookings: bookingsData.length,
        completedBookings: completed.length,
        pendingBookings: pending.length,
        totalEarnings: earnings,
      });
    } catch (error) {
      //   toast.error('Failed to load dashboard data'); 
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = () => {
    // In a real app, this would make an API call
    setIsAvailable(!isAvailable);
    toast.success(isAvailable ? 'You are now offline' : 'You are now online');
  };

  const StatCard = ({ title, value, icon: Icon, color, prefix = '' }: any) => (
    <div className="glass-card p-6 rounded-2xl border-white/5 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
        <Icon className={`h-20 w-20 ${color}`} />
      </div>
      <div className="relative z-10">
        <div className={`h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 border border-white/10`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <p className="text-dark-400 text-sm font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold text-white tracking-tight">{prefix}{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-900 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-secondary-600/10 rounded-full blur-[100px] pointer-events-none" />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 animate-fade-in gap-6">
          <div>
            <h1 className="text-4xl font-bold font-heading mb-2">
              Provider Dashboard
            </h1>
            <p className="text-dark-300">Manage your business and track performance.</p>
          </div>

          <div className="flex items-center gap-4 bg-dark-800/50 p-2 rounded-xl border border-white/5">
            <div className={`flex items-center px-4 py-2 rounded-lg transition-colors ${isAvailable ? 'bg-green-500/20 text-green-400' : 'text-dark-400'}`}>
              <CheckCircle className="h-4 w-4 mr-2" />
              <span className="font-bold text-sm">Online</span>
            </div>
            <button
              onClick={toggleAvailability}
              className={`p-2 rounded-lg transition-all ${isAvailable ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400' : 'bg-green-500/10 hover:bg-green-500/20 text-green-400'}`}
              title={isAvailable ? "Go Offline" : "Go Online"}
            >
              <Power className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-slide-up">
          <StatCard
            title="Total Earnings"
            value={stats.totalEarnings.toFixed(2)}
            icon={DollarSign}
            color="text-green-400"
            prefix="$"
          />
          <StatCard
            title="Active Jobs"
            value={stats.pendingBookings}
            icon={Clock}
            color="text-yellow-400"
          />
          <StatCard
            title="Completed"
            value={stats.completedBookings}
            icon={TrendingUp}
            color="text-primary-400"
          />
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings}
            icon={Calendar}
            color="text-secondary-400"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link
            to="/provider/setup"
            className="group glass-card p-8 rounded-2xl border-white/5 hover:border-primary-500/30 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white mb-2">Edit Profile</h3>
              <p className="text-dark-400">Update services, pricing, and business details</p>
            </div>
          </Link>

          <Link
            to="/my-bookings"
            className="group glass-card p-8 rounded-2xl border-white/5 hover:border-secondary-500/30 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-secondary-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white mb-2">Manage Bookings</h3>
              <p className="text-dark-400">View upcoming jobs and booking requests</p>
            </div>
          </Link>
        </div>

        {/* Recent Bookings */}
        <div className="glass-card rounded-2xl border-white/5 p-8 animate-fade-in delay-100">
          <h2 className="text-2xl font-bold font-heading mb-8">Recent Requests</h2>
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-dark-800 rounded-xl"></div>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12 bg-dark-800/50 rounded-xl border border-white/5">
              <AlertCircle className="h-12 w-12 text-dark-500 mx-auto mb-4" />
              <p className="text-dark-300 mb-2">No active bookings yet</p>
              <p className="text-sm text-dark-500">
                Optimize your profile to attract more customers
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Link
                  key={booking._id}
                  to={`/bookings/${booking._id}`}
                  className="block p-5 bg-dark-800/50 border border-white/5 rounded-xl hover:border-primary-500/30 hover:bg-dark-800 transition-all group"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-dark-700 flex items-center justify-center text-dark-300 font-bold border border-white/5">
                        {booking.serviceType.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-white capitalize group-hover:text-primary-400 transition-colors">
                          {booking.serviceType}
                        </h3>
                        <p className="text-sm text-dark-300">
                          Client: {booking.customerId.firstName} {booking.customerId.lastName}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full mb-2 ${booking.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        booking.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400' :
                          booking.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-dark-700 text-dark-300'
                        }`}>
                        {booking.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <p className="text-lg font-bold text-white">
                        ${booking.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderDashboard;
