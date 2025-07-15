import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout';
import { UserContext } from '../App';
import { authFetch } from '../utils/auth';
import { API_ENDPOINTS } from '../constants/api';
import {
  DashboardStats,
  UsersManagement,
  PaymentsManagement,
  DraftsManagement,
  SharingManagement,
  FlaggedContentManagement,
  SubscriptionManagement,
  ReportsExport
} from '../components/admin';

const AdminDashboard = () => {
  const { registeredUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [sharedDrafts, setSharedDrafts] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [flaggedContent, setFlaggedContent] = useState([]);
  const [sharingStats, setSharingStats] = useState({});
  const [pagination, setPagination] = useState({});
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    userSearch: '',
    userPlan: '',
    paymentStatus: '',
    paymentPlan: '',
    draftSearch: '',
    draftOwner: '',
    draftCategory: '',
    shareOwner: '',
    shareRecipient: '',
    shareStatus: '',
    sharingType: 'active'
  });

  // Check if user is admin
  useEffect(() => {
    if (registeredUser && (registeredUser.userType !== 'admin' || registeredUser.email !== 'admin@gmail.com')) {
      navigate('/dashboard');
      return;
    }
    if (registeredUser?.userType === 'admin' && registeredUser?.email === 'admin@gmail.com') {
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

  const fetchPayments = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 10,
        status: filters.paymentStatus,
        plan: filters.paymentPlan
      });
      
      const response = await authFetch(`http://localhost:5001/admin/payments?${params}`);
      if (!response.ok) throw new Error('Failed to fetch payments');
      const data = await response.json();
      setPayments(data.payments);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Payments fetch error:', error);
      setError('Failed to load payments');
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

  const fetchSharingAnalytics = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 10,
        owner: filters.shareOwner,
        recipient: filters.shareRecipient,
        status: filters.shareStatus,
        type: filters.sharingType
      });
      
      const response = await authFetch(`http://localhost:5001/admin/shared-drafts?${params}`);
      if (!response.ok) throw new Error('Failed to fetch sharing data');
      const data = await response.json();
      setSharedDrafts(data.sharedDrafts);
      setSharingStats(data.stats);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Sharing fetch error:', error);
      setError('Failed to load sharing data');
    } finally {
      setLoading(false);
    }
  };

  const fetchDrafts = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 10,
        search: filters.draftOwner || filters.draftSearch,
        category: filters.draftCategory
      });
      
      const response = await authFetch(`http://localhost:5001/admin/drafts?${params}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch drafts: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      setDrafts(data.drafts);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Drafts fetch error:', error);
      setError('Failed to load drafts');
    } finally {
      setLoading(false);
    }
  };

  const fetchFlaggedContent = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 10,
        ...filters
      });
      
      const response = await authFetch(`http://localhost:5001/admin/flagged-content?${params}`);
      if (!response.ok) throw new Error('Failed to fetch flagged content');
      const data = await response.json();
      setFlaggedContent(data.flaggedContent);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Flagged content fetch error:', error);
      setError('Failed to load flagged content');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setError('');
    
    switch (tabId) {
      case 'dashboard':
        fetchDashboardData();
        break;
      case 'users':
        fetchUsers();
        break;
      case 'payments':
        fetchPayments();
        break;
      case 'drafts':
        fetchDrafts();
        break;
      case 'subscriptions':
        fetchSubscriptions();
        break;
      case 'flagged':
        fetchFlaggedContent();
        break;
      case 'sharing':
        fetchSharingAnalytics();
        break;
      case 'reports':
        // Reports don't need data fetching
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

  const handleDeleteDraft = async (draftId) => {
    if (!window.confirm('Are you sure you want to delete this draft?')) return;
    
    try {
      const response = await authFetch(`http://localhost:5001/admin/drafts/${draftId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete draft');
      
      setDrafts(drafts.filter(draft => draft._id !== draftId));
    } catch (error) {
      console.error('Delete draft error:', error);
      setError('Failed to delete draft');
    }
  };

  const handleRevokeShare = async (shareId) => {
    if (!window.confirm('Are you sure you want to revoke this share? The shared link will become inactive.')) return;

    try {
      const response = await authFetch(`http://localhost:5001/admin/shared-drafts/${shareId}/revoke`, {
        method: 'PUT'
      });

      if (!response.ok) throw new Error('Failed to revoke share');

      // Update the local state
      setSharedDrafts(sharedDrafts.map(share => 
        share._id === shareId 
          ? { ...share, isActive: false, unsharedAt: new Date().toISOString() }
          : share
      ));
      
      // Update stats
      setSharingStats(prev => ({
        ...prev,
        activeShares: (prev.activeShares || 0) - 1,
        revokedShares: (prev.revokedShares || 0) + 1
      }));

    } catch (error) {
      console.error('Revoke share error:', error);
      setError('Failed to revoke share');
    }
  };

  const handleReactivateShare = async (shareId) => {
    if (!window.confirm('Are you sure you want to reactivate this share? The link will become active again.')) return;

    try {
      const response = await authFetch(`http://localhost:5001/admin/shared-drafts/${shareId}/reactivate`, {
        method: 'PUT'
      });

      if (!response.ok) throw new Error('Failed to reactivate share');

      // Update the local state
      setSharedDrafts(sharedDrafts.map(share => 
        share._id === shareId 
          ? { ...share, isActive: true, unsharedAt: null }
          : share
      ));
      
      // Update stats
      setSharingStats(prev => ({
        ...prev,
        activeShares: (prev.activeShares || 0) + 1,
        revokedShares: (prev.revokedShares || 0) - 1
      }));

    } catch (error) {
      console.error('Reactivate share error:', error);
      setError('Failed to reactivate share');
    }
  };

  const handlePermanentDeleteShare = async (shareId) => {
    if (!window.confirm('Are you sure you want to permanently delete this share? This action cannot be undone.')) return;

    try {
      const response = await authFetch(`http://localhost:5001/admin/shared-drafts/${shareId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete share');

      // Remove from local state
      setSharedDrafts(sharedDrafts.filter(share => share._id !== shareId));
      
      // Update stats
      setSharingStats(prev => ({
        ...prev,
        revokedShares: (prev.revokedShares || 0) - 1
      }));

    } catch (error) {
      console.error('Delete share error:', error);
      setError('Failed to delete share');
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

  if (!registeredUser || registeredUser.userType !== 'admin' || registeredUser.email !== 'admin@gmail.com') {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f1e6cb' }}>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
            <p className="text-gray-600">You don't have admin privileges to access this page.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f1e6cb' }}>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, payments, and application data</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                { id: 'users', label: 'Users', icon: '👥' },
                { id: 'subscriptions', label: 'Subscriptions', icon: '💳' },
                { id: 'payments', label: 'Payments', icon: '�' },
                { id: 'drafts', label: 'Drafts (Altars)', icon: '📄' },
                { id: 'flagged', label: 'Flagged Content', icon: '🚩' },
                { id: 'sharing', label: 'Sharing', icon: '🔗' },
                { id: 'reports', label: 'Reports & Export', icon: '📋' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-dark text-primary-dark'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-dark mx-auto mb-4"></div>
                <p className="text-gray-600">Loading...</p>
              </div>
            ) : (
              <>
                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && dashboardData && (
                  <DashboardStats 
                    dashboardData={dashboardData}
                    formatCurrency={formatCurrency}
                    formatDate={formatDate}
                  />
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

                {/* Flagged Content Tab */}
                {activeTab === 'flagged' && (
                  <FlaggedContentManagement />
                )}

                {/* Reports Tab */}
                {activeTab === 'reports' && (
                  <ReportsExport />
                )}

                {/* Payments Tab */}
                {activeTab === 'payments' && (
                  <PaymentsManagement
                    payments={payments}
                    filters={filters}
                    setFilters={setFilters}
                    fetchPayments={fetchPayments}
                    pagination={pagination}
                    formatDate={formatDate}
                    formatCurrency={formatCurrency}
                  />
                )}

                {/* Drafts Tab */}
                {activeTab === 'drafts' && (
                  <DraftsManagement
                    drafts={drafts}
                    filters={filters}
                    setFilters={setFilters}
                    fetchDrafts={fetchDrafts}
                    handleDeleteDraft={handleDeleteDraft}
                    pagination={pagination}
                    formatDate={formatDate}
                  />
                )}

                {/* Sharing Tab */}
                {activeTab === 'sharing' && (
                  <SharingManagement
                    sharedDrafts={sharedDrafts}
                    filters={filters}
                    setFilters={setFilters}
                    fetchSharedDrafts={fetchSharingAnalytics}
                    handleRevokeShare={handleRevokeShare}
                    handleReactivateShare={handleReactivateShare}
                    handlePermanentDeleteShare={handlePermanentDeleteShare}
                    pagination={pagination}
                    formatDate={formatDate}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
