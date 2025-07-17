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

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  const fetchUserStats = async () => {
    try {
      // Fetch user drafts to get designs count
      const draftsResponse = await authFetch('http://localhost:5001/drafts');
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
      authFetch(`http://localhost:5001/user/profile`)
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
      <div className="min-h-screen bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400">
        <Header />
        
        <div className="flex pt-20">
          <div className="w-96 bg-white shadow-xl border-r border-orange-300 min-h-screen">
            <div className="p-8">
              <div className="h-40 bg-orange-200/50 rounded-2xl animate-pulse mb-8"></div>
              <div className="text-center">
                <div className="w-24 h-24 bg-orange-200/50 rounded-full mx-auto mb-6 animate-pulse"></div>
                <div className="h-5 bg-orange-200/50 rounded-xl w-3/4 mx-auto mb-3 animate-pulse"></div>
                <div className="h-4 bg-orange-200/50 rounded-xl w-1/2 mx-auto animate-pulse"></div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-8">
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-orange-300 border-t-orange-700 mx-auto"></div>
              <div className="mt-6 text-orange-800 font-bold text-2xl">Loading your profile...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400">
        <Header />
        
        <div className="flex pt-20">
          <div className="w-96 bg-white shadow-xl border-r border-orange-300 min-h-screen">
            <div className="p-8">
              <div className="h-40 bg-red-100 rounded-2xl mb-8"></div>
              <div className="text-center">
                <div className="w-24 h-24 bg-red-100 rounded-full mx-auto mb-6"></div>
                <div className="text-red-600 text-sm font-medium">Error loading profile</div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-8">
            <div className="text-center py-20">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-10 max-w-lg mx-auto shadow-xl">
                <svg className="mx-auto h-16 w-16 text-red-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-600 font-semibold text-lg">{error}</p>
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
        @keyframes cardFadeIn {
          from { opacity: 0; transform: translateY(30px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 overflow-hidden">
      {/* Subtle Background Animation Layer */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Main background container */}
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Abstract morphing shapes */}
          <div 
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-orange-300 to-orange-500 opacity-15 blur-xl"
            style={{animation: 'abstractMorph 45s ease-in-out infinite'}}
          ></div>
          <div 
            className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 opacity-12 blur-xl"
            style={{animation: 'abstractMorph 60s ease-in-out infinite reverse', animationDelay: '-20s'}}
          ></div>
          <div 
            className="absolute top-1/2 left-1/3 w-20 h-20 bg-gradient-to-br from-white to-orange-300 opacity-10 blur-lg"
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
          {/* Page Header */}
          <div className="mb-8">
            <div className="bg-white rounded-3xl shadow-xl border border-orange-300/30 overflow-hidden animate-[cardFadeIn_0.8s_ease] relative">
              <div className="relative h-40 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 flex items-end">
                {/* Layered gradients and floating icons */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 via-transparent to-black/20"></div>
                <div className="absolute -top-8 left-8 w-24 h-24 bg-orange-200/60 rounded-full blur-2xl animate-float" style={{zIndex:1}}></div>
                <div className="absolute -top-6 right-12 w-16 h-16 bg-orange-400/40 rounded-full blur-xl animate-gentleFloat" style={{zIndex:1}}></div>
                {/* Profile Info and Actions */}
                <div className="absolute top-8 left-8 right-8 flex flex-col md:flex-row items-center md:items-end justify-between z-10">
                  {/* Profile Info - Left Side */}
                  <div className="flex items-center space-x-6 mb-4 md:mb-0">
                    {/* Profile Photo */}
                    <div className="w-28 h-28 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-white relative">
                      {user.profilePhoto ? (
                        <img 
                          src={user.profilePhoto} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center">
                          <span className="text-white text-3xl font-bold">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </span>
                        </div>
                      )}
                      {/* Floating icon */}
                      <div className="absolute -top-4 -right-4 w-10 h-10 bg-orange-400/80 rounded-full flex items-center justify-center shadow-lg animate-float" style={{animationDelay: '1s'}}>
                        <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                      </div>
                    </div>
                    {/* User Info */}
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-1" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.6)'}}>{user.name}</h1>
                      <p className="text-white text-lg font-medium" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.6)'}}>{user.email}</p>
                    </div>
                  </div>
                  {/* Action Buttons - Right Side */}
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => navigate('/dashboard')}
                      className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-xl text-base font-semibold hover:bg-white/30 hover:scale-105 active:scale-98 transition-all duration-300 shadow-lg"
                    >
                      Dashboard
                    </button>
                    <button 
                      onClick={() => navigate('/wall')}
                      className="bg-white text-orange-700 px-6 py-3 rounded-xl text-base font-semibold hover:bg-orange-100 hover:scale-105 active:scale-98 transition-all duration-300 shadow-lg"
                    >
                      Create Design
                    </button>
                  </div>
                </div>
              </div>
              {/* Stats Section */}
              <div className="pt-8 pb-8 px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div 
                    onClick={handleViewDesigns}
                    className="text-center cursor-pointer group"
                  >
                    <div className="w-16 h-16 mx-auto mb-3 bg-orange-500/10 rounded-2xl flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                      <svg className="w-8 h-8 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div className="text-2xl font-bold text-orange-800">{userStats.designs}</div>
                    <div className="text-sm text-orange-600 font-medium">Designs</div>
                  </div>
                  
                  {/* Removed Photos card */}
                  
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 bg-orange-300/30 rounded-2xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="text-2xl font-bold text-orange-800">{userStats.designsThisMonth}</div>
                    <div className="text-sm text-orange-600 font-medium">This Month</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 bg-orange-200/40 rounded-2xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="text-2xl font-bold text-orange-800">{user.plan ? user.plan.charAt(0).toUpperCase() + user.plan.slice(1) : 'No Plan'}</div>
                    <div className="text-sm text-orange-600 font-medium">Plan</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Profile Settings Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-orange-300/30 overflow-hidden animate-[cardFadeIn_0.8s_ease]">
              <div className="p-8 border-b border-orange-200/20 flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl flex items-center justify-center animate-float" style={{animationDelay: '0.5s'}}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-orange-800">Profile Details</h2>
                  <p className="text-orange-600 text-sm">Update your personal information and preferences</p>
                </div>
              </div>
              <div className="p-8">
                <UserProfileForm user={user} onProfileUpdate={handleProfileUpdate} />
              </div>
            </div>
            {/* Security Settings Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-orange-300/30 overflow-hidden animate-[cardFadeIn_0.8s_ease]" style={{animationDelay: '0.2s'}}>
              <div className="p-8 border-b border-orange-200/20 flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center animate-float" style={{animationDelay: '1s'}}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-orange-800">Security Settings</h2>
                  <p className="text-orange-600 text-sm">Manage your password and account security</p>
                </div>
              </div>
              <div className="p-8">
                <ChangePasswordForm />
              </div>
            </div>
          </div>
          {/* Additional Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Activity Overview */}
            <div className="bg-white rounded-2xl shadow-lg border border-orange-300/30 p-6 animate-[cardFadeIn_0.8s_ease]" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center animate-float" style={{animationDelay: '0.7s'}}>
                  <svg className="w-5 h-5 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-orange-800">Activity</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-orange-600 text-sm">Total Designs</span>
                  <span className="text-orange-800 font-bold">{userStats.designs}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-orange-600 text-sm">This Month</span>
                  <span className="text-orange-800 font-bold">{userStats.designsThisMonth}</span>
                </div>
                <div className="w-full bg-orange-200/30 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-orange-700 h-2 rounded-full transition-all duration-500" 
                    style={{width: `${Math.min((userStats.designsThisMonth / 10) * 100, 100)}%`}}
                  ></div>
                </div>
              </div>
            </div>
            {/* Storage Info */}
            <div className="bg-white rounded-2xl shadow-lg border border-orange-300/30 p-6 animate-[cardFadeIn_0.8s_ease]" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-orange-400/20 rounded-xl flex items-center justify-center animate-float" style={{animationDelay: '1.2s'}}>
                  <svg className="w-5 h-5 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10M5 6h14l-1 10a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6z" />
                  </svg>
                </div>
                <h3 className="font-bold text-orange-800">Storage</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-orange-600 text-sm">Photos Used</span>
                  <span className="text-orange-800 font-bold">{userStats.photos}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-orange-600 text-sm">Storage Limit</span>
                  <span className="text-orange-800 font-bold">Unlimited</span>
                </div>
                <div className="w-full bg-orange-200/30 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full transition-all duration-500" 
                    style={{width: `${Math.min((userStats.photos / 100) * 100, 100)}%`}}
                  ></div>
                </div>
              </div>
            </div>
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-orange-300/30 p-6 animate-[cardFadeIn_0.8s_ease]" style={{animationDelay: '0.5s'}}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-orange-300/30 rounded-xl flex items-center justify-center animate-float" style={{animationDelay: '1.5s'}}>
                  <svg className="w-5 h-5 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-orange-800">Quick Actions</h3>
              </div>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/wall')}
                  className="w-full bg-orange-500/10 hover:bg-orange-500/20 text-orange-800 font-medium py-3 px-4 rounded-xl text-sm transition-all duration-300 text-left"
                >
                  Create New Design
                </button>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-orange-400/20 hover:bg-orange-400/30 text-orange-800 font-medium py-3 px-4 rounded-xl text-sm transition-all duration-300 text-left"
                >
                  View All Designs
                </button>
                <button className="w-full bg-orange-300/20 hover:bg-orange-300/30 text-orange-800 font-medium py-3 px-4 rounded-xl text-sm transition-all duration-300 text-left">
                  Export Portfolio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
    </>
  );
};

export default User; 