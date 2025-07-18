import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Footer } from '../components/layout';
import { UserContext } from '../App';
import { authFetch } from '../utils/auth';
import { PlanManagement, DecorManagement } from '../components/admin';

const Admin = () => {
  const navigate = useNavigate();
  const { registeredUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardStats, setDashboardStats] = useState(null);

  // Check if user is admin
  useEffect(() => {
    if (!registeredUser) {
      navigate('/login');
      return;
    }
    
    if (registeredUser.userType !== 'admin' && registeredUser.email !== 'admin@gmail.com') {
      navigate('/dashboard');
      return;
    }

    fetchDashboardStats();
  }, [registeredUser, navigate]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await authFetch('http://localhost:5001/admin/dashboard');
      if (!response.ok) throw new Error('Failed to fetch dashboard stats');
      
      const data = await response.json();
      setDashboardStats(data.stats);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (!registeredUser || (registeredUser.userType !== 'admin' && registeredUser.email !== 'admin@gmail.com')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have admin privileges to access this page.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
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
              <div className="mt-6 text-orange-800 font-bold text-2xl">Loading admin panel...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400">
      <Header />
      
      <div className="flex pt-20">
        {/* Left Sidebar */}
        <div className="w-96 bg-white shadow-xl border-r border-orange-300 min-h-screen">
          <div className="p-8">
            {/* Admin Banner */}
            <div className="h-40 bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl mb-8 flex items-center justify-center">
              <div className="text-center text-white">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h2 className="text-xl font-bold">Admin Panel</h2>
                <p className="text-orange-100 text-sm">System Management</p>
              </div>
            </div>

            {/* Admin Profile */}
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {registeredUser?.name?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {registeredUser?.name || 'Admin'}
              </h3>
              <p className="text-orange-600 font-medium text-sm">Administrator</p>
              <p className="text-gray-500 text-xs">{registeredUser?.email}</p>
            </div>

            {/* Navigation */}
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 ${
                  activeTab === 'dashboard'
                    ? 'bg-orange-100 text-orange-700 shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="font-medium">Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('plans')}
                className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 ${
                  activeTab === 'plans'
                    ? 'bg-orange-100 text-orange-700 shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="font-medium">Plan Management</span>
              </button>

              <button
                onClick={() => setActiveTab('decors')}
                className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 ${
                  activeTab === 'decors'
                    ? 'bg-orange-100 text-orange-700 shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <span className="font-medium">Decor Management</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8 shadow-lg">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && dashboardStats && (
            <div className="space-y-8">
              <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Total Users</p>
                      <p className="text-3xl font-bold text-orange-600">{dashboardStats.totalUsers}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Total Designs</p>
                      <p className="text-3xl font-bold text-blue-600">{dashboardStats.totalDrafts}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Total Plans</p>
                      <p className="text-3xl font-bold text-green-600">{dashboardStats.totalPlans}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Active Plans</p>
                      <p className="text-3xl font-bold text-purple-600">{dashboardStats.activePlans}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Users */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Users</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Plan</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardStats.recentUsers?.map((user) => (
                        <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-800">{user.name}</td>
                          <td className="py-3 px-4 text-gray-600">{user.email}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                              {user.plan}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-500 text-sm">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Plans Tab */}
          {activeTab === 'plans' && (
            <PlanManagement />
          )}

          {/* Decors Tab */}
          {activeTab === 'decors' && (
            <DecorManagement />
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Admin;
