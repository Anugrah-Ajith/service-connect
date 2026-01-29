import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Star, MapPin, Shield, Clock, ArrowLeft, CheckCircle } from 'lucide-react';
import api from '../api/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

interface ServiceProvider {
  _id: string;
  businessName?: string;
  serviceTypes: string[];
  hourlyRate: number;
  experience: number;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  rating: number;
  totalReviews: number;
  isVerified: boolean;
  description: string;
  userId: {
    firstName: string;
    lastName: string;
    phone: string;
  };
}

interface Review {
  _id: string;
  rating: number;
  comment: string;
  customerId: {
    firstName: string;
    lastName: string;
  };
  createdAt: string;
}

const ProviderProfilePage = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProvider();
      fetchReviews();
    }
  }, [id]);

  const fetchProvider = async () => {
    try {
      const response = await api.get(`/service-providers/${id}`);
      setProvider(response.data);
    } catch (error) {
      toast.error('Failed to load provider');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/reviews/provider/${id}`);
      setReviews(response.data);
    } catch (error) {
      // Reviews might not exist yet
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 text-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-dark-900 text-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Provider not found</h2>
          <Link to="/providers" className="text-primary-400 hover:text-primary-300">
            Return to Browse
          </Link>
        </div>
      </div>
    );
  }

  const name = provider.businessName || `${provider.userId.firstName} ${provider.userId.lastName}`;

  return (
    <div className="min-h-screen bg-dark-900 text-white relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[100px] pointer-events-none" />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in relative min-h-screen">
        <Link to="/providers" className="inline-flex items-center text-dark-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Providers
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Profile Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card rounded-2xl border-white/5 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Shield className="h-32 w-32" />
              </div>

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h1 className="text-4xl font-bold font-heading">{name}</h1>
                      {provider.isVerified && (
                        <div title="Verified Professional">
                          <Shield className="h-6 w-6 text-primary-400 fill-primary-400/20" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-dark-300">
                      <MapPin className="h-5 w-5 text-primary-500" />
                      <span>
                        {provider.location.city}, {provider.location.state}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  {provider.serviceTypes.map((type) => (
                    <span
                      key={type}
                      className="px-4 py-1.5 bg-primary-500/10 border border-primary-500/20 text-primary-300 rounded-lg capitalize font-medium"
                    >
                      {type}
                    </span>
                  ))}
                </div>

                <div className="prose prose-invert max-w-none">
                  <h3 className="text-lg font-bold text-white mb-2">About</h3>
                  <p className="text-dark-300 leading-relaxed">{provider.description}</p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-card p-6 rounded-2xl border-white/5 text-center">
                <div className="flex justify-center mb-2">
                  <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
                </div>
                <p className="text-3xl font-bold text-white mb-1">{provider.rating.toFixed(1)}</p>
                <p className="text-sm text-dark-400">{provider.totalReviews} reviews</p>
              </div>
              <div className="glass-card p-6 rounded-2xl border-white/5 text-center">
                <div className="flex justify-center mb-2">
                  <Clock className="h-8 w-8 text-primary-500" />
                </div>
                <p className="text-3xl font-bold text-white mb-1">{provider.experience}+</p>
                <p className="text-sm text-dark-400">Years Experience</p>
              </div>
              <div className="glass-card p-6 rounded-2xl border-white/5 text-center">
                <div className="flex justify-center mb-2">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <p className="text-3xl font-bold text-white mb-1">100%</p>
                <p className="text-sm text-dark-400">Job Success</p>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="glass-card rounded-2xl border-white/5 p-8">
              <h2 className="text-2xl font-bold font-heading mb-6">Client Reviews</h2>
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review._id} className="border-b border-white/5 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="font-bold text-white">
                            {review.customerId.firstName} {review.customerId.lastName}
                          </p>
                          <div className="flex items-center space-x-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-dark-600'
                                  }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-dark-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-dark-300 italic">"{review.comment}"</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-dark-400 text-center py-8">No reviews yet.</p>
              )}
            </div>
          </div>

          {/* Right Column: Booking Card */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl border-white/5 p-6 sticky top-24 border-primary-500/20 shadow-2xl shadow-primary-900/20">
              <h3 className="text-xl font-bold text-white mb-6">Booking Summary</h3>

              <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
                <span className="text-dark-300">Hourly Rate</span>
                <span className="text-2xl font-bold text-white">${provider.hourlyRate}</span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center text-dark-300 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Verified License
                </div>
                <div className="flex items-center text-dark-300 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Background Checked
                </div>
                <div className="flex items-center text-dark-300 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Satisfaction Guarantee
                </div>
              </div>

              {user && user.role === 'customer' ? (
                <Link
                  to={`/book/${provider._id}`}
                  className="block w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white text-center py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-primary-500/25 transition-all active:scale-95"
                >
                  Book Appointment
                </Link>
              ) : !user ? (
                <Link
                  to="/login"
                  className="block w-full bg-dark-700 text-white text-center py-4 rounded-xl font-bold hover:bg-dark-600 transition-all"
                >
                  Login to Book
                </Link>
              ) : (
                <div className="text-center p-4 bg-dark-800 rounded-xl text-dark-300 text-sm">
                  Providers cannot book other providers.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfilePage;

