import React, { useState, useEffect } from 'react';
import { authFetch } from '../../utils/auth';

const PlanManagement = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: '',
    features: [],
    limits: {
      designsPerMonth: 1,
      exportResolution: 'HD',
      storageGB: 1,
      supportLevel: 'basic'
    },
    booleanFeatures: {
      prioritySupport: false,
      commercialLicense: false,
      advancedTemplates: false,
      customFonts: false,
      teamCollaboration: false
    },
    isActive: true
  });

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching plans from:', 'http://localhost:5001/admin/plans');
      
      // Try admin endpoint first
      let response = await authFetch('http://localhost:5001/admin/plans');
      console.log('Admin response status:', response.status);
      
      // If admin endpoint fails due to auth, try public endpoint for testing
      if (!response.ok) {
        console.log('Admin endpoint failed, trying public endpoint...');
        response = await fetch('http://localhost:5001/api/plans');
        console.log('Public response status:', response.status);
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        throw new Error(`Failed to fetch plans: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Plans data received:', data);
      
      // Handle different response formats (admin vs public)
      if (data.plans) {
        setPlans(data.plans);
      } else if (Array.isArray(data)) {
        setPlans(data);
      } else {
        setPlans([]);
      }
    } catch (error) {
      console.error('Fetch plans error:', error);
      setError('Failed to load subscription plans: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert boolean features to feature array
      const featuresList = [];
      if (formData.booleanFeatures.prioritySupport) featuresList.push('Priority Support');
      if (formData.booleanFeatures.commercialLicense) featuresList.push('Commercial License');
      if (formData.booleanFeatures.advancedTemplates) featuresList.push('Advanced Templates');
      if (formData.booleanFeatures.customFonts) featuresList.push('Custom Fonts');
      if (formData.booleanFeatures.teamCollaboration) featuresList.push('Team Collaboration');

      const submitData = {
        ...formData,
        features: featuresList,
        limits: formData.limits
      };
      delete submitData.booleanFeatures;

      const url = editingPlan 
        ? `http://localhost:5001/admin/plans/${editingPlan._id}`
        : 'http://localhost:5001/admin/plans';
      
      const method = editingPlan ? 'PUT' : 'POST';
      
      const response = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) throw new Error(`Failed to ${editingPlan ? 'update' : 'create'} plan`);

      fetchPlans();
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Submit plan error:', error);
      setError(`Failed to ${editingPlan ? 'update' : 'create'} plan`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;

    try {
      const response = await authFetch(`http://localhost:5001/admin/plans/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete plan');

      fetchPlans();
    } catch (error) {
      console.error('Delete plan error:', error);
      setError('Failed to delete plan');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: '',
      features: [],
      limits: {
        designsPerMonth: 1,
        exportResolution: 'HD',
        storageGB: 1,
        supportLevel: 'basic'
      },
      booleanFeatures: {
        prioritySupport: false,
        commercialLicense: false,
        advancedTemplates: false,
        customFonts: false,
        teamCollaboration: false
      },
      isActive: true
    });
    setEditingPlan(null);
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    
    // Convert features array back to boolean flags
    const booleanFeatures = {
      prioritySupport: plan.features?.includes('Priority Support') || false,
      commercialLicense: plan.features?.includes('Commercial License') || false,
      advancedTemplates: plan.features?.includes('Advanced Templates') || false,
      customFonts: plan.features?.includes('Custom Fonts') || false,
      teamCollaboration: plan.features?.includes('Team Collaboration') || false
    };

    setFormData({
      ...plan,
      limits: plan.limits || {
        designsPerMonth: 1,
        exportResolution: 'HD',
        storageGB: 1,
        supportLevel: 'basic'
      },
      booleanFeatures
    });
    setShowForm(true);
  };

  const handleLimitChange = (limitName, value) => {
    setFormData(prev => ({
      ...prev,
      limits: {
        ...prev.limits,
        [limitName]: value
      }
    }));
  };

  const handleBooleanFeatureChange = (featureName, value) => {
    setFormData(prev => ({
      ...prev,
      booleanFeatures: {
        ...prev.booleanFeatures,
        [featureName]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading subscription plans...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Plan Management</h2>
          <p className="text-gray-600 mt-1">Create and manage subscription plans</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          Add New Plan
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Create/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingPlan ? 'Edit Plan' : 'Create New Plan'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Plan Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Price ($)</label>
                <input
                  type="number"
                  value={formData.monthlyPrice}
                  onChange={(e) => setFormData({ ...formData, monthlyPrice: parseFloat(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Yearly Price ($)</label>
                <input
                  type="number"
                  value={formData.yearlyPrice}
                  onChange={(e) => setFormData({ ...formData, yearlyPrice: parseFloat(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows="3"
                required
              ></textarea>
            </div>

            {/* Plan Limits */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Plan Limits</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Designs Per Month
                    <span className="text-xs text-gray-500 ml-1">(-1 for unlimited)</span>
                  </label>
                  <input
                    type="number"
                    value={formData.limits.designsPerMonth}
                    onChange={(e) => handleLimitChange('designsPerMonth', parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    min="-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Export Resolution</label>
                  <select
                    value={formData.limits.exportResolution}
                    onChange={(e) => handleLimitChange('exportResolution', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="SD">SD (480p)</option>
                    <option value="HD">HD (720p)</option>
                    <option value="FHD">Full HD (1080p)</option>
                    <option value="4K">4K (2160p)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Storage (GB)</label>
                  <input
                    type="number"
                    value={formData.limits.storageGB}
                    onChange={(e) => handleLimitChange('storageGB', parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Support Level</label>
                  <select
                    value={formData.limits.supportLevel}
                    onChange={(e) => handleLimitChange('supportLevel', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="basic">Basic Support</option>
                    <option value="priority">Priority Support</option>
                    <option value="premium">Premium Support</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Boolean Features */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Additional Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.booleanFeatures.prioritySupport}
                    onChange={(e) => handleBooleanFeatureChange('prioritySupport', e.target.checked)}
                    className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Priority Support</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.booleanFeatures.commercialLicense}
                    onChange={(e) => handleBooleanFeatureChange('commercialLicense', e.target.checked)}
                    className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Commercial License</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.booleanFeatures.advancedTemplates}
                    onChange={(e) => handleBooleanFeatureChange('advancedTemplates', e.target.checked)}
                    className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Advanced Templates</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.booleanFeatures.customFonts}
                    onChange={(e) => handleBooleanFeatureChange('customFonts', e.target.checked)}
                    className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Custom Fonts</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.booleanFeatures.teamCollaboration}
                    onChange={(e) => handleBooleanFeatureChange('teamCollaboration', e.target.checked)}
                    className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Team Collaboration</span>
                </label>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">Active Plan</label>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                {editingPlan ? 'Update Plan' : 'Create Plan'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Plans List */}
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
                      <div className="text-sm text-gray-900">${plan.monthlyPrice}/month</div>
                      {plan.yearlyPrice > 0 && (
                        <div className="text-xs text-gray-500">${plan.yearlyPrice}/year</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {plan.limits?.designsPerMonth === -1 ? 'Unlimited' : plan.limits?.designsPerMonth || 'N/A'} designs
                      </div>
                      <div className="text-xs text-gray-500">
                        {plan.limits?.exportResolution || 'HD'} • {plan.limits?.storageGB || 1}GB storage
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
    </div>
  );
};

export default PlanManagement;
