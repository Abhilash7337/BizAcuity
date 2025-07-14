import React, { useState, useEffect } from 'react';
import { authFetch } from '../../utils/auth';

const SubscriptionManagement = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    plan: '',
    search: '',
    healthStatus: ''
  });
  const [pagination, setPagination] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkAction, setBulkAction] = useState('');

  useEffect(() => {
    fetchSubscriptions();
    fetchAnalytics();
  }, []);

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
      console.error('Fetch subscriptions error:', error);
      setError('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await authFetch('http://localhost:5001/admin/subscriptions/analytics');
      if (!response.ok) throw new Error('Failed to fetch analytics');
      
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Fetch analytics error:', error);
    }
  };

  const handleUpdateSubscription = async (id, updateData) => {
    try {
      const response = await authFetch(`http://localhost:5001/admin/subscriptions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) throw new Error('Failed to update subscription');

      fetchSubscriptions();
    } catch (error) {
      console.error('Update subscription error:', error);
      setError('Failed to update subscription');
    }
  };

  const handleCancelSubscription = async (id, reason = 'Admin cancellation') => {
    if (!window.confirm('Are you sure you want to cancel this subscription?')) return;

    try {
      const response = await authFetch(`http://localhost:5001/admin/subscriptions/${id}/cancel`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });

      if (!response.ok) throw new Error('Failed to cancel subscription');

      fetchSubscriptions();
    } catch (error) {
      console.error('Cancel subscription error:', error);
      setError('Failed to cancel subscription');
    }
  };

  const handleBulkUpdate = async (action, data = {}) => {
    if (selectedItems.length === 0) return;

    try {
      const response = await authFetch(`http://localhost:5001/admin/subscriptions/bulk-update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: selectedItems,
          action,
          data
        })
      });

      if (!response.ok) throw new Error('Failed to bulk update');

      fetchSubscriptions();
      setSelectedItems([]);
      setShowBulkModal(false);
      setBulkAction('');
    } catch (error) {
      console.error('Bulk update error:', error);
      setError('Failed to bulk update');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getHealthStatusColor = (healthStatus) => {
    const colors = {
      healthy: 'bg-green-100 text-green-800',
      caution: 'bg-yellow-100 text-yellow-800',
      warning: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-800',
      suspended: 'bg-purple-100 text-purple-800'
    };
    return colors[healthStatus] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800',
      cancelled: 'bg-orange-100 text-orange-800',
      expired: 'bg-red-100 text-red-800',
      trial: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
            <h3 className="text-lg font-semibold">Active Subscriptions</h3>
            <p className="text-3xl font-bold">{analytics.summary.activeSubscriptions}</p>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
            <h3 className="text-lg font-semibold">Total Revenue</h3>
            <p className="text-3xl font-bold">{formatCurrency(analytics.summary.totalRevenue)}</p>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl">
            <h3 className="text-lg font-semibold">Expiring Soon</h3>
            <p className="text-3xl font-bold">{analytics.summary.expiringSubscriptions || 0}</p>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
            <h3 className="text-lg font-semibold">Churn Rate</h3>
            <p className="text-3xl font-bold">{analytics.summary.churnRate?.toFixed(1) || 0}%</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by user name or email..."
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="cancelled">Cancelled</option>
            <option value="expired">Expired</option>
            <option value="trial">Trial</option>
          </select>

          <select
            value={filters.plan}
            onChange={(e) => setFilters({...filters, plan: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Plans</option>
            <option value="free">Free</option>
            <option value="regular">Regular</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>

          <select
            value={filters.healthStatus}
            onChange={(e) => setFilters({...filters, healthStatus: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Health Status</option>
            <option value="healthy">Healthy</option>
            <option value="caution">Caution</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
            <option value="expired">Expired</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        <button
          onClick={() => fetchSubscriptions()}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
        >
          Apply Filters
        </button>
      </div>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-blue-800">
              {selectedItems.length} subscriptions selected
            </span>
            <button
              onClick={() => setShowBulkModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Bulk Actions
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Subscriptions Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedItems(subscriptions.map(item => item._id));
                    } else {
                      setSelectedItems([]);
                    }
                  }}
                  checked={selectedItems.length === subscriptions.length && subscriptions.length > 0}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Health</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days Left</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="9" className="px-6 py-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </td>
              </tr>
            ) : subscriptions.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                  No subscriptions found
                </td>
              </tr>
            ) : (
              subscriptions.map((sub) => (
                <tr key={sub._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(sub._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems([...selectedItems, sub._id]);
                        } else {
                          setSelectedItems(selectedItems.filter(id => id !== sub._id));
                        }
                      }}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {sub.user?.name || 'Unknown'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {sub.user?.email || 'Unknown'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {sub.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(sub.status)}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getHealthStatusColor(sub.healthStatus)}`}>
                      {sub.healthStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatCurrency(sub.amount)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(sub.endDate)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {Math.max(0, Math.ceil(sub.daysRemaining))} days
                  </td>
                  <td className="px-6 py-4 text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleUpdateSubscription(sub._id, { 
                        status: sub.status === 'active' ? 'suspended' : 'active' 
                      })}
                      className={`${sub.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                    >
                      {sub.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
                    {sub.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancelSubscription(sub._id)}
                        className="text-orange-600 hover:text-orange-900"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <div className="space-x-2">
            <button
              onClick={() => fetchSubscriptions(pagination.currentPage - 1)}
              disabled={!pagination.hasPrev}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => fetchSubscriptions(pagination.currentPage + 1)}
              disabled={!pagination.hasNext}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Bulk Actions Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Bulk Actions</h3>
            
            <div className="space-y-4">
              <button
                onClick={() => handleBulkUpdate('cancel', { reason: 'Bulk cancellation' })}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Cancel Selected Subscriptions
              </button>
              
              <button
                onClick={() => handleBulkUpdate('extend', { days: 30 })}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Extend by 30 Days
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkUpdate('changePlan', { newPlan: 'pro' })}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Upgrade to Pro
                </button>
                <button
                  onClick={() => handleBulkUpdate('changePlan', { newPlan: 'regular' })}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Downgrade to Regular
                </button>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowBulkModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement;
