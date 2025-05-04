import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from './AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [navbarBg, setNavbarBg] = useState<boolean>(true);
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Update navbar background based on route and scroll
  useEffect(() => {
    const handleScroll = () => {
      const shouldBeOpaque = 
        window.scrollY > 50 || 
        ['/my-bookings', '/login', '/register', '/book', '/admin'].includes(location.pathname);
      setNavbarBg(shouldBeOpaque);
    };

    handleScroll(); // Initial check
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleBookingClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    location.pathname === '/' ? scrollToSection('book') : navigate('/#book');
  };

  // Loading state (show minimal navbar)
  if (isLoading) {
    return (
      <nav className="fixed w-full z-50 bg-gray-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="text-white text-2xl font-bold">Door Step Shine</div>
            <div className="animate-pulse bg-gray-700 h-8 w-24 rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  // Nav items that are always visible
  const commonNavItems = (
    <button 
      onClick={handleBookingClick}
      className="text-gray-800 bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg shadow-md transition duration-300 hover:scale-105"
    >
      Book Now
    </button>
  );

  // Admin dashboard link (only visible to admins)
  const adminDashboardLink = user?.isAdmin && (
    <button 
      onClick={() => handleNavigation('/admin/dashboard')}
      className="text-gray-300 hover:text-white hover:scale-105 transition duration-300"
    >
      Admin Dashboard
    </button>
  );

  // Nav items for authenticated users
  const authNavItems = (
    <div className="flex items-center space-x-4 ml-4">
      <div className="text-gray-300">
        Hi, <span className="font-medium">{user?.name.split(' ')[0]}</span>
      </div>
      {adminDashboardLink}
      <button 
        onClick={() => handleNavigation('/my-bookings')}
        className="text-gray-300 hover:text-white hover:scale-105 transition duration-300"
      >
        My Bookings
      </button>
      <button
        onClick={() => {
          logout();
          handleNavigation('/');
        }}
        className="text-gray-300 hover:text-white hover:scale-105 transition duration-300"
      >
        Logout
      </button>
    </div>
  );

  // Nav items for unauthenticated users
  const unauthNavItems = (
    <div className="flex items-center space-x-4 ml-4">
      <button
        onClick={() => handleNavigation('/login')}
        className="text-gray-300 hover:text-white hover:scale-105 transition duration-300"
      >
        Login
      </button>
      <button
        onClick={() => handleNavigation('/register')}
        className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md transition duration-300 hover:scale-105"
      >
        Register
      </button>
    </div>
  );

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${navbarBg ? 'bg-gray-900 shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="text-white text-2xl font-bold cursor-pointer hover:text-yellow-400 transition duration-300"
            onClick={() => navigate('/')}
          >
            Door Step Shine
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4 items-center">
            {location.pathname === '/' && (
              <>
                <button 
                  onClick={() => scrollToSection('hero')} 
                  className="text-gray-300 hover:text-white hover:scale-105 transition duration-300"
                >
                  Home
                </button>
                <button 
                  onClick={() => scrollToSection('services')} 
                  className="text-gray-300 hover:text-white hover:scale-105 transition duration-300"
                >
                  Services
                </button>
                <button 
                  onClick={() => scrollToSection('how-it-works')} 
                  className="text-gray-300 hover:text-white hover:scale-105 transition duration-300"
                >
                  How It Works
                </button>
                <button 
                  onClick={() => scrollToSection('testimonials')} 
                  className="text-gray-300 hover:text-white hover:scale-105 transition duration-300"
                >
                  Testimonials
                </button>
              </>
            )}
            
            {commonNavItems}
            {isAuthenticated ? authNavItems : unauthNavItems}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu} 
              className="text-gray-300 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 transition-all duration-300">
          {location.pathname === '/' && (
            <>
              <button 
                onClick={() => scrollToSection('hero')} 
                className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 w-full text-left transition duration-300"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('services')} 
                className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 w-full text-left transition duration-300"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')} 
                className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 w-full text-left transition duration-300"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')} 
                className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 w-full text-left transition duration-300"
              >
                Testimonials
              </button>
            </>
          )}
          
          <button
            onClick={handleBookingClick}
            className="block px-4 py-3 text-gray-800 bg-yellow-500 hover:bg-yellow-600 w-full text-left transition duration-300"
          >
            Book Now
          </button>

          {isAuthenticated ? (
            <>
              <div className="block px-4 py-3 text-gray-300 w-full text-left border-t border-gray-700">
                Hi, <span className="font-medium">{user?.name.split(' ')[0]}</span>
              </div>
              {user?.isAdmin && (
                <button 
                  onClick={() => handleNavigation('/admin/dashboard')} 
                  className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 w-full text-left transition duration-300"
                >
                  Admin Dashboard
                </button>
              )}
              <button 
                onClick={() => handleNavigation('/my-bookings')} 
                className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 w-full text-left transition duration-300"
              >
                My Bookings
              </button>
              <button 
                onClick={() => {
                  logout();
                  handleNavigation('/');
                }} 
                className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 w-full text-left transition duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => handleNavigation('/login')} 
                className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 w-full text-left transition duration-300 border-t border-gray-700"
              >
                Login
              </button>
              <button 
                onClick={() => handleNavigation('/register')} 
                className="block px-4 py-3 text-white bg-blue-600 hover:bg-blue-700 w-full text-left transition duration-300"
              >
                Register
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;