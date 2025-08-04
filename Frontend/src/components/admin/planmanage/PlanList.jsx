import React from 'react';

const PlanList = ({ plans, handleEdit, handleDelete }) => (
  <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-orange-500/20 shadow-xl overflow-hidden">
    <div className="px-6 py-4 border-b border-slate-700/50 bg-slate-700/30">
      <h3 className="text-lg font-bold text-white">Existing Plans</h3>
      <p className="text-slate-400 text-sm mt-1">Manage your subscription plans</p>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-700/50">
        <thead className="bg-slate-700/50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Limits</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Features</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-slate-800/30 divide-y divide-slate-700/50">
          {plans.length > 0 ? (
            plans.map((plan, index) => (
              <tr 
                key={plan._id} 
                className="hover:bg-slate-700/30 transition-all duration-300 animate-slideIn"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-white">{plan.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-orange-400 font-semibold">₹{plan.monthlyPrice}/month</div>
                  {plan.yearlyPrice > 0 && (
                    <div className="text-xs text-slate-400">₹{plan.yearlyPrice}/year</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-200">
                    {plan.limits?.designsPerMonth === -1 ? 'Unlimited' : plan.limits?.designsPerMonth || 'N/A'} saved drafts
                  </div>
                  <div className="text-xs text-slate-400">
                    {plan.limits?.imageUploadsPerDesign === -1 ? 'Unlimited' : plan.limits?.imageUploadsPerDesign || 'N/A'} images per design
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-300 max-w-xs">
                    {/* Export Drafts Status */}
                    {plan.exportDrafts && (
                      <div className="mb-2">
                        <span className="inline-block bg-green-500/20 text-green-300 px-2 py-1 rounded-lg text-xs border border-green-500/30 flex items-center w-fit">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Export Drafts
                        </span>
                      </div>
                    )}
                    
                    {/* Other Features */}
                    {plan.features?.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {plan.features.slice(0, 2).map((feature, idx) => (
                          <span key={idx} className="inline-block bg-slate-700/50 text-orange-300 px-2 py-1 rounded-lg text-xs">
                            {feature}
                          </span>
                        ))}
                        {plan.features.length > 2 && (
                          <span className="inline-block bg-slate-600/50 text-slate-400 px-2 py-1 rounded-lg text-xs">
                            +{plan.features.length - 2} more
                          </span>
                        )}
                      </div>
                    ) : (
                      !plan.exportDrafts && <span className="text-slate-500 text-xs">No features</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full transition-all duration-300 ${
                    plan.isActive 
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(plan)}
                      className="text-orange-400 hover:text-orange-300 font-medium px-3 py-1 rounded-lg hover:bg-orange-500/20 transition-all duration-300 transform hover:scale-105"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(plan._id)}
                      className="text-red-400 hover:text-red-300 font-medium px-3 py-1 rounded-lg hover:bg-red-500/20 transition-all duration-300 transform hover:scale-105"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-6 py-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">No plans available</h3>
                    <p className="text-slate-400">Create your first subscription plan to get started!</p>
                  </div>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default PlanList;
