import React from 'react';

const DashboardStats = ({ dashboardData, formatCurrency, formatDate }) => {
  if (!dashboardData) return null;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">👥</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.totalUsers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">📄</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Drafts</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.totalDrafts}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">💳</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Payments</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.totalPayments}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">💰</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboardData.stats.totalRevenue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users by Plan */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Users by Plan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Regular Plan</p>
            <p className="text-xl font-bold text-gray-900">{dashboardData.usersByPlan.regular || 0}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Pro Plan</p>
            <p className="text-xl font-bold text-gray-900">{dashboardData.usersByPlan.pro || 0}</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Users</h3>
          <div className="space-y-3">
            {dashboardData.recentActivity.recentUsers.map((user) => (
              <div key={user._id} className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <span className="text-xs text-gray-400">{formatDate(user.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Payments</h3>
          <div className="space-y-3">
            {dashboardData.recentActivity.recentPayments.map((payment) => (
              <div key={payment._id} className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">{payment.userId?.name}</p>
                  <p className="text-sm text-gray-500">{formatCurrency(payment.amount)} - {payment.plan}</p>
                </div>
                <span className="text-xs text-gray-400">{formatDate(payment.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
