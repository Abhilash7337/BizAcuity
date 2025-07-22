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
        const response = await authFetch('http://localhost:5001/admin/plans');
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
    if (registeredUser.userType !== 'admin' && registeredUser.email !== 'admin@gmail.com') {
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
      const res = await fetch('http://localhost:5001/admin/plan-upgrade-requests?status=pending', {
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
      const response = await authFetch(`http://localhost:5001/admin/users/${editUser._id}`, {
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
      const response = await authFetch(`http://localhost:5001/admin/users/${editUser._id}`, {
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
      <div className="flex pt-20 relative">
        {/* Left Sidebar */}
        <div className="w-96 bg-white shadow-xl border-r border-orange-300 min-h-screen relative">
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
            {/* Mail Icon Button */}
            <button
              onClick={() => setShowEmailModal(true)}
              className="w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 text-gray-600 hover:bg-gray-50"
              title="Send Email to Users"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H8m8 0a4 4 0 01-8 0m8 0V8a4 4 0 00-8 0v4m8 0v4a4 4 0 01-8 0v-4" />
              </svg>
              <span className="font-medium">Send Email</span>
            </button>
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

              <button
                onClick={() => setActiveTab('upgradeRequests')}
                className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 ${
                  activeTab === 'upgradeRequests'
                    ? 'bg-orange-100 text-orange-700 shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Plan Upgrade Requests</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
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
                      const response = await authFetch('http://localhost:5001/admin', {
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
                      <label htmlFor="selectAllUsers" className="text-sm">Select All Users</label>
                    </div>
                    <div className="mb-2">
                      <select
                        multiple
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 h-32"
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
                      <label htmlFor="sendTestEmail" className="text-sm">Send test email to self ({registeredUser?.email})</label>
                    </div>
                  </div>
                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                      value={emailSubject}
                      onChange={e => setEmailSubject(e.target.value)}
                      required
                      disabled={emailLoading}
                    />
                  </div>
                  {/* Body */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
                    <textarea
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 min-h-[100px]"
                      value={emailBody}
                      onChange={e => setEmailBody(e.target.value)}
                      required
                      disabled={emailLoading}
                    />
                  </div>
                  {emailError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-red-700 text-sm text-center">{emailError}</div>
                  )}
                  {emailSuccess && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-green-700 text-sm text-center">{emailSuccess}</div>
                  )}
                  <div className="flex gap-3 mt-6">
                    <button
                      type="submit"
                      className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition-all duration-200 flex-1"
                      disabled={emailLoading || !emailSubject || !emailBody || (!sendTestEmail && !selectAllUsers && selectedUserIds.length === 0)}
                    >
                      {emailLoading ? 'Sending...' : 'Send Email'}
                    </button>
                    <button
                      type="button"
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-bold shadow-lg transition-all duration-200 flex-1"
                      onClick={() => { setShowEmailModal(false); setEmailError(''); setEmailSuccess(''); setEmailLoading(false); setSelectedUserIds([]); setSelectAllUsers(false); setEmailSubject(''); setEmailBody(''); setSendTestEmail(false); }}
                      disabled={emailLoading}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
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
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
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
                          <td className="py-3 px-4">
                            <button
                              className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg text-xs font-medium shadow transition-all duration-200"
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
