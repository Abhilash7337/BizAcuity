import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../App';
import { isAuthenticated } from '../../utils/auth';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { registeredUser, handleLogout } = useContext(UserContext);
  const isLoggedIn = isAuthenticated();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const onLogout = () => {
    handleLogout();
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleCreateWall = () => {
    if (isLoggedIn) {
      navigate('/wall');
    } else {
      navigate('/register');
    }
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-lg px-0">
      <div className="w-full">

        <div className="flex items-center py-4 w-full">
          {/* Navigation Links - Far Left */}
          <div className="hidden md:flex items-center space-x-8">
            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard" 
                  className={`text-orange-700 hover:text-orange-600 font-medium font-inter text-xl transition-colors duration-300 ${location.pathname === '/dashboard' ? 'text-orange-600 font-semibold' : ''}`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/wall" 
                  className={`text-orange-700 hover:text-orange-600 font-medium font-inter text-xl transition-colors duration-300 ${location.pathname === '/wall' ? 'text-orange-600 font-semibold' : ''}`}
                >
                  Wall Designer
                </Link>
                <Link
                  to="/user" 
                  className={`text-orange-700 hover:text-orange-600 font-medium font-inter text-xl transition-colors duration-300 ${location.pathname === '/user' ? 'text-orange-600 font-semibold' : ''}`}
                >
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/" 
                  className={`text-orange-700 hover:text-orange-600 font-medium font-inter text-xl transition-colors duration-300 ${location.pathname === '/' || location.pathname === '/home' ? 'text-orange-600 font-semibold' : ''}`}
                >
                  Home
                </Link>
                <Link 
                  to="#about" 
                  className="text-orange-700 hover:text-orange-600 font-medium font-inter transition-colors duration-300"
                >
                  About Us
                </Link>
                <Link 
                  to="#faq" 
                  className="text-orange-700 hover:text-orange-600 font-medium font-inter transition-colors duration-300"
                >
                  FAQ
                </Link>
                <Link 
                  to="#blog" 
                  className="text-orange-700 hover:text-orange-600 font-medium font-inter transition-colors duration-300"
                >
                  Blog
                </Link>
              </>
            )}
          </div>

          {/* Logo - Centered */}
          <div className="flex items-center flex-shrink-0 mx-auto">
            <Link to="/home" className="flex items-center group">
              <img
                src="/mialtar-logo.png"
                alt="MIALTAR Logo"
                className="h-16 w-auto mr-4 select-none transition-transform duration-200 group-hover:scale-110"
                style={{userSelect:'none'}}
              />
              <span className="text-4xl font-bold font-poppins text-orange-700 group-hover:text-orange-600 transition-colors duration-300 tracking-wide" style={{letterSpacing:'0.04em'}}>MIALTAR</span>
            </Link>
          </div>

          {/* Desktop Action Buttons - Far Right */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {/* Admin Button - Only show for admin users */}
                {(registeredUser?.userType === 'admin' || registeredUser?.email === 'admin@gmail.com') && (
                  <Link
                    to="/admin"
                    className={`bg-red-600 hover:bg-red-700 text-white font-medium font-inter px-4 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${
                      location.pathname === '/admin' ? 'bg-red-700 shadow-lg' : ''
                    }`}
                  >
                    <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Admin
                  </Link>
                )}
                <span className="text-orange-700 font-medium font-inter">
                  Hi, {registeredUser?.name}
                </span>
                <button
                  onClick={onLogout}
                  className="text-orange-700 hover:text-orange-600 font-medium font-inter px-4 py-2 rounded-lg transition-all duration-300 hover:bg-orange-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className="text-orange-700 hover:text-orange-600 font-medium font-inter px-4 py-2 rounded-lg transition-all duration-300 hover:bg-orange-50"
                >
                  Log in
                </button>
                <button
                  onClick={handleCreateWall}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Create Wall
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-orange-700 hover:text-orange-600 focus:outline-none focus:text-orange-600 transition-colors duration-300"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`block px-3 py-2 text-orange-700 hover:text-orange-600 font-medium font-inter transition-colors duration-300 ${location.pathname === '/dashboard' ? 'text-orange-600 font-semibold' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/wall"
                    className={`block px-3 py-2 text-orange-700 hover:text-orange-600 font-medium font-inter transition-colors duration-300 ${location.pathname === '/wall' ? 'text-orange-600 font-semibold' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Wall Designer
                  </Link>
                  <Link
                    to="/user"
                    className={`block px-3 py-2 text-orange-700 hover:text-orange-600 font-medium font-inter transition-colors duration-300 ${location.pathname === '/user' ? 'text-orange-600 font-semibold' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  {/* Admin Link for Mobile - Only show for admin users */}
                  {(registeredUser?.userType === 'admin' || registeredUser?.email === 'admin@gmail.com') && (
                    <Link
                      to="/admin"
                      className={`block px-3 py-2 text-red-600 hover:text-red-700 font-medium font-inter transition-colors duration-300 ${location.pathname === '/admin' ? 'text-red-700 font-semibold' : ''}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Admin Panel
                    </Link>
                  )}
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="px-3 py-2 text-orange-700 font-medium font-inter">
                      Hi, {registeredUser?.name}
                    </div>
                    <button
                      onClick={() => {
                        onLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-orange-700 hover:text-orange-600 font-medium font-inter transition-colors duration-300"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/"
                    className={`block px-3 py-2 text-orange-700 hover:text-orange-600 font-medium font-inter transition-colors duration-300 ${location.pathname === '/' || location.pathname === '/home' ? 'text-orange-600 font-semibold' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    to="#about"
                    className="block px-3 py-2 text-orange-700 hover:text-orange-600 font-medium font-inter transition-colors duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About Us
                  </Link>
                  <Link
                    to="#faq"
                    className="block px-3 py-2 text-orange-700 hover:text-orange-600 font-medium font-inter transition-colors duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    FAQ
                  </Link>
                  <Link
                    to="#blog"
                    className="block px-3 py-2 text-orange-700 hover:text-orange-600 font-medium font-inter transition-colors duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Blog
                  </Link>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <button
                      onClick={() => {
                        handleLogin();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-orange-700 hover:text-orange-600 font-medium font-inter transition-colors duration-300"
                    >
                      Log in
                    </button>
                    <button
                      onClick={() => {
                        handleCreateWall();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full mt-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-3 py-2 rounded-lg transition-all duration-300"
                    >
                      Create Wall
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header; 