import React from 'react';

const DashboardStats = ({ dashboardData, formatCurrency, formatDate }) => {
  if (!dashboardData || !dashboardData.stats) return null;

  const stats = dashboardData.stats || {};
  const recentActivity = dashboardData.recentActivity || {};

  return (
    <div className="space-y-6">
      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{stats.totalUsers || 0}</div>
            <div className="text-gray-500 text-sm font-medium">Total Users</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.totalDrafts || 0}</div>
            <div className="text-gray-500 text-sm font-medium">Designs</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{stats.totalPayments || 0}</div>
            <div className="text-gray-500 text-sm font-medium">Subscriptions</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{formatCurrency(dashboardData.stats.totalRevenue)}</div>
            <div className="text-gray-500 text-sm font-medium">Revenue</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Analytics */}
        <div className="col-span-8 space-y-6">
          {/* User Growth Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">User Growth</h3>
              <div className="flex space-x-1">
                <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded">7D</button>
                <button className="px-3 py-1 text-sm bg-orange-600 text-white rounded">30D</button>
                <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded">90D</button>
              </div>
            </div>
            <div className="h-64 bg-gray-50 rounded border flex items-end justify-around p-4">
              {[30, 60, 45, 80, 65, 90, 75, 95].map((height, index) => (
                <div
                  key={index}
                  className="bg-orange-500 rounded-t w-8 transition-all duration-300 hover:bg-orange-600"
                  style={{ height: `${height}%` }}
                ></div>
              ))}
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentActivity.activities && recentActivity.activities.length > 0 ? (
                    recentActivity.activities.map((activity, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{activity.user || 'Unknown User'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{activity.action || 'Unknown Action'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.time || 'Unknown Time'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            {activity.status || 'success'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    // Sample Data for Demo
                    <>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">john.doe@email.com</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">User Registration</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2 minutes ago</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">success</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">sarah.smith@email.com</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Design Created</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5 minutes ago</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">success</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">mike.wilson@email.com</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Subscription Upgrade</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12 minutes ago</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">success</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">anna.brown@email.com</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Payment Completed</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">18 minutes ago</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">success</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">david.lee@email.com</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">User Registration</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">25 minutes ago</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">success</span>
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - Side Panels */}
        <div className="col-span-4 space-y-6">
          {/* User Distribution */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">User Distribution</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Free Plan</span>
                <span className="text-sm font-medium text-gray-900">{stats.freePlanUsers || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Premium Plan</span>
                <span className="text-sm font-medium text-gray-900">{stats.premiumPlanUsers || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>
          </div>

          {/* Recent Payments */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Payments</h3>
            <div className="space-y-3">
              <div className="text-center py-4">
                <div className="text-gray-400 text-sm">No recent payments</div>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Server Status</span>
                <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Online</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Database</span>
                <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Connected</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last Backup</span>
                <span className="text-xs text-gray-500">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
