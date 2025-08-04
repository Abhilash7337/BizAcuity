import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Footer } from '../components/layout';
import { UserContext } from '../App';
import { authFetch } from '../utils/auth';
import { PlanManagement, DecorManagement } from '../components/admin';
import PlanUpgradeRequests from '../components/admin/PlanUpgradeRequests';

const Admin = () => {
  // Email modal state
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [selectAllUsers, setSelectAllUsers] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [sendTestEmail, setSendTestEmail] = useState(false);
  const navigate = useNavigate();
  const { registeredUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [pendingUpgradeCount, setPendingUpgradeCount] = useState(0);
  const notificationIntervalRef = useRef(null);

  // User edit modal state
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editUserLoading, setEditUserLoading] = useState(false);
  const [editUserError, setEditUserError] = useState('');
  const [availablePlans, setAvailablePlans] = useState([]);
  // Fetch available plans for dropdown
useEffect(() => {
  if (showEditUserModal) {
    (async () => {
      try {
        const response = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/admin/plans`);
        if (!response.ok) throw new Error('Failed to fetch plans');
        const data = await response.json();
        let plans = data.plans || [];
        // If user's plan is not in the list, add it as a temporary option
        if (
          editUser?.plan &&
          !plans.some((plan) => plan.name === editUser.plan)
        ) {
          plans = [{ _id: 'custom', name: editUser.plan }, ...plans];
        }
        setAvailablePlans(plans);
      } catch {
        setAvailablePlans([]);
      }
    })();
  }
}, [showEditUserModal, editUser?.plan]);

  // Check if user is admin
  useEffect(() => {
    if (!registeredUser) {
      navigate('/login');
      return;
    }
    if (registeredUser.userType !== 'admin' && registeredUser.email !== 'abhilashpodisetty@gmail.com') {
      navigate('/dashboard');
      return;
    }
    fetchDashboardStats();
    fetchPendingUpgradeCount();
    // Poll for new plan upgrade requests every 10 seconds
    notificationIntervalRef.current = setInterval(fetchPendingUpgradeCount, 10000);
    return () => {
      if (notificationIntervalRef.current) clearInterval(notificationIntervalRef.current);
    };
  }, [registeredUser, navigate]);

  const fetchPendingUpgradeCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/plan-upgrade-requests?status=pending`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPendingUpgradeCount(data.requests.length);
      } else {
        setPendingUpgradeCount(0);
      }
    } catch {
      setPendingUpgradeCount(0);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/admin/dashboard`);
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

  // Handle edit user button click
  const handleEditUserClick = (user) => {
    setEditUser({ ...user });
    setEditUserError('');
    setShowEditUserModal(true);
  };

  // Handle user field change
  const handleEditUserFieldChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prev) => ({ ...prev, [name]: value }));
  };

  // Handle user update submit
  const handleEditUserSubmit = async (e) => {
    e.preventDefault();
    setEditUserLoading(true);
    setEditUserError('');
    try {
      const response = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/admin/users/${editUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editUser.name,
          email: editUser.email,
          plan: editUser.plan,
        }),
      });
      if (!response.ok) throw new Error('Failed to update user');
      // Update user in dashboardStats.recentUsers
      setDashboardStats((prev) => ({
        ...prev,
        recentUsers: prev.recentUsers.map((u) =>
          u._id === editUser._id ? { ...u, ...editUser } : u
        ),
      }));
      setShowEditUserModal(false);
      setEditUser(null);
    } catch (err) {
      setEditUserError(err.message || 'Failed to update user');
    } finally {
      setEditUserLoading(false);
    }
  };

  // Handle user delete
  const handleDeleteUser = async () => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    setEditUserLoading(true);
    setEditUserError('');
    try {
      const response = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/admin/users/${editUser._id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete user');
      // Remove user from dashboardStats.recentUsers
      setDashboardStats((prev) => ({
        ...prev,
        recentUsers: prev.recentUsers.filter((u) => u._id !== editUser._id),
      }));
      setShowEditUserModal(false);
      setEditUser(null);
    } catch (err) {
      setEditUserError(err.message || 'Failed to delete user');
    } finally {
      setEditUserLoading(false);
    }
  };

  if (!registeredUser || (registeredUser.userType !== 'admin' && registeredUser.email !== 'abhilashpodisetty@gmail.com')) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Background animation */}
        <div className="absolute inset-0 opacity-10">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path 
              d="M0,50 Q25,25 50,50 T100,50" 
              stroke="url(#errorFlowGradient)" 
              strokeWidth="0.5" 
              fill="none"
              style={{animation: 'backgroundFlow 40s ease-in-out infinite'}}
            />
            <defs>
              <linearGradient id="errorFlowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(249, 115, 22, 0.4)" />
                <stop offset="50%" stopColor="rgba(251, 146, 60, 0.6)" />
                <stop offset="100%" stopColor="rgba(234, 88, 12, 0.4)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-2xl p-8 text-center max-w-md mx-4 border border-orange-500/20 transform hover:scale-105 transition-all duration-500" style={{boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 8px 25px rgba(249,115,22,0.1)'}}>
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform hover:scale-110 transition-all duration-300" style={{boxShadow: '0 8px 25px rgba(239, 68, 68, 0.3)'}}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4" style={{textShadow: '0 2px 8px rgba(0,0,0,0.3)'}}>Access Denied</h1>
          <p className="text-slate-300 mb-6 leading-relaxed">You don't have admin privileges to access this page.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl"
            style={{boxShadow: '0 8px 25px rgba(249, 115, 22, 0.3)'}}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path 
              d="M0,50 Q25,25 50,50 T100,50" 
              stroke="url(#loadingFlowGradient)" 
              strokeWidth="0.5" 
              fill="none"
              style={{animation: 'backgroundFlow 40s ease-in-out infinite'}}
            />
            <defs>
              <linearGradient id="loadingFlowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(249, 115, 22, 0.4)" />
                <stop offset="50%" stopColor="rgba(251, 146, 60, 0.6)" />
                <stop offset="100%" stopColor="rgba(234, 88, 12, 0.4)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        <Header />
        <div className="flex flex-col md:flex-row pt-8 md:pt-20">
          <div className="w-full md:w-96 bg-slate-800/60 backdrop-blur-xl shadow-2xl border-r border-orange-500/20 min-h-[200px] md:min-h-screen">
            <div className="p-4 md:p-8">
              <div className="h-24 md:h-40 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-2xl animate-pulse mb-4 md:mb-8 border border-orange-500/10"></div>
              <div className="text-center">
                <div className="w-16 md:w-24 h-16 md:h-24 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-full mx-auto mb-4 md:mb-6 animate-pulse border border-orange-500/10"></div>
                <div className="h-4 md:h-5 bg-slate-700/60 rounded-xl w-2/3 md:w-3/4 mx-auto mb-2 md:mb-3 animate-pulse"></div>
                <div className="h-3 md:h-4 bg-slate-700/60 rounded-xl w-1/2 mx-auto animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="flex-1 p-4 md:p-8 bg-slate-900/50">
            <div className="text-center py-10 md:py-20">
              <div className="relative mx-auto mb-6">
                <div className="animate-spin rounded-full h-12 md:h-20 w-12 md:w-20 border-4 border-slate-700 border-t-orange-500 mx-auto"></div>
                <div className="absolute inset-0 animate-ping rounded-full h-12 md:h-20 w-12 md:w-20 border-2 border-orange-400 opacity-20"></div>
              </div>
              <div className="mt-4 md:mt-6 text-white font-bold text-lg md:text-2xl" style={{textShadow: '0 2px 8px rgba(0,0,0,0.3)'}}>
                Loading admin panel...
              </div>
              <div className="mt-2 text-slate-400 text-sm">
                Preparing your dashboard
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 overflow-hidden">
      {/* Subtle Background Animation Layer */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="hidden sm:block">
            <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path 
                d="M0,50 Q25,25 50,50 T100,50" 
                stroke="url(#adminFlowGradient)" 
                strokeWidth="0.5" 
                fill="none"
                style={{animation: 'backgroundFlow 40s ease-in-out infinite'}}
              />
              <defs>
                <linearGradient id="adminFlowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(249, 115, 22, 0.4)" />
                  <stop offset="50%" stopColor="rgba(251, 146, 60, 0.6)" />
                  <stop offset="100%" stopColor="rgba(234, 88, 12, 0.4)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
      <Header />
      <div className="flex flex-col md:flex-row pt-4 md:pt-20 relative">
        {/* Left Sidebar */}
        <div className="w-full md:w-96 bg-slate-800/50 backdrop-blur-sm shadow-xl border-r border-orange-500/20 min-h-[200px] md:min-h-screen relative">
          <div className="p-4 md:p-8">
            {/* Admin Banner */}
            <div className="h-24 md:h-40 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl mb-4 md:mb-8 flex items-center justify-center transform hover:scale-105 transition-all duration-300 shadow-lg shadow-orange-500/25">
              <div className="text-center text-white">
                <svg className="w-8 md:w-12 h-8 md:h-12 mx-auto mb-1 md:mb-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h2 className="text-base md:text-xl font-bold">Admin Panel</h2>
                <p className="text-orange-100 text-xs md:text-sm">System Management</p>
              </div>
            </div>

            {/* Admin Profile */}
            <div className="text-center mb-4 md:mb-8">
              <div className="w-16 md:w-24 h-16 md:h-24 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mx-auto mb-2 md:mb-4 flex items-center justify-center transform hover:scale-110 transition-all duration-300 shadow-lg shadow-orange-500/30">
                <span className="text-white text-lg md:text-2xl font-bold">
                  {registeredUser?.name?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <h3 className="text-base md:text-xl font-bold text-white mb-1 md:mb-2">
                {registeredUser?.name || 'Admin'}
              </h3>
              <p className="text-orange-400 font-medium text-xs md:text-sm">Administrator</p>
              <p className="text-slate-400 text-xs">{registeredUser?.email}</p>
            </div>

            {/* Navigation */}
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center space-x-2 md:space-x-3 p-2 md:p-4 rounded-xl transition-all duration-300 transform hover:scale-105 text-xs md:text-base ${
                  activeTab === 'dashboard'
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-orange-400'
                }`}
              >
                <svg className="w-4 md:w-5 h-4 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="font-medium">Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab('plans')}
                className={`w-full flex items-center space-x-2 md:space-x-3 p-2 md:p-4 rounded-xl transition-all duration-300 transform hover:scale-105 text-xs md:text-base ${
                  activeTab === 'plans'
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-orange-400'
                }`}
              >
                <svg className="w-4 md:w-5 h-4 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="font-medium">Plan Management</span>
              </button>
              <button
                onClick={() => setActiveTab('decors')}
                className={`w-full flex items-center space-x-2 md:space-x-3 p-2 md:p-4 rounded-xl transition-all duration-300 transform hover:scale-105 text-xs md:text-base ${
                  activeTab === 'decors'
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-orange-400'
                }`}
              >
                <svg className="w-4 md:w-5 h-4 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <span className="font-medium">Decor Management</span>
              </button>
              <button
                onClick={() => setActiveTab('upgradeRequests')}
                className={`w-full flex items-center space-x-2 md:space-x-3 p-2 md:p-4 rounded-xl transition-all duration-300 transform hover:scale-105 text-xs md:text-base ${
                  activeTab === 'upgradeRequests'
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-orange-400'
                }`}
              >
                <svg className="w-4 md:w-5 h-4 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Plan Upgrade Requests</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8">
          {/* Email Modal */}
          {showEmailModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative animate-fadeIn">
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
                  onClick={() => { setShowEmailModal(false); setEmailError(''); setEmailSuccess(''); setEmailLoading(false); setSelectedUserIds([]); setSelectAllUsers(false); setEmailSubject(''); setEmailBody(''); setSendTestEmail(false); }}
                  aria-label="Close"
                >
                  &times;
                </button>
                <h3 className="text-2xl font-bold text-orange-700 mb-4 text-center">Send Email to Users</h3>
                {/* ...modal form code here... */}
              </div>
            </div>
          )}
          {/* Notification Bell for Plan Upgrade Requests - top right of main content */}
          <div className="flex justify-end mb-4">
            <button
              className="relative focus:outline-none"
              onClick={() => setActiveTab('upgradeRequests')}
              title="View Plan Upgrade Requests"
              style={{ outline: 'none' }}
            >
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 7.165 6 9.388 6 12v2.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {pendingUpgradeCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow-lg animate-bounce">
                  {pendingUpgradeCount}
                </span>
              )}
            </button>
          </div>
          {error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-6 mb-8 shadow-lg backdrop-blur-sm">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-300 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && dashboardStats && (
            <div className="space-y-8 relative z-10">
              <h1 className="text-3xl font-bold text-white mb-8 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Admin Dashboard</h1>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-orange-500/20 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm font-medium group-hover:text-slate-300 transition-colors duration-300">Total Users</p>
                      <p className="text-3xl font-bold text-white group-hover:text-orange-400 transition-colors duration-300">{dashboardStats.totalUsers}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center group-hover:bg-orange-500/30 transition-all duration-300 group-hover:scale-110">
                      <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4 h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full" style={{width: '75%', animation: 'slideIn 1s ease-out'}}></div>
                  </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-orange-500/20 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm font-medium group-hover:text-slate-300 transition-colors duration-300">Total Designs</p>
                      <p className="text-3xl font-bold text-white group-hover:text-orange-400 transition-colors duration-300">{dashboardStats.totalDrafts}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center group-hover:bg-orange-500/30 transition-all duration-300 group-hover:scale-110">
                      <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4 h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full" style={{width: '85%', animation: 'slideIn 1.2s ease-out'}}></div>
                  </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-orange-500/20 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm font-medium group-hover:text-slate-300 transition-colors duration-300">Total Plans</p>
                      <p className="text-3xl font-bold text-white group-hover:text-orange-400 transition-colors duration-300">{dashboardStats.totalPlans}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center group-hover:bg-orange-500/30 transition-all duration-300 group-hover:scale-110">
                      <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4 h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full" style={{width: '60%', animation: 'slideIn 1.4s ease-out'}}></div>
                  </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-orange-500/20 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm font-medium group-hover:text-slate-300 transition-colors duration-300">Active Plans</p>
                      <p className="text-3xl font-bold text-white group-hover:text-orange-400 transition-colors duration-300">{dashboardStats.activePlans}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center group-hover:bg-orange-500/30 transition-all duration-300 group-hover:scale-110">
                      <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4 h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full" style={{width: '90%', animation: 'slideIn 1.6s ease-out'}}></div>
                  </div>
                </div>
              </div>

              {/* Recent Users */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-orange-500/20">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-orange-400">👥</span>
                  Recent Users
                  <div className="ml-auto w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-slate-700/50">
                      <tr className="border-b border-slate-600">
                        <th className="text-left py-3 px-4 font-medium text-slate-300">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-300">Email</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-300">Plan</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-300">Joined</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-slate-800/30 divide-y divide-slate-700">
                      {dashboardStats.recentUsers?.map((user, index) => (
                        <tr key={user._id} className="hover:bg-slate-700/50 transition-all duration-300 transform hover:scale-[1.01]" style={{animationDelay: `${index * 0.1}s`}}>
                          <td className="py-3 px-4 text-white font-medium">{user.name}</td>
                          <td className="py-3 px-4 text-slate-300">{user.email}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 hover:scale-110 ${
                              user.plan === 'Premium' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                              user.plan === 'Pro' ? 'bg-orange-400/20 text-orange-200 border border-orange-400/30' :
                              'bg-slate-600/50 text-slate-300 border border-slate-500/30'
                            }`}>
                              {user.plan}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-400 text-sm">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-3 py-1 rounded-lg text-xs font-medium shadow-lg transition-all duration-300 transform hover:scale-110"
                              onClick={() => handleEditUserClick(user)}
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Edit User Modal */}
              {showEditUserModal && editUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                  <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fadeIn">
                    <button
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
                      onClick={() => { setShowEditUserModal(false); setEditUser(null); }}
                      aria-label="Close"
                    >
                      &times;
                    </button>
                    <h3 className="text-2xl font-bold text-orange-700 mb-4 text-center">Edit User</h3>
                    <form onSubmit={handleEditUserSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                          type="text"
                          name="name"
                          value={editUser.name}
                          onChange={handleEditUserFieldChange}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={editUser.email}
                          onChange={handleEditUserFieldChange}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                        <select
                          name="plan"
                          value={editUser.plan}
                          onChange={handleEditUserFieldChange}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                          required
                        >
                          {availablePlans.length === 0 && (
                            <option value="" disabled>Loading plans...</option>
                          )}
                          {availablePlans.map((plan) => (
                            <option key={plan._id} value={plan.name}>{plan.name}</option>
                          ))}
                        </select>
                      </div>
                      {editUserError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-red-700 text-sm text-center">{editUserError}</div>
                      )}
                      <div className="flex flex-col gap-3 mt-6">
                        <button
                          type="submit"
                          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition-all duration-200"
                          disabled={editUserLoading}
                        >
                          {editUserLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                          type="button"
                          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition-all duration-200"
                          disabled={editUserLoading}
                          onClick={handleDeleteUser}
                        >
                          {editUserLoading ? 'Deleting...' : 'Delete User'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

        {/* Send Email Form - always visible at the bottom of dashboard */}
        {activeTab === 'dashboard' && dashboardStats && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-8 mt-8 border border-orange-500/20">
            <h2 className="text-2xl font-bold text-white mb-4 text-center flex items-center justify-center gap-2">
              <span className="text-orange-400">📧</span>
              Send Email to Users
            </h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setEmailLoading(true);
                setEmailError('');
                setEmailSuccess('');
                try {
                  const payload = {
                    userIds: sendTestEmail ? [] : (selectAllUsers ? [] : selectedUserIds),
                    subject: emailSubject,
                    body: emailBody,
                    sendTest: sendTestEmail
                  };
                  const response = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/admin`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                  });
                  const data = await response.json();
                  if (!response.ok || !data.success) throw new Error(data.error || 'Failed to send email');
                  setEmailSuccess(`Sent to ${data.sent} user(s)`);
                  setEmailError(data.failed && data.failed.length > 0 ? `Failed: ${data.failed.map(f => f.email).join(', ')}` : '');
                } catch (err) {
                  setEmailError(err.message || 'Failed to send email');
                } finally {
                  setEmailLoading(false);
                }
              }}
              className="space-y-4"
            >
              {/* Multi-select dropdown of users */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={selectAllUsers}
                    onChange={(e) => {
                      setSelectAllUsers(e.target.checked);
                      setSelectedUserIds(e.target.checked ? [] : selectedUserIds);
                    }}
                    id="selectAllUsers"
                    disabled={sendTestEmail}
                  />
                  <label htmlFor="selectAllUsers" className="text-sm text-slate-300">Select All Users</label>
                </div>
                <div className="mb-2">
                  <select
                    multiple
                    className="w-full px-4 py-2 border border-orange-400/30 bg-slate-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 h-32"
                    value={selectedUserIds}
                    onChange={(e) => {
                      const options = Array.from(e.target.selectedOptions).map(opt => opt.value);
                      setSelectedUserIds(options);
                      setSelectAllUsers(false);
                    }}
                    disabled={selectAllUsers || sendTestEmail}
                  >
                    {dashboardStats?.recentUsers?.map((user) => (
                      <option key={user._id} value={user._id}>{user.name} ({user.email})</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={sendTestEmail}
                    onChange={(e) => {
                      setSendTestEmail(e.target.checked);
                      setSelectAllUsers(false);
                      setSelectedUserIds([]);
                    }}
                    id="sendTestEmail"
                  />
                  <label htmlFor="sendTestEmail" className="text-sm text-slate-300">Send test email to self ({registeredUser?.email})</label>
                </div>
              </div>
              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-orange-400/30 bg-slate-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  value={emailSubject}
                  onChange={e => setEmailSubject(e.target.value)}
                  required
                  disabled={emailLoading}
                />
              </div>
              {/* Body */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Body</label>
                <textarea
                  className="w-full px-4 py-2 border border-orange-400/30 bg-slate-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 min-h-[100px]"
                  value={emailBody}
                  onChange={e => setEmailBody(e.target.value)}
                  required
                  disabled={emailLoading}
                />
              </div>
              {emailError && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-2 text-red-300 text-sm text-center">{emailError}</div>
              )}
              {emailSuccess && (
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-2 text-green-300 text-sm text-center">{emailSuccess}</div>
              )}
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition-all duration-300 flex-1 transform hover:scale-105"
                  disabled={emailLoading || !emailSubject || !emailBody || (!sendTestEmail && !selectAllUsers && selectedUserIds.length === 0)}
                >
                  {emailLoading ? 'Sending...' : 'Send Email'}
                </button>
                <button
                  type="button"
                  className="bg-slate-600 hover:bg-slate-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition-all duration-300 flex-1 transform hover:scale-105"
                  onClick={() => { setEmailError(''); setEmailSuccess(''); setEmailLoading(false); setSelectedUserIds([]); setSelectAllUsers(false); setEmailSubject(''); setEmailBody(''); setSendTestEmail(false); }}
                  disabled={emailLoading}
                >
                  Clear
                </button>
              </div>
            </form>
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

          {/* Plan Upgrade Requests Tab */}
          {activeTab === 'upgradeRequests' && (
            <PlanUpgradeRequests />
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Admin;
