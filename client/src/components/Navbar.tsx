import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import {
  Wrench,
  LogOut,
  User as UserIcon,
  Home,
  Settings,
  ShieldCheck,
  ShieldAlert,
  UserX,
  Trash2,
  Key
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Wrench className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">Service Connect</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/providers"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Find Providers
            </Link>

            {user ? (
              <>
                <Link
                  to={user.role === 'service_provider' ? '/provider/dashboard' : '/dashboard'}
                  className="hidden md:flex items-center space-x-1 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 focus:outline-none group p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    {user.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt="Profile"
                        className="h-8 w-8 rounded-full object-cover border-2 border-primary-500"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center border-2 border-primary-500">
                        <UserIcon className="h-5 w-5 text-primary-600" />
                      </div>
                    )}
                    <span className="hidden sm:block text-sm font-medium text-gray-700 group-hover:text-primary-600 transition-colors">
                      {user.firstName}
                    </span>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl py-2 border border-gray-100 ring-1 ring-black ring-opacity-5 animate-in fade-in zoom-in duration-200 origin-top-right">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-50">
                        <div className="flex items-center space-x-3">
                          {user.profilePhoto ? (
                            <img
                              src={user.profilePhoto}
                              alt="Profile"
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-primary-50 flex items-center justify-center">
                              <UserIcon className="h-6 w-6 text-primary-600" />
                            </div>
                          )}
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold text-gray-900 truncate">
                              {user.firstName} {user.lastName}
                            </span>
                            <span className="text-xs text-gray-500 truncate">{user.email}</span>
                            <span className="text-xs text-gray-500 truncate">{user.phone}</span>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center space-x-1">
                          {user.isVerified ? (
                            <div className="flex items-center text-green-600 text-[10px] font-bold uppercase tracking-wider bg-green-50 px-2 py-0.5 rounded-full">
                              <ShieldCheck className="h-3 w-3 mr-1" />
                              Verified
                            </div>
                          ) : (
                            <div className="flex items-center text-amber-600 text-[10px] font-bold uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded-full">
                              <ShieldAlert className="h-3 w-3 mr-1" />
                              Pending Verification
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="py-1">
                        {user.role === 'admin' && (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 font-bold transition-colors"
                          >
                            <ShieldCheck className="h-4 w-4 mr-3 text-indigo-500" />
                            Admin Dashboard
                          </Link>
                        )}
                        <Link
                          to="/profile"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                        >
                          <Settings className="h-4 w-4 mr-3 text-gray-400 group-hover:text-primary-500" />
                          Update Profile
                        </Link>
                        <Link
                          to="/change-password"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                        >
                          <Key className="h-4 w-4 mr-3 text-gray-400 group-hover:text-primary-500" />
                          Change Password
                        </Link>
                      </div>

                      <div className="border-t border-gray-50 py-1">
                        <button
                          onClick={async () => {
                            if (window.confirm('Are you sure you want to deactivate your account?')) {
                              try {
                                const response = await fetch('http://localhost:5000/api/auth/deactivate', {
                                  method: 'POST',
                                  headers: {
                                    'Authorization': `Bearer ${useAuthStore.getState().token}`,
                                  }
                                });
                                if (response.ok) {
                                  toast.success('Account deactivated');
                                  handleLogout();
                                } else {
                                  const errorData = await response.json();
                                  toast.error(errorData.message || 'Failed to deactivate account');
                                }
                              } catch (error) {
                                toast.error('Failed to deactivate');
                              }
                            }
                            setIsDropdownOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 transition-colors"
                        >
                          <UserX className="h-4 w-4 mr-3" />
                          Deactivate Account
                        </button>
                        <button
                          onClick={async () => {
                            if (window.confirm('CRITICAL: This will permanently delete your account details. Proceed?')) {
                              try {
                                const response = await fetch('http://localhost:5000/api/auth/account', {
                                  method: 'DELETE',
                                  headers: {
                                    'Authorization': `Bearer ${useAuthStore.getState().token}`,
                                  }
                                });
                                if (response.ok) {
                                  toast.success('Account deleted');
                                  handleLogout();
                                } else {
                                  const errorData = await response.json();
                                  toast.error(errorData.message || 'Failed to delete account');
                                }
                              } catch (error) {
                                toast.error('Failed to delete');
                              }
                            }
                            setIsDropdownOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-4 w-4 mr-3" />
                          Delete Account
                        </button>
                      </div>

                      <div className="border-t border-gray-50 mt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors font-medium"
                        >
                          <LogOut className="h-4 w-4 mr-3 text-gray-400" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-all hover:shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

