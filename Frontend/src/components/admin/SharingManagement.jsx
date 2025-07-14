import React from 'react';

const SharingManagement = ({ 
  sharedDrafts, 
  filters, 
  setFilters, 
  fetchSharedDrafts, 
  handleRevokeShare, 
  handleReactivateShare, 
  handlePermanentDeleteShare,
  pagination, 
  formatDate 
}) => {
  return (
    <div className="space-y-6">
      {/* Sharing Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
          <h3 className="text-lg font-semibold">Active Shares</h3>
          <p className="text-3xl font-bold">
            {sharedDrafts.filter(share => share.isActive).length}
          </p>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl">
          <h3 className="text-lg font-semibold">Revoked Shares</h3>
          <p className="text-3xl font-bold">
            {sharedDrafts.filter(share => !share.isActive && !share.isDeleted).length}
          </p>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
          <h3 className="text-lg font-semibold">Total Access Count</h3>
          <p className="text-3xl font-bold">
            {sharedDrafts.reduce((sum, share) => sum + (share.accessCount || 0), 0)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search by owner..."
          value={filters.shareOwner}
          onChange={(e) => setFilters({...filters, shareOwner: e.target.value})}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="text"
          placeholder="Search by shared with..."
          value={filters.shareRecipient}
          onChange={(e) => setFilters({...filters, shareRecipient: e.target.value})}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select
          value={filters.shareStatus}
          onChange={(e) => setFilters({...filters, shareStatus: e.target.value})}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="revoked">Revoked</option>
        </select>
      </div>

      <button
        onClick={() => fetchSharedDrafts()}
        className="px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary transition"
      >
        Filter Shared Drafts
      </button>

      {/* Shared Drafts Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Draft</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shared With</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shared Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Access Count</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sharedDrafts.map((share) => (
              <tr key={share._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{share.draftId?.name || share.draftName || 'Unknown Draft'}</div>
                    <div className="text-sm text-gray-500">ID: {share.shareId || share._id}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{share.sharedBy?.name || 'Unknown'}</div>
                    <div className="text-sm text-gray-500">{share.sharedBy?.email || 'Unknown'}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{share.sharedWith?.name || 'Public'}</div>
                    <div className="text-sm text-gray-500">{share.sharedWith?.email || 'Anyone with link'}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    share.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {share.isActive ? 'Active' : 'Revoked'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(share.sharedAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {share.accessCount || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {share.isActive ? (
                    <button
                      onClick={() => handleRevokeShare(share._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Revoke
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleReactivateShare(share._id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Reactivate
                      </button>
                      <button
                        onClick={() => handlePermanentDeleteShare(share._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
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
              onClick={() => fetchSharedDrafts(pagination.currentPage - 1)}
              disabled={!pagination.hasPrev}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => fetchSharedDrafts(pagination.currentPage + 1)}
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

export default SharingManagement;
