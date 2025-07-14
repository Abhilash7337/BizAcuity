import React from 'react';

const UsersManagement = ({ 
  users, 
  filters, 
  setFilters, 
  fetchUsers, 
  handleDeleteUser, 
  pagination, 
  formatDate 
}) => {
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Search users..."
          value={filters.userSearch}
          onChange={(e) => setFilters({...filters, userSearch: e.target.value})}
          onKeyPress={(e) => e.key === 'Enter' && fetchUsers()}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select
          value={filters.userPlan}
          onChange={(e) => setFilters({...filters, userPlan: e.target.value})}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Plans</option>
          <option value="regular">Regular</option>
          <option value="pro">Pro</option>
        </select>
      </div>

      <button
        onClick={() => fetchUsers()}
        className="px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary transition"
      >
        Search Users
      </button>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.plan === 'pro' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.plan}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(user.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    disabled={user.userType === 'admin' || user.email === 'admin@gmail.com'}
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
              onClick={() => fetchUsers(pagination.currentPage - 1)}
              disabled={!pagination.hasPrev}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => fetchUsers(pagination.currentPage + 1)}
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

export default UsersManagement;
