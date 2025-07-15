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
      <div className="min-h-screen bg-secondary">
        <Header />
        
        <div className="flex pt-20">
          <div className="w-96 bg-white shadow-xl border-r border-primary-light min-h-screen">
            <div className="p-8">
              <div className="h-40 bg-primary-light/50 rounded-2xl animate-pulse mb-8"></div>
              <div className="text-center">
                <div className="w-24 h-24 bg-primary-light/50 rounded-full mx-auto mb-6 animate-pulse"></div>
                <div className="h-5 bg-primary-light/50 rounded-xl w-3/4 mx-auto mb-3 animate-pulse"></div>
                <div className="h-4 bg-primary-light/50 rounded-xl w-1/2 mx-auto animate-pulse"></div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-8">
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-primary-light border-t-primary-dark mx-auto"></div>
              <div className="mt-6 text-primary-dark font-bold text-2xl">Loading your profile...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-secondary">
        <Header />
        
        <div className="flex pt-20">
          <div className="w-96 bg-white shadow-xl border-r border-primary-light min-h-screen">
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
    <div className="min-h-screen bg-gradient-to-br from-secondary via-primary-light/30 to-accent/20">
      <Header />
      
      {/* Main Container - Full Width */}
      <div className="pt-20 px-6">
        <div className={`transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          {/* Page Header */}
          <div className="mb-8">
            <div className="bg-white rounded-3xl shadow-xl border border-primary-light/30 overflow-hidden">
              <div className="relative h-32 bg-gradient-to-r from-primary via-primary-dark to-accent">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-light/20 via-transparent to-black/20"></div>
                
                {/* Top Section with Profile Info and Action Buttons */}
                <div className="absolute top-6 left-8 right-8 flex items-center justify-between">
                  {/* Profile Info - Left Side */}
                  <div className="flex items-center space-x-6">
                    {/* Profile Photo */}
                    <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-white">
                      {user.profilePhoto ? (
                        <img 
                          src={user.profilePhoto} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                          <span className="text-white text-2xl font-bold">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* User Info */}
                    <div>
                      <h1 className="text-2xl font-bold text-white mb-1" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.6)'}}>{user.name}</h1>
                      <p className="text-white text-sm font-medium" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.6)'}}>{user.email}</p>
                    </div>
                  </div>
                  
                  {/* Action Buttons - Right Side */}
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => navigate('/dashboard')}
                      className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/30 transition-all duration-300 shadow-lg"
                    >
                      Dashboard
                    </button>
                    <button 
                      onClick={() => navigate('/wall')}
                      className="bg-white text-primary-dark px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-light transition-all duration-300 shadow-lg"
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
                    <div className="w-16 h-16 mx-auto mb-3 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <svg className="w-8 h-8 text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div className="text-2xl font-bold text-primary-dark">{userStats.designs}</div>
                    <div className="text-sm text-primary font-medium">Designs</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 bg-accent/20 rounded-2xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="text-2xl font-bold text-primary-dark">{userStats.photos}</div>
                    <div className="text-sm text-primary font-medium">Photos</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 bg-secondary/30 rounded-2xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="text-2xl font-bold text-primary-dark">{userStats.designsThisMonth}</div>
                    <div className="text-sm text-primary font-medium">This Month</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 bg-primary-light/40 rounded-2xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="text-2xl font-bold text-primary-dark">Pro</div>
                    <div className="text-sm text-primary font-medium">Plan</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            
            {/* Profile Settings Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-primary-light/30 overflow-hidden">
              <div className="p-8 border-b border-primary-light/20">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-primary-dark">Profile Details</h2>
                    <p className="text-primary text-sm">Update your personal information and preferences</p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <UserProfileForm user={user} onProfileUpdate={handleProfileUpdate} />
              </div>
            </div>

            {/* Security Settings Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-primary-light/30 overflow-hidden">
              <div className="p-8 border-b border-primary-light/20">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary-light rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-primary-dark">Security Settings</h2>
                    <p className="text-primary text-sm">Manage your password and account security</p>
                  </div>
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
            <div className="bg-white rounded-2xl shadow-lg border border-primary-light/30 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-primary-dark">Activity</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-primary text-sm">Total Designs</span>
                  <span className="text-primary-dark font-bold">{userStats.designs}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary text-sm">This Month</span>
                  <span className="text-primary-dark font-bold">{userStats.designsThisMonth}</span>
                </div>
                <div className="w-full bg-primary-light/30 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-primary-dark h-2 rounded-full transition-all duration-500" 
                    style={{width: `${Math.min((userStats.designsThisMonth / 10) * 100, 100)}%`}}
                  ></div>
                </div>
              </div>
            </div>

            {/* Storage Info */}
            <div className="bg-white rounded-2xl shadow-lg border border-primary-light/30 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10M5 6h14l-1 10a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6z" />
                  </svg>
                </div>
                <h3 className="font-bold text-primary-dark">Storage</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-primary text-sm">Photos Used</span>
                  <span className="text-primary-dark font-bold">{userStats.photos}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary text-sm">Storage Limit</span>
                  <span className="text-primary-dark font-bold">Unlimited</span>
                </div>
                <div className="w-full bg-primary-light/30 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-accent to-primary h-2 rounded-full transition-all duration-500" 
                    style={{width: `${Math.min((userStats.photos / 100) * 100, 100)}%`}}
                  ></div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-primary-light/30 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-secondary/30 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-primary-dark">Quick Actions</h3>
              </div>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/wall')}
                  className="w-full bg-primary/10 hover:bg-primary/20 text-primary-dark font-medium py-3 px-4 rounded-xl text-sm transition-all duration-300 text-left"
                >
                  Create New Design
                </button>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-accent/20 hover:bg-accent/30 text-primary-dark font-medium py-3 px-4 rounded-xl text-sm transition-all duration-300 text-left"
                >
                  View All Designs
                </button>
                <button className="w-full bg-secondary/20 hover:bg-secondary/30 text-primary-dark font-medium py-3 px-4 rounded-xl text-sm transition-all duration-300 text-left">
                  Export Portfolio
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default User; 