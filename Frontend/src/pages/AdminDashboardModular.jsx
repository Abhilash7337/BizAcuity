import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import { authFetch } from '../utils/auth';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import {
  DashboardStats,
  UsersManagement,
  SubscriptionManagement,
  PlanManagement,
  ReportsExport
} from '../components/admin';

/**
 * AdminDashboard - Modern admin interface with sidebar navigation
 * Features: Dashboard Stats, User Management, Subscription Management, Plan Management, Reports Export
 */
const AdminDashboard = () => {
  const { registeredUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [pagination, setPagination] = useState({});
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    userSearch: '',
    userPlan: ''
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Check if user is admin
  useEffect(() => {
    if (registeredUser && !(registeredUser.userType === 'admin' || registeredUser.email === 'admin@gmail.com')) {
      navigate('/dashboard');
      return;
    }
    if (registeredUser?.userType === 'admin' || registeredUser?.email === 'admin@gmail.com') {
      fetchDashboardData();
    }
  }, [registeredUser, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await authFetch('http://localhost:5001/admin/dashboard/advanced');
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 10,
        search: filters.userSearch,
        plan: filters.userPlan
      });
      
      const response = await authFetch(`http://localhost:5001/admin/users?${params}`);
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Users fetch error:', error);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptions = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 10,
        ...filters
      });
      
      const response = await authFetch(`http://localhost:5001/admin/subscriptions?${params}`);
      if (!response.ok) throw new Error('Failed to fetch subscriptions');
      const data = await response.json();
      setSubscriptions(data.subscriptions);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Subscriptions fetch error:', error);
      setError('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tabId) => {
    console.log('Tab changed to:', tabId); // Debug log
    setActiveTab(tabId);
    setError('');
    
    // Only set loading for tabs that need data fetching from the parent component
    switch (tabId) {
      case 'dashboard':
        fetchDashboardData();
        break;
      case 'users':
        fetchUsers();
        break;
      case 'subscriptions':
        fetchSubscriptions();
        break;
      case 'plans':
        // Plans management handles its own loading
        setLoading(false);
        break;
      case 'reports':
        // Reports don't need data fetching
        setLoading(false);
        break;
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const response = await authFetch(`http://localhost:5001/admin/users/${userId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete user');
      
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Delete user error:', error);
      setError('Failed to delete user');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (!registeredUser || !(registeredUser.userType === 'admin' || registeredUser.email === 'admin@gmail.com')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex pt-20"> {/* Add padding top for fixed header */}
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Page Header */}
          <div className="bg-white shadow-sm border-b border-gray-200 p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900">
                {activeTab === 'dashboard' && 'Admin Dashboard'}
                {activeTab === 'users' && 'User Management'}
                {activeTab === 'subscriptions' && 'Subscriptions'}
                {activeTab === 'plans' && 'Plan Management'}
                {activeTab === 'reports' && 'Reports & Analytics'}
              </h1>
              <p className="text-gray-600 mt-2">
                {activeTab === 'dashboard' && 'Overview of your application metrics and activities'}
                {activeTab === 'users' && 'Manage user accounts and permissions'}
                {activeTab === 'subscriptions' && 'Monitor subscription plans and billing'}
                {activeTab === 'plans' && 'Create and manage subscription plans'}
                {activeTab === 'reports' && 'Generate and download analytical reports'}
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 m-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Content Area */}
          <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
            {loading && (activeTab === 'dashboard' || activeTab === 'users' || activeTab === 'subscriptions') ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-orange-200 rounded-full animate-spin border-t-orange-600 mx-auto mb-4"></div>
                  <p className="text-orange-700 text-lg font-medium">Loading...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                  dashboardData ? (
                    <DashboardStats 
                      dashboardData={dashboardData}
                      formatCurrency={formatCurrency}
                      formatDate={formatDate}
                    />
                  ) : (
                    <div className="text-center py-20">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <p className="text-gray-500">Dashboard data not available</p>
                    </div>
                  )
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                  <UsersManagement
                    users={users}
                    filters={filters}
                    setFilters={setFilters}
                    fetchUsers={fetchUsers}
                    handleDeleteUser={handleDeleteUser}
                    pagination={pagination}
                    formatDate={formatDate}
                  />
                )}

                {/* Subscriptions Tab */}
                {activeTab === 'subscriptions' && (
                  <SubscriptionManagement />
                )}

                {/* Plan Management Tab */}
                {activeTab === 'plans' && (
                  <PlanManagement />
                )}

                {/* Reports Tab */}
                {activeTab === 'reports' && (
                  <ReportsExport />
                )}
              </>
            )}
          </main>
        </div>

        {/* Right Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-l border-gray-200 transition-all duration-300 ease-in-out flex flex-col shadow-lg`}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">A</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
                    <p className="text-xs text-gray-500">Picture Wall Designer</p>
                  </div>
                </div>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {registeredUser?.name?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              {sidebarOpen && (
                <div>
                  <p className="font-medium text-sm text-gray-900">HI, ADMIN!</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                { id: 'users', label: 'Users', icon: '👥' },
                { id: 'subscriptions', label: 'Subscriptions', icon: '💳' },
                { id: 'plans', label: 'Manage Plans', icon: '📋' },
                { id: 'reports', label: 'Reports', icon: '📄' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-orange-50 text-orange-700 border border-orange-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {sidebarOpen && <span className="font-medium">{item.label}</span>}
                </button>
              ))}
            </div>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => {
                localStorage.clear();
                navigate('/login');
              }}
              className="w-full flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
