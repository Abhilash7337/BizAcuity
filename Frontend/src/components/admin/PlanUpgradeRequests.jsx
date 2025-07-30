import React, { useEffect, useState } from 'react';
import { authFetch } from '../../utils/auth';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const PlanUpgradeRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState({});

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await authFetch('/admin/plan-upgrade-requests');
      const data = await res.json();
      if (res.ok && data.success) {
        setRequests(data.requests);
      } else {
        setError(data.error || 'Failed to fetch requests');
      }
    } catch (e) {
      setError('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, action) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await authFetch(`/admin/plan-upgrade-requests/${id}/${action}`, { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchRequests();
      } else {
        alert(data.error || 'Action failed');
      }
    } catch (e) {
      alert('Action failed');
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Filter: Only show the latest request per user (pending or most recent approved/rejected)
  const latestRequestsMap = {};
  requests.forEach((req) => {
    // If user is deleted, req.user may be null or missing fields
    const userId = req.user?._id || req.user?.email || req.user?.name || req._id;
    // Always show pending requests, or the most recent approved/rejected
    if (!latestRequestsMap[userId] || new Date(req.createdAt) > new Date(latestRequestsMap[userId].createdAt) || req.status === 'pending') {
      latestRequestsMap[userId] = req;
    }
  });
  const latestRequests = Object.values(latestRequestsMap).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Delete request handler
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await authFetch(`/admin/plan-upgrade-requests/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchRequests();
      } else {
        alert(data.error || 'Delete failed');
      }
    } catch (e) {
      alert('Delete failed');
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-2 sm:p-6 shadow-sm max-w-full">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Plan Upgrade Requests</h2>
      {loading ? (
        <div className="text-center py-8 text-orange-600 text-sm sm:text-base">Loading...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-600 text-sm sm:text-base">{error}</div>
      ) : latestRequests.length === 0 ? (
        <div className="text-center py-8 text-gray-500 text-sm sm:text-base">No plan upgrade requests found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Current Plan</th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Requested Plan</th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Requested At</th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Delete</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {latestRequests.map((req) => (
                <tr key={req._id} className="hover:bg-gray-50">
                  <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-gray-900">
                    {req.user?.name || req.user?.email || req.user?._id || 'Deleted User'}
                  </td>
                  <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-gray-600">
                    {req.user?.plan || (req.user ? '-' : 'N/A')}
                  </td>
                  <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-orange-700 font-semibold">{req.requestedPlan}</td>
                  <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[req.status]}`}>{req.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(req.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {req.status === 'pending' ? (
                      <div className="flex gap-2">
                        <button
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium disabled:opacity-50"
                          disabled={actionLoading[req._id]}
                          onClick={() => handleAction(req._id, 'approve')}
                        >
                          {actionLoading[req._id] ? 'Approving...' : 'Approve'}
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium disabled:opacity-50"
                          disabled={actionLoading[req._id]}
                          onClick={() => handleAction(req._id, 'reject')}
                        >
                          {actionLoading[req._id] ? 'Rejecting...' : 'Reject'}
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="bg-gray-200 hover:bg-red-500 hover:text-white text-gray-700 px-2 py-1 rounded text-xs font-medium transition-colors duration-150"
                      disabled={actionLoading[req._id]}
                      onClick={() => handleDelete(req._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PlanUpgradeRequests;
