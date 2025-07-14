import React, { useState, useEffect } from 'react';
import { authFetch } from '../../utils/auth';

const FlaggedContentManagement = () => {
  const [flaggedContent, setFlaggedContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    contentType: '',
    reason: ''
  });
  const [pagination, setPagination] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchFlaggedContent();
    fetchAnalytics();
  }, []);

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
      console.error('Fetch flagged content error:', error);
      setError('Failed to load flagged content');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await authFetch('http://localhost:5001/admin/flagged-content/analytics');
      if (!response.ok) throw new Error('Failed to fetch analytics');
      
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Fetch analytics error:', error);
    }
  };

  const handleStatusUpdate = async (id, status, resolution = null, notes = '') => {
    try {
      const response = await authFetch(`http://localhost:5001/admin/flagged-content/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, resolution, adminNotes: notes })
      });

      if (!response.ok) throw new Error('Failed to update status');

      setFlaggedContent(flaggedContent.map(item => 
        item._id === id 
          ? { ...item, status, resolution, adminNotes: notes }
          : item
      ));
    } catch (error) {
      console.error('Update status error:', error);
      setError('Failed to update status');
    }
  };

  const handleBulkUpdate = async () => {
    if (selectedItems.length === 0 || !bulkAction) return;

    try {
      const [action, value] = bulkAction.split(':');
      const response = await authFetch(`http://localhost:5001/admin/flagged-content/bulk-update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: selectedItems,
          status: action === 'status' ? value : undefined,
          resolution: action === 'resolution' ? value : undefined
        })
      });

      if (!response.ok) throw new Error('Failed to bulk update');

      fetchFlaggedContent();
      setSelectedItems([]);
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewed: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl">
            <h3 className="text-lg font-semibold">Pending Reports</h3>
            <p className="text-3xl font-bold">{analytics.summary.pendingReports}</p>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl">
            <h3 className="text-lg font-semibold">High Priority</h3>
            <p className="text-3xl font-bold">
              {flaggedContent.filter(item => ['high', 'critical'].includes(item.priority) && item.status === 'pending').length}
            </p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
            <h3 className="text-lg font-semibold">Resolved</h3>
            <p className="text-3xl font-bold">{analytics.summary.resolvedReports}</p>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
            <h3 className="text-lg font-semibold">Total Reports</h3>
            <p className="text-3xl font-bold">{analytics.summary.totalReports}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => setFilters({...filters, priority: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          <select
            value={filters.contentType}
            onChange={(e) => setFilters({...filters, contentType: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Types</option>
            <option value="draft">Drafts</option>
            <option value="user">Users</option>
            <option value="shared_draft">Shared Drafts</option>
          </select>

          <select
            value={filters.reason}
            onChange={(e) => setFilters({...filters, reason: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Reasons</option>
            <option value="inappropriate_content">Inappropriate Content</option>
            <option value="spam">Spam</option>
            <option value="copyright_violation">Copyright Violation</option>
            <option value="harassment">Harassment</option>
            <option value="fake_account">Fake Account</option>
            <option value="violence">Violence</option>
            <option value="hate_speech">Hate Speech</option>
            <option value="other">Other</option>
          </select>
        </div>

        <button
          onClick={() => fetchFlaggedContent()}
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
              {selectedItems.length} items selected
            </span>
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className="px-3 py-2 border border-blue-300 rounded-lg text-sm"
            >
              <option value="">Choose action...</option>
              <option value="status:reviewed">Mark as Reviewed</option>
              <option value="status:resolved">Mark as Resolved</option>
              <option value="status:rejected">Mark as Rejected</option>
              <option value="resolution:no_action">No Action Required</option>
              <option value="resolution:content_removed">Remove Content</option>
              <option value="resolution:user_warned">Warn User</option>
            </select>
            <button
              onClick={handleBulkUpdate}
              disabled={!bulkAction}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              Apply
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

      {/* Flagged Content Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedItems(flaggedContent.map(item => item._id));
                    } else {
                      setSelectedItems([]);
                    }
                  }}
                  checked={selectedItems.length === flaggedContent.length && flaggedContent.length > 0}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Content</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reporter</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reported</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </td>
              </tr>
            ) : flaggedContent.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                  No flagged content found
                </td>
              </tr>
            ) : (
              flaggedContent.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems([...selectedItems, item._id]);
                        } else {
                          setSelectedItems(selectedItems.filter(id => id !== item._id));
                        }
                      }}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {item.contentType.replace('_', ' ').toUpperCase()}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {item.contentId}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {item.reportedBy?.name || 'Unknown'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.reportedBy?.email || 'Unknown'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {item.reason.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                    {item.description && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {item.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium space-x-2">
                    {item.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(item._id, 'reviewed')}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Review
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(item._id, 'resolved', 'no_action')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Resolve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(item._id, 'rejected')}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </>
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
              onClick={() => fetchFlaggedContent(pagination.currentPage - 1)}
              disabled={!pagination.hasPrev}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => fetchFlaggedContent(pagination.currentPage + 1)}
              disabled={!pagination.hasNext}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlaggedContentManagement;
