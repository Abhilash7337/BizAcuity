import React from 'react';

const PaymentsManagement = ({ 
  payments, 
  filters, 
  setFilters, 
  fetchPayments, 
  pagination, 
  formatDate, 
  formatCurrency 
}) => {
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          value={filters.paymentStatus}
          onChange={(e) => setFilters({...filters, paymentStatus: e.target.value})}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
        <select
          value={filters.paymentPlan}
          onChange={(e) => setFilters({...filters, paymentPlan: e.target.value})}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Plans</option>
          <option value="regular">Regular</option>
          <option value="pro">Pro</option>
        </select>
      </div>

      <button
        onClick={() => fetchPayments()}
        className="px-4 py-2 bg-primary-dark text-white rounded-lg hover:bg-primary transition"
      >
        Filter Payments
      </button>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{payment.userId?.name}</div>
                    <div className="text-sm text-gray-500">{payment.userId?.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(payment.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    payment.plan === 'pro' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {payment.plan}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                    payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                    payment.status === 'refunded' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(payment.paymentDate)}
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
              onClick={() => fetchPayments(pagination.currentPage - 1)}
              disabled={!pagination.hasPrev}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => fetchPayments(pagination.currentPage + 1)}
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

export default PaymentsManagement;
