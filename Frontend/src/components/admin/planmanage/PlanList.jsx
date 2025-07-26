import React from 'react';

const PlanList = ({ plans, handleEdit, handleDelete }) => (
  <div className="bg-white rounded-lg shadow border border-gray-200">
    <div className="px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">Existing Plans</h3>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Limits</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Features</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {plans.length > 0 ? (
            plans.map((plan) => (
              <tr key={plan._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{plan.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">₹{plan.monthlyPrice}/month</div>
                  {plan.yearlyPrice > 0 && (
                    <div className="text-xs text-gray-500">₹{plan.yearlyPrice}/year</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {plan.limits?.designsPerMonth === -1 ? 'Unlimited' : plan.limits?.designsPerMonth || 'N/A'} saved drafts
                  </div>
                  <div className="text-xs text-gray-500">
                    {plan.limits?.imageUploadsPerDesign === -1 ? 'Unlimited' : plan.limits?.imageUploadsPerDesign || 'N/A'} images per design
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {plan.features?.length > 0 ? plan.features.join(', ') : 'No features'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                    plan.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleEdit(plan)}
                    className="text-orange-600 hover:text-orange-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(plan._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                No plans available. Create your first plan!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default PlanList;
