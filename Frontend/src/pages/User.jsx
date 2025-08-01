import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Footer } from '../components/layout';
import { UserContext } from '../App';
import { authFetch } from '../utils/auth';
import { ChangePasswordForm, UserProfileForm } from '../components/user';

const User = () => {
  const navigate = useNavigate();
  const { registeredUser } = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [userStats, setUserStats] = useState({
    designs: 0,
    photos: 0,
    designsThisMonth: 0
  });
  // State for profile photo modal


  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  const fetchUserStats = async () => {
    try {
      // Fetch user drafts to get designs count
      const draftsResponse = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/drafts`);
      if (draftsResponse.ok) {
        const drafts = await draftsResponse.json();
        
        // Count total photos from all drafts
        let totalPhotos = 0;
        drafts.forEach(draft => {
          if (draft.wallData && draft.wallData.images && Array.isArray(draft.wallData.images)) {
            totalPhotos += draft.wallData.images.length;
          }
        });
        
        setUserStats(prev => ({
          ...prev,
          designs: drafts.length,
          photos: totalPhotos,
          designsThisMonth: drafts.filter(draft => {
            const draftDate = new Date(draft.createdAt);
            const currentDate = new Date();
            return draftDate.getMonth() === currentDate.getMonth() && 
                   draftDate.getFullYear() === currentDate.getFullYear();
          }).length
        }));
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleViewDesigns = () => {
    navigate('/dashboard');
  };

  useEffect(() => {
    // Extra protection - redirect to login if not authenticated
    if (!registeredUser?.isLoggedIn) {
      navigate('/login', { replace: true });
      return;
    }

    // Set visibility animation
    setIsVisible(true);

    if (registeredUser && registeredUser.isLoggedIn) {
      setLoading(true);
      authFetch(`${import.meta.env.VITE_API_BASE_URL}/user/profile`)
        .then(res => res.json())
        .then(data => {
          setUser(data);
          setLoading(false);
          // Fetch user stats after getting user data
          fetchUserStats();
        })
        .catch(err => {
          setError('Failed to fetch user info');
          setLoading(false);
        });
    }
  }, [registeredUser, navigate]);



  // Don't render anything until we verify authentication
  if (!registeredUser?.isLoggedIn) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Header />
        
        <div className="flex pt-20">
          <div className="w-96 bg-slate-800 shadow-xl border-r border-orange-500/50 min-h-screen">
            <div className="p-8">
              <div className="h-40 bg-slate-700/50 rounded-2xl animate-pulse mb-8"></div>
              <div className="text-center">
                <div className="w-24 h-24 bg-slate-700/50 rounded-full mx-auto mb-6 animate-pulse"></div>
                <div className="h-5 bg-slate-700/50 rounded-xl w-3/4 mx-auto mb-3 animate-pulse"></div>
                <div className="h-4 bg-slate-700/50 rounded-xl w-1/2 mx-auto animate-pulse"></div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-8">
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-orange-400/30 border-t-orange-500 mx-auto"></div>
              <div className="mt-6 text-orange-400 font-bold text-2xl">Loading your profile...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Header />
        
        <div className="flex pt-20">
          <div className="w-96 bg-slate-800 shadow-xl border-r border-orange-500/50 min-h-screen">
            <div className="p-8">
              <div className="h-40 bg-red-900/20 rounded-2xl mb-8"></div>
              <div className="text-center">
                <div className="w-24 h-24 bg-red-900/20 rounded-full mx-auto mb-6"></div>
                <div className="text-red-400 text-sm font-medium">Error loading profile</div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-8">
            <div className="text-center py-20">
              <div className="bg-red-900/20 border border-red-500/50 rounded-2xl p-10 max-w-lg mx-auto shadow-xl">
                <svg className="mx-auto h-16 w-16 text-red-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-400 font-semibold text-lg">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      {/* Custom animations for enhanced flowing SVG lines */}
      <style>{`
        /* CSS Custom Properties for Modern Theming */
        :root {
          --spacing-xs: 0.5rem;
          --spacing-sm: 1rem;
          --spacing-md: 1.5rem;
          --spacing-lg: 2rem;
          --spacing-xl: 3rem;
          --radius-sm: 0.75rem;
          --radius-md: 1rem;
          --radius-lg: 1.5rem;
          --radius-xl: 2rem;
          --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
          --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
          --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
        }

        /* Modern Animation Keyframes */
        @keyframes fluidFlow {
          0%, 100% { 
            d: path("M0,15 Q50,35 100,15");
            opacity: 0.4;
          }
          25% { 
            d: path("M0,10 Q50,45 100,20");
            opacity: 0.7;
          }
          50% { 
            d: path("M0,20 Q50,25 100,10");
            opacity: 0.8;
          }
          75% { 
            d: path("M0,25 Q50,40 100,25");
            opacity: 0.6;
          }
        }

        @keyframes streamFloatIcon {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.08); }
        }

        @keyframes cardSlideUp {
          from { 
            opacity: 0; 
            transform: translateY(40px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }

        @keyframes avatarScaleIn {
          from { 
            opacity: 0; 
            transform: scale(0.8) rotate(-5deg); 
          }
          to { 
            opacity: 1; 
            transform: scale(1) rotate(0deg); 
          }
        }

        @keyframes staggerFadeIn {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        @keyframes counterIncrement {
          from { 
            transform: scale(1.2); 
            opacity: 0.7; 
          }
          to { 
            transform: scale(1); 
            opacity: 1; 
          }
        }

        @keyframes cardHoverLift {
          from { 
            transform: translateY(0) scale(1); 
            box-shadow: var(--shadow-lg); 
          }
          to { 
            transform: translateY(-8px) scale(1.02); 
            box-shadow: var(--shadow-xl); 
          }
        }

        @keyframes buttonPress {
          0% { transform: scale(1); }
          50% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }

        @keyframes progressBarFill {
          from { width: 0%; }
          to { width: var(--progress-width); }
        }

        @keyframes rippleEffect {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }

        @keyframes iconBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        @keyframes glowPulse {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(249, 115, 22, 0.3);
          }
          50% { 
            box-shadow: 0 0 40px rgba(249, 115, 22, 0.5);
          }
        }

        /* Modern Card Classes - Fixed for Dark Theme */
        .modern-card {
          background: rgba(30, 41, 59, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(249, 115, 22, 0.2);
          border-radius: var(--radius-xl);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2);
          transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
          will-change: transform, box-shadow;
          padding: 1.5rem;
        }

        .modern-card:hover {
          animation: cardHoverLift 0.3s ease forwards;
          border-color: rgba(249, 115, 22, 0.3);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 30px rgba(249, 115, 22, 0.1);
        }

        .modern-button {
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
          transform-origin: center;
          border: 1px solid rgba(249, 115, 22, 0.2);
        }

        .modern-button:hover {
          border-color: rgba(249, 115, 22, 0.4);
          box-shadow: 0 0 20px rgba(249, 115, 22, 0.2);
        }

        .modern-button:active {
          animation: buttonPress 0.15s ease;
        }

        .modern-button::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transition: width 0.6s, height 0.6s, top 0.6s, left 0.6s;
          transform: translate(-50%, -50%);
          z-index: 0;
        }

        .modern-button:active::before {
          width: 300px;
          height: 300px;
          animation: rippleEffect 0.6s ease-out;
        }

        .modern-button > * {
          position: relative;
          z-index: 1;
        }

        .stat-counter {
          animation: counterIncrement 0.6s ease-out;
        }

        .progress-bar {
          animation: progressBarFill 1.5s ease-out 0.5s both;
        }

        .icon-bounce:hover {
          animation: iconBounce 0.6s ease infinite;
        }

        .glow-effect {
          animation: glowPulse 2s ease-in-out infinite;
        }

        /* Enhanced Responsive Grid System - Dark Theme */
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-lg);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: var(--spacing-md);
        }

        .responsive-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--spacing-md);
        }

        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--spacing-md);
        }

        /* Animation Delays for Staggered Effects */
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
        .stagger-5 { animation-delay: 0.5s; }

        /* Reduced Motion Support */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    <div className="min-h-screen bg-slate-900 overflow-hidden">
      {/* Subtle Background Animation Layer */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Main background container */}
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Abstract morphing shapes */}
          <div 
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-orange-600/30 opacity-15 blur-xl"
            style={{animation: 'abstractMorph 45s ease-in-out infinite'}}
          ></div>
          <div 
            className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-gradient-to-br from-orange-400/20 to-orange-500/30 opacity-12 blur-xl"
            style={{animation: 'abstractMorph 60s ease-in-out infinite reverse', animationDelay: '-20s'}}
          ></div>
          <div 
            className="absolute top-1/2 left-1/3 w-20 h-20 bg-gradient-to-br from-orange-300/15 to-orange-400/25 opacity-10 blur-lg"
            style={{animation: 'abstractMorph 35s ease-in-out infinite', animationDelay: '-15s'}}
          ></div>
          {/* Enhanced Flowing lines effect with SVG - Multiple layers for fluid motion */}
          <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Primary flowing lines */}
            <path 
              d="M0,50 Q25,25 50,50 T100,50" 
              stroke="url(#flowGradient)" 
              strokeWidth="0.5" 
              fill="none"
              style={{animation: 'backgroundFlow 40s ease-in-out infinite'}}
            />
            <path 
              d="M0,30 Q25,5 50,30 T100,30" 
              stroke="url(#flowGradient)" 
              strokeWidth="0.3" 
              fill="none"
              style={{animation: 'backgroundFlow 50s ease-in-out infinite reverse', animationDelay: '-10s'}}
            />
            <path 
              d="M0,70 Q25,95 50,70 T100,70" 
              stroke="url(#flowGradient)" 
              strokeWidth="0.4" 
              fill="none"
              style={{animation: 'backgroundFlow 35s ease-in-out infinite', animationDelay: '-25s'}}
            />
            
            {/* Additional fluid motion lines */}
            <path 
              d="M0,15 Q50,35 100,15" 
              stroke="url(#flowGradient2)" 
              strokeWidth="0.25" 
              fill="none"
              style={{animation: 'fluidFlow 45s ease-in-out infinite', animationDelay: '-15s'}}
            />
            <path 
              d="M0,85 Q50,65 100,85" 
              stroke="url(#flowGradient2)" 
              strokeWidth="0.35" 
              fill="none"
              style={{animation: 'fluidFlow 55s ease-in-out infinite reverse', animationDelay: '-30s'}}
            />
            
            {/* Curved flowing streams */}
            <path 
              d="M-10,20 Q20,40 40,20 Q60,0 80,20 Q100,40 120,20" 
              stroke="url(#streamGradient)" 
              strokeWidth="0.2" 
              fill="none"
              style={{animation: 'streamFlow 60s linear infinite'}}
            />
            <path 
              d="M-10,80 Q20,60 40,80 Q60,100 80,80 Q100,60 120,80" 
              stroke="url(#streamGradient)" 
              strokeWidth="0.3" 
              fill="none"
              style={{animation: 'streamFlow 70s linear infinite reverse', animationDelay: '-20s'}}
            />
            
            {/* Vertical flowing lines */}
            <path 
              d="M25,0 Q35,25 25,50 Q15,75 25,100" 
              stroke="url(#verticalGradient)" 
              strokeWidth="0.15" 
              fill="none"
              style={{animation: 'verticalFlow 38s ease-in-out infinite'}}
            />
            <path 
              d="M75,0 Q65,25 75,50 Q85,75 75,100" 
              stroke="url(#verticalGradient)" 
              strokeWidth="0.2" 
              fill="none"
              style={{animation: 'verticalFlow 42s ease-in-out infinite reverse', animationDelay: '-12s'}}
            />
            
            <defs>
              <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(249, 115, 22, 0.6)" />
                <stop offset="50%" stopColor="rgba(251, 146, 60, 0.8)" />
                <stop offset="100%" stopColor="rgba(234, 88, 12, 0.6)" />
              </linearGradient>
              
              <linearGradient id="flowGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(234, 88, 12, 0.4)" />
                <stop offset="50%" stopColor="rgba(249, 115, 22, 0.7)" />
                <stop offset="100%" stopColor="rgba(251, 146, 60, 0.4)" />
              </linearGradient>
              
              <linearGradient id="streamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0.3)" />
                <stop offset="50%" stopColor="rgba(249, 115, 22, 0.5)" />
                <stop offset="100%" stopColor="rgba(255, 255, 255, 0.3)" />
              </linearGradient>
              
              <linearGradient id="verticalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(251, 146, 60, 0.2)" />
                <stop offset="50%" stopColor="rgba(234, 88, 12, 0.5)" />
                <stop offset="100%" stopColor="rgba(251, 146, 60, 0.2)" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Subtle gradient overlay that shifts */}
          <div 
            className="absolute inset-0 w-full h-full"
            style={{animation: 'gradientShift 80s ease-in-out infinite'}}
          ></div>
        </div>
      </div>
      <Header />
      {/* Main Container - Full Width */}
      <div className="pt-20 px-6 relative z-10">
        {/* Additional subtle background elements for content sections */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Floating Picture Frame Mockups with Animations */}
          <div className="absolute inset-0 opacity-10">
            {/* Top left frames */}
            <div className="absolute top-20 left-10 w-24 h-18 bg-white border-3 border-orange-600 rounded-lg shadow-md transform rotate-12 hover:scale-110 transition-all duration-500 animate-float" style={{animationDelay: '0s'}}>
              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
            </div>
            <div className="absolute top-32 left-32 w-16 h-22 bg-white border-3 border-orange-600 rounded-lg shadow-md transform -rotate-6 hover:rotate-0 transition-all duration-700 animate-drift" style={{animationDelay: '2s'}}>
              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
            </div>
            {/* Top right frames */}
            <div className="absolute top-40 right-20 w-22 h-16 bg-white border-3 border-orange-600 rounded-lg shadow-md transform rotate-6 hover:-rotate-3 transition-all duration-500 animate-float" style={{animationDelay: '1s'}}>
              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
            </div>
            <div className="absolute top-16 right-40 w-20 h-26 bg-white border-3 border-orange-600 rounded-lg shadow-md transform -rotate-12 hover:rotate-6 transition-all duration-700 animate-gentleFloat" style={{animationDelay: '3s'}}>
              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
            </div>
            {/* Bottom frames */}
            <div className="absolute bottom-40 left-20 w-28 h-20 bg-white border-3 border-orange-600 rounded-lg shadow-md transform rotate-3 hover:scale-105 transition-all duration-500 animate-drift" style={{animationDelay: '2s'}}>
              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
            </div>
            <div className="absolute bottom-20 right-16 w-20 h-26 bg-white border-3 border-orange-600 rounded-lg shadow-md transform -rotate-8 hover:rotate-4 transition-all duration-700 animate-float" style={{animationDelay: '1.5s'}}>
              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
            </div>
          </div>
        </div>
        <div className={`transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Modern Hero Section with Floating Profile */}
          <div className="relative mb-12">
            {/* Hero Background */}
            <div className="h-64 bg-gradient-to-br from-orange-500/90 via-orange-600/95 to-orange-700/90 rounded-3xl relative overflow-hidden" style={{animation: 'cardSlideUp 0.8s ease-out'}}>
              {/* Animated Background Elements */}
              <div className="absolute inset-0">
                <div className="absolute top-4 left-4 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-4 right-4 w-24 h-24 bg-white/15 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white/20 rounded-full blur-lg animate-pulse" style={{animationDelay: '2s'}}></div>
              </div>
              {/* Hero Content */}
              <div className="relative z-10 h-full flex items-center justify-between px-8">
                <div style={{animation: 'staggerFadeIn 0.8s ease-out 0.2s both'}}>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-2" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.3)'}}>
                    Welcome back, {user.name}
                  </h1>
                  <p className="text-white/90 text-lg md:text-xl" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.3)'}}>
                    Ready to create something amazing today?
                  </p>
                </div>
                {/* Action Buttons */}
                <div className="hidden md:flex space-x-4" style={{animation: 'staggerFadeIn 0.8s ease-out 0.4s both'}}>
                  <button 
                    onClick={() => navigate('/wall')}
                    className="modern-button bg-white text-orange-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-50 hover:scale-105 transition-all duration-300 shadow-xl"
                  >
                    <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Create Design
                  </button>
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="modern-button bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/30 hover:scale-105 transition-all duration-300 shadow-xl"
                  >
                    View Gallery
                  </button>
                </div>
              </div>
            </div>
          
          {/* Modern Statistics Dashboard */}
          <div className="mt-24 mb-12" style={{animation: 'staggerFadeIn 1s ease-out 0.8s both'}}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-orange-400 mb-2">Your Creative Journey</h2>
              <p className="text-slate-300 text-lg">Track your progress and achievements</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Total Designs */}
              <div 
                onClick={handleViewDesigns}
                className="modern-card cursor-pointer group hover:scale-105 transition-all duration-300"
                style={{animation: 'cardSlideUp 0.8s ease-out 1s both'}}
              >
                <div className="text-center p-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500/20 to-orange-600/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div className="stat-counter text-3xl font-bold text-orange-400 mb-1">{userStats.designs}</div>
                  <div className="text-slate-300 font-medium">Total Designs</div>
                </div>
              </div>
              
              {/* This Month */}
              <div 
                className="modern-card group hover:scale-105 transition-all duration-300"
                style={{animation: 'cardSlideUp 0.8s ease-out 1.1s both'}}
              >
                <div className="text-center p-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500/20 to-blue-600/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="stat-counter text-3xl font-bold text-blue-400 mb-1">{userStats.designsThisMonth}</div>
                  <div className="text-slate-300 font-medium">This Month</div>
                </div>
              </div>
              
              {/* Photos Used */}
              <div 
                className="modern-card group hover:scale-105 transition-all duration-300"
                style={{animation: 'cardSlideUp 0.8s ease-out 1.2s both'}}
              >
                <div className="text-center p-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500/20 to-green-600/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="stat-counter text-3xl font-bold text-green-400 mb-1">{userStats.photos}</div>
                  <div className="text-slate-300 font-medium">Photos Used</div>
                </div>
              </div>
              
              {/* Current Plan */}
              <div 
                className="modern-card group hover:scale-105 transition-all duration-300"
                style={{animation: 'cardSlideUp 0.8s ease-out 1.3s both'}}
              >
                <div className="text-center p-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500/20 to-purple-600/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="stat-counter text-lg font-bold text-purple-400 mb-1">{user.plan ? user.plan.charAt(0).toUpperCase() + user.plan.slice(1) : 'Free'}</div>
                  <div className="text-slate-300 font-medium">Current Plan</div>
                </div>
              </div>
            </div>
          </div>

          {/* Modern Content Grid - Completely Redesigned */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-12">
            
            {/* Left Column - Profile Management */}
            <div className="xl:col-span-8 space-y-8">
              
              {/* Profile Settings - Modern Card Design */}
              <div className="modern-card" style={{animation: 'cardSlideUp 0.8s ease-out 1.4s both'}}>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-orange-400">Profile Settings</h2>
                      <p className="text-slate-300">Manage your personal information and preferences</p>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <span className="px-4 py-2 bg-orange-500/20 text-orange-300 text-sm font-medium rounded-full">
                      Account Active
                    </span>
                  </div>
                </div>
                
                <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50">
                  <UserProfileForm user={user} onProfileUpdate={handleProfileUpdate} />
                </div>
              </div>
              
              {/* Activity & Progress Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Activity Overview */}
                <div className="modern-card" style={{animation: 'cardSlideUp 0.8s ease-out 1.5s both'}}>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/30 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-blue-400">Activity Overview</h3>
                      <p className="text-slate-300 text-sm">Your creative progress</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Total Designs Created</span>
                      <span className="text-blue-400 font-bold text-lg">{userStats.designs}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Designs This Month</span>
                      <span className="text-blue-400 font-bold text-lg">{userStats.designsThisMonth}</span>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-300 text-sm">Monthly Progress</span>
                        <span className="text-blue-400 text-sm">{Math.min((userStats.designsThisMonth / 10) * 100, 100)}%</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-1000 progress-bar" 
                          style={{width: `${Math.min((userStats.designsThisMonth / 10) * 100, 100)}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Storage & Usage */}
                <div className="modern-card" style={{animation: 'cardSlideUp 0.8s ease-out 1.6s both'}}>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/30 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10M5 6h14l-1 10a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-green-400">Storage & Usage</h3>
                      <p className="text-slate-300 text-sm">Your resource utilization</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Photos Uploaded</span>
                      <span className="text-green-400 font-bold text-lg">{userStats.photos}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Storage Limit</span>
                      <span className="text-green-400 font-bold text-lg">Unlimited</span>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-300 text-sm">Storage Used</span>
                        <span className="text-green-400 text-sm">{Math.min((userStats.photos / 100) * 100, 100)}%</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-1000 progress-bar" 
                          style={{width: `${Math.min((userStats.photos / 100) * 100, 100)}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions Panel */}
              <div className="modern-card" style={{animation: 'cardSlideUp 0.8s ease-out 1.7s both'}}>
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/30 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-purple-400">Quick Actions</h3>
                    <p className="text-slate-300 text-sm">Start creating with one click</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    onClick={() => navigate('/wall')}
                    className="modern-button group bg-gradient-to-br from-orange-500/20 to-orange-600/30 hover:from-orange-500/30 hover:to-orange-600/40 border border-orange-400/30 text-orange-300 hover:text-orange-200 p-6 rounded-2xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="text-center">
                      <svg className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      <div className="font-bold text-lg mb-1">Create New Design</div>
                      <div className="text-sm opacity-75">Start fresh canvas</div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="modern-button group bg-gradient-to-br from-blue-500/20 to-blue-600/30 hover:from-blue-500/30 hover:to-blue-600/40 border border-blue-400/30 text-blue-300 hover:text-blue-200 p-6 rounded-2xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="text-center">
                      <svg className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <div className="font-bold text-lg mb-1">View Gallery</div>
                      <div className="text-sm opacity-75">Browse designs</div>
                    </div>
                  </button>
                  
                  <button className="modern-button group bg-gradient-to-br from-green-500/20 to-green-600/30 hover:from-green-500/30 hover:to-green-600/40 border border-green-400/30 text-green-300 hover:text-green-200 p-6 rounded-2xl transition-all duration-300 hover:scale-105">
                    <div className="text-center">
                      <svg className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div className="font-bold text-lg mb-1">Export Portfolio</div>
                      <div className="text-sm opacity-75">Download all</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Security & Account */}
            <div className="xl:col-span-4 space-y-8">
              {/* Security Settings - Modern Design */}
              <div className="modern-card" style={{animation: 'cardSlideUp 0.8s ease-out 1.8s both'}}>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-red-400">Security Settings</h2>
                      <p className="text-slate-300">Manage your password and security</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50">
                  <ChangePasswordForm />
                </div>
              </div>
              {/* Account Summary */}
              <div className="modern-card" style={{animation: 'cardSlideUp 0.8s ease-out 1.9s both'}}>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-indigo-600/30 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-indigo-400">Account Summary</h3>
                    <p className="text-slate-300 text-sm">Your account details</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-700/50">
                    <span className="text-slate-300">Member Since</span>
                    <span className="text-indigo-400 font-medium">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-700/50">
                    <span className="text-slate-300">Plan Status</span>
                    <span className="text-indigo-400 font-medium">
                      {user.plan ? user.plan.charAt(0).toUpperCase() + user.plan.slice(1) : 'Free'} Plan
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-700/50">
                    <span className="text-slate-300">Total Designs</span>
                    <span className="text-indigo-400 font-medium">{userStats.designs}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-slate-300">Account Status</span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 text-sm font-medium rounded-full">
                      Active
                    </span>
                  </div>
                </div>
                {(!user.plan || user.plan === 'free') && (
                  <div className="mt-6 pt-6 border-t border-slate-700/50">
                    <button 
                      onClick={() => navigate('/choose-plan')}
                      className="modern-button w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-xl"
                    >
                      <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Upgrade to Premium
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
            </div>
          </div>
        </div>
      <Footer />
    </>
  );
};
export default User;