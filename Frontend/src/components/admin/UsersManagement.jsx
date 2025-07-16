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
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent mb-2">
          Users Management
        </h2>
        <p className="text-orange-700/70">
          Manage and monitor user accounts across your platform
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-orange-100">
        <h3 className="text-lg font-semibold text-orange-800 mb-4">Search & Filter</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-orange-400">🔍</span>
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={filters.userSearch}
              onChange={(e) => setFilters({...filters, userSearch: e.target.value})}
              onKeyPress={(e) => e.key === 'Enter' && fetchUsers()}
              className="w-full pl-10 pr-4 py-3 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all"
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-orange-400">📋</span>
            </div>
            <select
              value={filters.userPlan}
              onChange={(e) => setFilters({...filters, userPlan: e.target.value})}
              className="w-full pl-10 pr-4 py-3 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/80 backdrop-blur-sm appearance-none transition-all"
            >
              <option value="">All Plans</option>
              <option value="regular">Regular</option>
              <option value="pro">Pro</option>
            </select>
          </div>

          <button
            onClick={() => fetchUsers()}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex items-center justify-center space-x-2"
          >
            <span>🔍</span>
            <span>Search Users</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-orange-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-orange-100">
            <thead className="bg-gradient-to-r from-orange-50 to-orange-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-orange-800 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-orange-800 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-orange-800 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-orange-800 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-orange-800 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white/40 backdrop-blur-sm divide-y divide-orange-50">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-orange-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-semibold">{user.name?.charAt(0).toUpperCase() || 'U'}</span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      user.plan === 'pro' ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800' : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800'
                    }`}>
                      {user.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      user.isVerified ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800' : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800'
                    }`}>
                      {user.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs"
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
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-orange-100">
          <div className="flex justify-between items-center">
            <span className="text-sm text-orange-700 font-medium">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <div className="flex space-x-3">
              <button
                onClick={() => fetchUsers(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Previous
              </button>
              <button
                onClick={() => fetchUsers(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
