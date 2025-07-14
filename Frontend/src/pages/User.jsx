import React, { useContext, useEffect, useState } from 'react';
import Header from '../components/Header';
import { UserContext } from '../App';
import { authFetch } from '../utils/auth';
import ChangePasswordForm from '../components/ChangePasswordForm';
import UserProfileForm from '../components/UserProfileForm';

const User = () => {
  const { registeredUser } = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  useEffect(() => {
    if (registeredUser && registeredUser.isLoggedIn) {
      setLoading(true);
      authFetch(`http://localhost:5001/user/${registeredUser.id}`)
        .then(res => res.json())
        .then(data => {
          setUser(data);
          setLoading(false);
        })
        .catch(err => {
          setError('Failed to fetch user info');
          setLoading(false);
        });
    }
  }, [registeredUser]);



  if (!registeredUser || !registeredUser.isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f1e6cb' }}>
        <Header />
        <main className="flex-1 flex items-center justify-end px-4 py-8 md:px-8 lg:px-12">
          <div className="w-full md:w-[500px] lg:w-[40%]">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8">
              <div className="text-center text-xl text-red-600">
                You are not logged in.
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f1e6cb' }}>
        <Header />
        <main className="flex-1 flex items-center justify-end px-4 py-8 md:px-8 lg:px-12">
          <div className="w-full md:w-[500px] lg:w-[40%]">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8">
              <div className="text-center">
                <svg className="animate-spin h-8 w-8 text-primary-dark mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-xl text-primary-dark">Loading user info...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f1e6cb' }}>
        <Header />
        <main className="flex-1 flex items-center justify-end px-4 py-8 md:px-8 lg:px-12">
          <div className="w-full md:w-[500px] lg:w-[40%]">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8">
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-center">
                {error}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f1e6cb' }}>
      <Header />
      <main className="flex-1 flex items-center justify-end px-4 py-8 md:px-8 lg:px-12">
        <div className="w-full md:w-[500px] lg:w-[40%] space-y-8">
          {/* Welcome Text */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-semibold mb-2" style={{ color: '#625d8c' }}>
              User Profile
            </h2>
            <p className="text-gray-600">
              View and manage your account details
            </p>
          </div>

          {/* Profile Details Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 space-y-6">
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-xl font-semibold" style={{ color: '#625d8c' }}>
                  Profile Details
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Update your personal information and profile photo
                </p>
              </div>
              
              <UserProfileForm user={user} userId={registeredUser.id} onProfileUpdate={handleProfileUpdate} />
            </div>
          </div>

          {/* Login & Security Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 space-y-6">
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-xl font-semibold" style={{ color: '#625d8c' }}>
                  Login & Security
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Manage your password and account security settings
                </p>
              </div>
              
              <ChangePasswordForm userId={registeredUser.id} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default User; 