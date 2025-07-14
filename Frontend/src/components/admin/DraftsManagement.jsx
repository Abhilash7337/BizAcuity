import React from 'react';

const DraftsManagement = ({ 
  drafts, 
  filters, 
  setFilters, 
  fetchDrafts, 
  handleDeleteDraft, 
  pagination, 
  formatDate 
}) => {
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Search by owner name..."
          value={filters.draftOwner}
          onChange={(e) => setFilters({...filters, draftOwner: e.target.value})}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select
          value={filters.draftCategory}
          onChange={(e) => setFilters({...filters, draftCategory: e.target.value})}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Categories</option>
          <option value="living_room">Living Room</option>
          <option value="bedroom">Bedroom</option>
          <option value="kitchen">Kitchen</option>
          <option value="other">Other</option>
        </select>
      </div>

      <button
        onClick={() => fetchDrafts()}
        className="px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary transition"
      >
        Filter Drafts
      </button>

      {/* Drafts Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shared</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {drafts.map((draft) => (
              <tr key={draft._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{draft.title}</div>
                  <div className="text-sm text-gray-500">{draft.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{draft.userId?.name}</div>
                    <div className="text-sm text-gray-500">{draft.userId?.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {draft.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(draft.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    draft.isShared ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {draft.isShared ? 'Shared' : 'Private'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleDeleteDraft(draft._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
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
              onClick={() => fetchDrafts(pagination.currentPage - 1)}
              disabled={!pagination.hasPrev}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => fetchDrafts(pagination.currentPage + 1)}
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

export default DraftsManagement;
