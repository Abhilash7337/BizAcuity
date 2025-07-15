import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PublicNavbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleCreateWall = () => {
    navigate('/register');
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold font-poppins text-primary-dark hover:text-primary transition-colors duration-300">
              Picture Wall Designer
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="#about" 
              className="text-primary-dark hover:text-primary font-medium font-inter transition-colors duration-300"
            >
              About Us
            </Link>
            <Link 
              to="#faq" 
              className="text-primary-dark hover:text-primary font-medium font-inter transition-colors duration-300"
            >
              FAQ
            </Link>
            <Link 
              to="#blog" 
              className="text-primary-dark hover:text-primary font-medium font-inter transition-colors duration-300"
            >
              Blog
            </Link>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handleLogin}
              className="text-primary-dark hover:text-primary font-medium font-inter px-4 py-2 rounded-lg transition-all duration-300 hover:bg-primary-light"
            >
              Log in
            </button>
            <button
              onClick={handleCreateWall}
              className="bg-primary-dark hover:bg-primary text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Create Wall
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-primary-dark hover:text-primary focus:outline-none focus:text-primary transition-colors duration-300"
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
              <Link
                to="#about"
                className="block px-3 py-2 text-primary-dark hover:text-primary font-medium font-inter transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="#faq"
                className="block px-3 py-2 text-primary-dark hover:text-primary font-medium font-inter transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link
                to="#blog"
                className="block px-3 py-2 text-primary-dark hover:text-primary font-medium font-inter transition-colors duration-300"
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
                  className="block w-full text-left px-3 py-2 text-primary-dark hover:text-primary font-medium font-inter transition-colors duration-300"
                >
                  Log in
                </button>
                <button
                  onClick={() => {
                    handleCreateWall();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full mt-2 bg-primary-dark hover:bg-primary text-white font-semibold px-3 py-2 rounded-lg transition-all duration-300"
                >
                  Create Wall
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default PublicNavbar;
