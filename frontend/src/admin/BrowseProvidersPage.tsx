import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Search, Star, MapPin, Shield, Filter, ArrowRight } from 'lucide-react';
import api from '../api/api';
import toast from 'react-hot-toast';

interface ServiceProvider {
  _id: string;
  businessName?: string;
  serviceTypes: string[];
  hourlyRate: number;
  location: {
    city: string;
    state: string;
  };
  rating: number;
  totalReviews: number;
  isVerified: boolean;
  userId: {
    firstName: string;
    lastName: string;
  };
}

const BrowseProvidersPage = () => {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [minRating, setMinRating] = useState('');

  useEffect(() => {
    fetchProviders();
  }, [serviceType, minRating]);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (serviceType) params.serviceType = serviceType;
      if (minRating) params.minRating = minRating;

      const response = await api.get('/service-providers', { params });
      setProviders(response.data);
    } catch (error) {
      toast.error('Failed to load service providers');
    } finally {
      setLoading(false);
    }
  };

  const filteredProviders = providers.filter(provider => {
    const name = provider.businessName || `${provider.userId.firstName} ${provider.userId.lastName}`;
    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.serviceTypes.some(type => type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      provider.location.city.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-dark-900 text-white relative">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[120px] pointer-events-none" />

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-heading mb-4">
            Find <span className="text-gradient">Elite Professionals</span>
          </h1>
          <p className="text-dark-300 max-w-2xl mx-auto">
            Connect with verified experts for your next project.
            Quality assured, satisfaction guaranteed.
          </p>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-2xl border-white/5 p-6 mb-12 shadow-xl shadow-black/20">
          <div className="flex items-center space-x-2 mb-6 text-primary-400">
            <Filter className="h-5 w-5" />
            <h2 className="font-semibold text-lg">Refine Search</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-dark-400 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="text"
                placeholder="Search by name, service, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
              />
            </div>

            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="px-4 py-3 bg-dark-800 border border-dark-600 rounded-xl text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all appearance-none cursor-pointer hover:bg-dark-700"
            >
              <option value="">All Services</option>
              <option value="plumber">Plumber</option>
              <option value="electrician">Electrician</option>
              <option value="mechanic">Mechanic</option>
              <option value="carpenter">Carpenter</option>
            </select>

            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="px-4 py-3 bg-dark-800 border border-dark-600 rounded-xl text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all appearance-none cursor-pointer hover:bg-dark-700"
            >
              <option value="">All Ratings</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
            </select>

            <button
              onClick={() => {
                setServiceType('');
                setMinRating('');
                setSearchTerm('');
              }}
              className="px-4 py-3 text-dark-300 border border-dark-600 rounded-xl hover:bg-dark-700 hover:text-white transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Providers List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-80 bg-dark-800 rounded-2xl"></div>
            ))}
          </div>
        ) : filteredProviders.length === 0 ? (
          <div className="text-center py-20 bg-dark-800/30 rounded-3xl border border-white/5">
            <Search className="h-16 w-16 text-dark-600 mx-auto mb-4" />
            <p className="text-dark-300 text-lg">No providers found matching your criteria.</p>
            <button
              onClick={() => {
                setServiceType('');
                setMinRating('');
                setSearchTerm('');
              }}
              className="mt-4 text-primary-400 hover:text-primary-300 font-medium"
            >
              Clear filters and try again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
            {filteredProviders.map((provider) => {
              const name = provider.businessName || `${provider.userId.firstName} ${provider.userId.lastName}`;
              return (
                <Link
                  key={provider._id}
                  to={`/providers/${provider._id}`}
                  className="group bg-dark-800/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6 hover:bg-dark-800 hover:border-primary-500/50 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors mb-1">{name}</h3>
                      <div className="flex items-center space-x-2 text-dark-400">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">
                          {provider.location.city}, {provider.location.state}
                        </span>
                      </div>
                    </div>
                    {provider.isVerified && (
                      <div className="bg-primary-500/10 p-2 rounded-lg" title="Verified Professional">
                        <Shield className="h-5 w-5 text-primary-400" />
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {provider.serviceTypes.slice(0, 3).map((type) => (
                        <span
                          key={type}
                          className="px-3 py-1 bg-dark-700/50 border border-white/5 text-dark-300 text-xs font-medium rounded-lg capitalize group-hover:border-primary-500/30 transition-colors"
                        >
                          {type}
                        </span>
                      ))}
                      {provider.serviceTypes.length > 3 && (
                        <span className="px-3 py-1 bg-dark-700/50 border border-white/5 text-dark-400 text-xs font-medium rounded-lg">
                          +{provider.serviceTypes.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center space-x-1.5">
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      <span className="font-bold text-white">
                        {provider.rating.toFixed(1)}
                      </span>
                      <span className="text-sm text-dark-400">
                        ({provider.totalReviews})
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-white">
                        ${provider.hourlyRate}<span className="text-xs text-dark-400 font-normal">/hr</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center text-primary-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    View Profile <ArrowRight className="ml-1 h-4 w-4" />
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

export default BrowseProvidersPage;

