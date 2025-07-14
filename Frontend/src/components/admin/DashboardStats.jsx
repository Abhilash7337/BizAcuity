import React from 'react';

const DashboardStats = ({ dashboardData, formatCurrency, formatDate }) => {
  if (!dashboardData || !dashboardData.stats) return null;

  const stats = dashboardData.stats || {};
  const recentActivity = dashboardData.recentActivity || {};

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">👥</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">📄</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Drafts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDrafts || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">💳</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Payments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPayments || 0}</p>
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
            <p className="text-xl font-bold text-gray-900">{dashboardData.usersByPlan?.regular || 0}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Pro Plan</p>
            <p className="text-xl font-bold text-gray-900">{dashboardData.usersByPlan?.pro || 0}</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Users</h3>
          <div className="space-y-3">
            {recentActivity.recentUsers?.length > 0 ? (
              recentActivity.recentUsers.map((user) => (
                <div key={user._id} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <span className="text-xs text-gray-400">{formatDate(user.createdAt)}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No recent users found</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Payments</h3>
          <div className="space-y-3">
            {recentActivity.recentPayments?.length > 0 ? (
              recentActivity.recentPayments.map((payment) => (
                <div key={payment._id} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">{payment.userId?.name || 'Unknown User'}</p>
                    <p className="text-sm text-gray-500">{formatCurrency(payment.amount)} - {payment.plan}</p>
                  </div>
                  <span className="text-xs text-gray-400">{formatDate(payment.paymentDate || payment.createdAt)}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No recent payments found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
