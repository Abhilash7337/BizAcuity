import React, { useEffect, useState } from 'react';
import { authFetch } from '../../utils/auth';

const STATUS_COLORS = {
  pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  approved: 'bg-green-500/20 text-green-300 border-green-500/30',
  rejected: 'bg-red-500/20 text-red-300 border-red-500/30',
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
    <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-orange-500/20 p-6 shadow-2xl max-w-full animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1" style={{textShadow: '0 2px 8px rgba(0,0,0,0.3)'}}>
            Plan Upgrade Requests
          </h2>
          <p className="text-slate-400 text-sm">Manage user plan upgrade requests</p>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="relative mx-auto mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-600 border-t-orange-500"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-2 border-orange-400 opacity-20"></div>
          </div>
          <p className="text-slate-300 font-medium">Loading requests...</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-center">
          <div className="text-red-300 font-medium">{error}</div>
        </div>
      ) : latestRequests.length === 0 ? (
        <div className="bg-slate-700/50 rounded-xl p-8 text-center border border-slate-600">
          <div className="w-16 h-16 bg-slate-600/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8h.01M12 13h.01M16 9h.01" />
            </svg>
          </div>
          <h3 className="text-white font-bold text-lg mb-2">No requests found</h3>
          <p className="text-slate-400">No plan upgrade requests to display.</p>
        </div>
      ) : (
        <div className="bg-slate-700/30 rounded-xl border border-slate-600 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-600 text-xs sm:text-sm">
              <thead className="bg-slate-700/50">
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
              <tbody className="divide-y divide-slate-700/50">
                {latestRequests.map((req) => (
                  <tr key={req._id} className="hover:bg-slate-700/30 transition-all duration-300 animate-slideIn">
                    <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-slate-100 font-medium">
                      {req.user?.name || req.user?.email || req.user?._id || 'Deleted User'}
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-slate-300">
                      {req.user?.plan || (req.user ? '-' : 'N/A')}
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <span className="text-orange-400 font-bold text-sm bg-orange-500/10 px-2 py-1 rounded-lg border border-orange-500/20">
                        {req.requestedPlan}
                      </span>
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full transition-all duration-300 ${STATUS_COLORS[req.status]}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      {new Date(req.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {req.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button
                            className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-50 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-green-500/25"
                            disabled={actionLoading[req._id]}
                            onClick={() => handleAction(req._id, 'approve')}
                          >
                            {actionLoading[req._id] ? 'Approving...' : 'Approve'}
                          </button>
                          <button
                            className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-50 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-red-500/25"
                            disabled={actionLoading[req._id]}
                            onClick={() => handleAction(req._id, 'reject')}
                          >
                            {actionLoading[req._id] ? 'Rejecting...' : 'Reject'}
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="bg-slate-700/50 hover:bg-red-600 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 hover:scale-105 border border-slate-600/50 hover:border-red-500"
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
        </div>
      )}
    </div>
  );
};

export default PlanUpgradeRequests;