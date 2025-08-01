import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, Home, Settings, Info, HelpCircle, BookOpen } from 'lucide-react';
import { UserContext } from '../../App';
import { isAuthenticated } from '../../utils/auth';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { registeredUser, handleLogout } = useContext(UserContext);
  const isLoggedIn = isAuthenticated();
  const isAdmin = registeredUser && (registeredUser.userType === 'admin' || registeredUser.email === 'abhilashpodisetty@gmail.com');
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header
      className={`sticky top-0 left-0 right-0 z-50 border-b border-orange-500/20 transition-all duration-500 bg-slate-900/95 backdrop-blur-md shadow-lg`}
      style={{ minHeight: '84px' }}
    >
      <div className="flex items-center justify-between px-6 md:px-8 py-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link
            to={isLoggedIn ? "/" : "/"}
            className="flex items-center gap-3 group"
          >
            <img src="/mialtar-logo.png" alt="MIALTAR Logo" className="h-16 w-16 rounded-lg select-none group-hover:scale-105 transition-transform duration-200" />
            <span className="text-3xl font-bold font-sans text-orange-400 tracking-wide group-hover:text-orange-300 transition-colors">MIALTAR</span>
          </Link>
        </div>
        {/* Hamburger for mobile */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded-lg border border-orange-400/30 bg-slate-800/50 text-orange-400 hover:bg-slate-700/50 hover:text-orange-300 transition-all"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><rect y="5" width="24" height="2" rx="1" fill="currentColor"/><rect y="11" width="24" height="2" rx="1" fill="currentColor"/><rect y="17" width="24" height="2" rx="1" fill="currentColor"/></svg>
        </button>
        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {isLoggedIn ? (
            <>
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`flex items-center gap-2 font-bold text-2xl transition-colors text-orange-400 hover:text-orange-300 ${location.pathname === '/admin' ? 'underline underline-offset-4 text-orange-300 font-bold' : ''}`}
                >
                  <Home className="w-5 h-5" /> Admin Dashboard
                </Link>
              )}
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 font-medium text-2xl transition-colors text-orange-400 hover:text-orange-300 ${location.pathname === '/dashboard' ? 'underline underline-offset-4 text-orange-300 font-bold' : ''}`}
              >
                <Home className="w-5 h-5" /> Dashboard
              </Link>
              <Link
                to="/wall"
                className={`flex items-center gap-2 font-medium text-2xl transition-colors text-orange-400 hover:text-orange-300 ${location.pathname === '/wall' ? 'underline underline-offset-4 text-orange-300 font-bold' : ''}`}
              >
                <Settings className="w-5 h-5" /> Wall Designer
              </Link>
              <Link
                to="/user"
                className={`flex items-center gap-2 font-medium text-2xl transition-colors text-orange-400 hover:text-orange-300 ${location.pathname === '/user' ? 'underline underline-offset-4 text-orange-300 font-bold' : ''}`}
              >
                <User className="w-5 h-5" /> Profile
              </Link>
            </>
          ) : (
            <>
              <Link
                to="#about"
                className={`flex items-center gap-2 font-medium text-2xl transition-colors text-slate-300 hover:text-white ${location.hash === '#about' ? 'underline underline-offset-4 text-white font-bold' : ''}`}
              >
                <Info className="w-5 h-5" /> About Us
              </Link>
              <Link
                to="#faq"
                className={`flex items-center gap-2 font-medium text-2xl transition-colors text-slate-300 hover:text-white ${location.hash === '#faq' ? 'underline underline-offset-4 text-white font-bold' : ''}`}
              >
                <HelpCircle className="w-5 h-5" /> FAQ
              </Link>
              <Link
                to="#blog"
                className={`flex items-center gap-2 font-medium text-2xl transition-colors text-slate-300 hover:text-white ${location.hash === '#blog' ? 'underline underline-offset-4 text-white font-bold' : ''}`}
              >
                <BookOpen className="w-5 h-5" /> Blog
              </Link>
            </>
          )}
        </nav>
        {/* Right Side: Auth Buttons (Desktop only) */}
        <div className="hidden md:flex items-center gap-4">
          {!isLoggedIn ? (
            <button
              onClick={handleCreateWall}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl text-lg shadow-lg border border-orange-500/20 transition-all duration-300 transform hover:scale-105"
            >
              Create Wall
            </button>
          ) : (
            <button
              onClick={onLogout}
              className="bg-slate-800 text-orange-400 font-bold py-3 px-6 rounded-xl text-lg shadow-lg border border-orange-500/30 hover:bg-slate-700 hover:text-orange-300 transition-all duration-300 transform hover:scale-105"
            >
              Logout
            </button>
          )}
        </div>
      </div>
      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 ${isMobileMenuOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      {/* Mobile Menu Drawer */}
      <nav
        className={`fixed top-0 right-0 z-50 h-full w-64 bg-slate-800 shadow-lg border-l border-orange-500/20 transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden flex flex-col items-center pt-24 px-6 gap-6`}
        style={{ minHeight: '100vh' }}
      >
        {isLoggedIn ? (
          <>
            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center justify-center gap-2 font-bold text-2xl text-orange-400 hover:text-orange-300 py-3 px-2 rounded-lg w-full text-center ${location.pathname === '/admin' ? 'bg-slate-700 text-orange-300 font-bold' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="w-5 h-5" /> Admin Dashboard
              </Link>
            )}
            <Link
              to="/dashboard"
              className={`flex items-center justify-center gap-2 font-medium text-2xl text-orange-400 hover:text-orange-300 py-3 px-2 rounded-lg w-full text-center ${location.pathname === '/dashboard' ? 'bg-slate-700 text-orange-300 font-bold' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home className="w-5 h-5" /> Dashboard
            </Link>
            <Link
              to="/wall"
              className={`flex items-center justify-center gap-2 font-medium text-2xl text-orange-400 hover:text-orange-300 py-3 px-2 rounded-lg w-full text-center ${location.pathname === '/wall' ? 'bg-slate-700 text-orange-300 font-bold' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Settings className="w-5 h-5" /> Wall Designer
            </Link>
            <Link
              to="/user"
              className={`flex items-center justify-center gap-2 font-medium text-2xl text-orange-400 hover:text-orange-300 py-3 px-2 rounded-lg w-full text-center ${location.pathname === '/user' ? 'bg-slate-700 text-orange-300 font-bold' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User className="w-5 h-5" /> Profile
            </Link>
            <button
              onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
              className="w-full bg-slate-700 text-orange-400 font-bold py-3 px-2 rounded-xl text-lg shadow-lg border border-orange-500/30 hover:bg-slate-600 hover:text-orange-300 transition-all duration-300 mt-4"
              style={{ textAlign: 'center' }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="#about"
              className={`flex items-center justify-center gap-2 font-medium text-2xl text-slate-300 hover:text-white py-3 px-2 rounded-lg w-full text-center ${location.hash === '#about' ? 'bg-slate-700 text-white font-bold' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Info className="w-5 h-5" /> About Us
            </Link>
            <Link
              to="#faq"
              className={`flex items-center justify-center gap-2 font-medium text-2xl text-slate-300 hover:text-white py-3 px-2 rounded-lg w-full text-center ${location.hash === '#faq' ? 'bg-slate-700 text-white font-bold' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <HelpCircle className="w-5 h-5" /> FAQ
            </Link>
            <Link
              to="#blog"
              className={`flex items-center justify-center gap-2 font-medium text-2xl text-slate-300 hover:text-white py-3 px-2 rounded-lg w-full text-center ${location.hash === '#blog' ? 'bg-slate-700 text-white font-bold' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <BookOpen className="w-5 h-5" /> Blog
            </Link>
            <button
              onClick={() => { handleCreateWall(); setIsMobileMenuOpen(false); }}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-2 rounded-xl text-lg shadow-lg border border-orange-500/20 transition-all duration-300 mt-4"
              style={{ textAlign: 'center' }}
            >
              Create Wall
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header; 