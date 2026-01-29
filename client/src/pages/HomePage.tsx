import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Wrench, Zap, Car, Hammer, Shield, Clock, Star, MessageCircle, ArrowRight, CheckCircle } from 'lucide-react';
import Chatbot from '../components/Chatbot';

const HomePage = () => {
  const services = [
    { icon: Wrench, name: 'Plumbing', desc: 'Expert pipe repairs & installation', color: 'from-blue-500 to-cyan-400' },
    { icon: Zap, name: 'Electrical', desc: 'Certified electricians', color: 'from-yellow-500 to-amber-400' },
    { icon: Car, name: 'Mechanic', desc: 'Auto maintenance & diagnostics', color: 'from-green-500 to-emerald-400' },
    { icon: Hammer, name: 'Carpentry', desc: 'Custom woodwork & repairs', color: 'from-orange-500 to-red-400' },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Verified Professionals',
      description: 'Strict background checks ensure your safety and peace of mind.'
    },
    {
      icon: Clock,
      title: 'Instant Booking',
      description: 'Book services in as little as 60 seconds with our optimized flow.'
    },
    {
      icon: Star,
      title: 'Premium Quality',
      description: 'Top-rated providers delivering excellence in every job.'
    },
    {
      icon: MessageCircle,
      title: '24/7 Support',
      description: 'Our dedicated team is always here to help you anytime.'
    },
  ];

  return (
    <div className="min-h-screen bg-dark-900 text-white overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary-500/20 to-transparent blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 rounded-full glass-card border-primary-500/30 mb-8 animate-slide-up">
            <span className="flex h-2 w-2 rounded-full bg-primary-400 mr-2 animate-pulse"></span>
            <span className="text-sm font-medium text-primary-300">#1 Trusted Service Marketplace</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-8 font-heading">
            Mastery at Your <br />
            <span className="text-gradient">Fingertips</span>
          </h1>

          <p className="text-xl text-dark-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Experience the new standard in home services. From quick fixes to major renovations, connect with elite professionals instantly.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/register"
              className="group bg-gradient-to-r from-primary-600 to-primary-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-105 transition-all duration-300 flex items-center"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/providers"
              className="px-8 py-4 rounded-xl font-bold text-white glass-card hover:bg-white/10 transition-all duration-300"
            >
              Browse Services
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Elite Services</h2>
            <p className="text-dark-400">Curated for excellence, delivered with precision.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.name}
                  to="/providers"
                  className="group glass-card p-8 rounded-2xl hover:border-primary-500/50 transition-all duration-300 hover:transform hover:-translate-y-1"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} p-0.5 mb-6 group-hover:shadow-lg group-hover:shadow-primary-500/20 transition-all`}>
                    <div className="w-full h-full bg-dark-900 rounded-[10px] flex items-center justify-center">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary-400 transition-colors">{service.name}</h3>
                  <p className="text-sm text-dark-400">{service.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold font-heading mb-6">
                Why Top Tier Clients <br />
                <span className="text-gradient">Choose Us</span>
              </h2>
              <p className="text-dark-300 mb-8 text-lg">
                We don't just connect you; we ensure a seamless, premium experience from start to finish.
              </p>

              <div className="space-y-6">
                {features.map((feature) => (
                  <div key={feature.title} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="h-6 w-6 text-primary-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1">{feature.title}</h3>
                      <p className="text-dark-400 text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl blur-2xl opacity-20 transform rotate-3"></div>
              <div className="glass-card p-8 rounded-3xl relative border-none bg-dark-800">
                <div className="grid gap-6">
                  {/* Mock UI Elements for Visual Interest */}
                  <div className="flex items-center gap-4 p-4 bg-dark-900/50 rounded-xl">
                    <div className="h-10 w-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400">
                      <Star className="h-5 w-5 fill-current" />
                    </div>
                    <div>
                      <div className="h-2 w-24 bg-dark-700 rounded mb-2"></div>
                      <div className="h-2 w-16 bg-dark-700 rounded"></div>
                    </div>
                    <div className="ml-auto text-primary-400 font-bold">5.0</div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-dark-900/50 rounded-xl opacity-75">
                    <div className="h-10 w-10 rounded-full bg-secondary-500/20 flex items-center justify-center text-secondary-400">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="h-2 w-32 bg-dark-700 rounded mb-2"></div>
                      <div className="h-2 w-20 bg-dark-700 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-3xl blur-xl opacity-30"></div>
          <div className="relative glass-card rounded-3xl p-12 text-center border-primary-500/20 overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-1/2 -translate-y-1/2">
              <Zap className="h-64 w-64 text-white" />
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-heading">Ready to Upgrade?</h2>
            <p className="text-xl text-dark-200 mb-10 max-w-2xl mx-auto">
              Join the exclusive network of top-rated professionals and discerning clients.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/register"
                className="bg-white text-dark-900 px-10 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Chatbot />
    </div>
  );
};

export default HomePage;

