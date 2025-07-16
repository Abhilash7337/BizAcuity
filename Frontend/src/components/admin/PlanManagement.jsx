import React, { useState, useEffect } from 'react';
import { authFetch } from '../../utils/auth';

const PlanManagement = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: '',
    features: [],
    limits: {
      designsPerMonth: 1,
      imageUploadsPerDesign: 3,
      exportResolution: 'HD',
      storageGB: 1,
      supportLevel: 'basic'
    },
    booleanFeatures: {
      prioritySupport: false,
      commercialLicense: false,
      advancedTemplates: false,
      customFonts: false,
      teamCollaboration: false,
      watermarkRemoval: false
    },
    isActive: true
  });

  // Fetch plans on component mount
  useEffect(() => {
    fetchPlans();
  }, []);

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
      if (formData.booleanFeatures.prioritySupport) featuresList.push('24/7 Priority Support');
      if (formData.booleanFeatures.commercialLicense) featuresList.push('Commercial Usage License');
      if (formData.booleanFeatures.advancedTemplates) featuresList.push('Premium Design Templates');
      if (formData.booleanFeatures.customFonts) featuresList.push('Custom Font Upload');
      if (formData.booleanFeatures.teamCollaboration) featuresList.push('Team Collaboration Tools');
      if (formData.booleanFeatures.watermarkRemoval) featuresList.push('Remove Watermark');

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
    setPlanToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!planToDelete) return;

    try {
      const response = await authFetch(`http://localhost:5001/admin/plans/${planToDelete}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete plan');

      fetchPlans();
      setShowDeleteModal(false);
      setPlanToDelete(null);
    } catch (error) {
      console.error('Delete plan error:', error);
      setError('Failed to delete plan');
      setShowDeleteModal(false);
      setPlanToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setPlanToDelete(null);
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
        imageUploadsPerDesign: 3,
        exportResolution: 'HD',
        storageGB: 1,
        supportLevel: 'basic'
      },
      booleanFeatures: {
        prioritySupport: false,
        commercialLicense: false,
        advancedTemplates: false,
        customFonts: false,
        teamCollaboration: false,
        watermarkRemoval: false
      },
      isActive: true
    });
    setEditingPlan(null);
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    
    // Convert features array back to boolean flags
    const booleanFeatures = {
      prioritySupport: plan.features?.includes('24/7 Priority Support') || plan.features?.includes('Priority Support') || false,
      commercialLicense: plan.features?.includes('Commercial Usage License') || plan.features?.includes('Commercial License') || false,
      advancedTemplates: plan.features?.includes('Premium Design Templates') || plan.features?.includes('Advanced Templates') || false,
      customFonts: plan.features?.includes('Custom Font Upload') || plan.features?.includes('Custom Fonts') || false,
      teamCollaboration: plan.features?.includes('Team Collaboration Tools') || plan.features?.includes('Team Collaboration') || false,
      watermarkRemoval: plan.features?.includes('Remove Watermark') || false
    };

    setFormData({
      ...plan,
      limits: {
        designsPerMonth: plan.limits?.designsPerMonth || 1,
        imageUploadsPerDesign: plan.limits?.imageUploadsPerDesign || 3,
        exportResolution: plan.limits?.exportResolution || 'HD',
        storageGB: plan.limits?.storageGB || 1,
        supportLevel: plan.limits?.supportLevel || 'basic'
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Price (₹)</label>
                <input
                  type="number"
                  value={formData.monthlyPrice}
                  onChange={(e) => {
                    const value = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                    setFormData({ ...formData, monthlyPrice: value });
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Yearly Price (₹)</label>
                <input
                  type="number"
                  value={formData.yearlyPrice}
                  onChange={(e) => {
                    const value = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                    setFormData({ ...formData, yearlyPrice: value });
                  }}
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

            {/* Plan Limits - REMOVED Technical Limits section here */}

            {/* Predefined Features */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Plan Features</h4>
              
              {/* Saved Drafts Limit */}
              <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 text-orange-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                    </svg>
                    Saved Drafts Limit
                  </span>
                  <span className="text-xs text-gray-500 ml-6">Set -1 for unlimited drafts</span>
                </label>
                <input
                  type="number"
                  value={formData.limits.designsPerMonth === null || formData.limits.designsPerMonth === undefined ? '' : formData.limits.designsPerMonth}
                  onChange={(e) => {
                    // Allow empty string for controlled input, and allow -1
                    let value = e.target.value;
                    if (value === '') {
                      handleLimitChange('designsPerMonth', '');
                    } else {
                      value = parseInt(value, 10);
                      if (!isNaN(value) && (value >= -1)) {
                        handleLimitChange('designsPerMonth', value);
                      }
                    }
                  }}
                  className="w-full border border-orange-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  min="-1"
                  placeholder="Enter number of drafts allowed"
                />
                <div className="mt-2 text-xs text-gray-600">
                  {formData.limits.designsPerMonth === -1 ? (
                    <span className="text-green-600 font-medium">✓ Unlimited drafts allowed</span>
                  ) : (
                    <span className="text-orange-600">
                      Users can save up to {formData.limits.designsPerMonth || 0} draft{formData.limits.designsPerMonth !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>

              {/* Image Upload Limit */}
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    Image Upload Limit per Design
                  </span>
                  <span className="text-xs text-gray-500 ml-6">Set -1 for unlimited image uploads</span>
                </label>
                <input
                  type="number"
                  value={formData.limits.imageUploadsPerDesign === null || formData.limits.imageUploadsPerDesign === undefined ? '' : formData.limits.imageUploadsPerDesign}
                  onChange={(e) => {
                    // Allow empty string for controlled input, and allow -1
                    let value = e.target.value;
                    if (value === '') {
                      handleLimitChange('imageUploadsPerDesign', '');
                    } else {
                      value = parseInt(value, 10);
                      if (!isNaN(value) && (value >= -1)) {
                        handleLimitChange('imageUploadsPerDesign', value);
                      }
                    }
                  }}
                  className="w-full border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  min="-1"
                  placeholder="Enter number of images allowed per design"
                />
                <div className="mt-2 text-xs text-gray-600">
                  {formData.limits.imageUploadsPerDesign === -1 ? (
                    <span className="text-green-600 font-medium">✓ Unlimited image uploads allowed</span>
                  ) : (
                    <span className="text-blue-600">
                      Users can upload up to {formData.limits.imageUploadsPerDesign || 0} image{formData.limits.imageUploadsPerDesign !== 1 ? 's' : ''} per design
                    </span>
                  )}
                </div>
              </div>

              {/* Other Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.booleanFeatures.prioritySupport}
                    onChange={(e) => handleBooleanFeatureChange('prioritySupport', e.target.checked)}
                    className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">24/7 Priority Support</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.booleanFeatures.commercialLicense}
                    onChange={(e) => handleBooleanFeatureChange('commercialLicense', e.target.checked)}
                    className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Commercial Usage License</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.booleanFeatures.advancedTemplates}
                    onChange={(e) => handleBooleanFeatureChange('advancedTemplates', e.target.checked)}
                    className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Premium Design Templates</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.booleanFeatures.customFonts}
                    onChange={(e) => handleBooleanFeatureChange('customFonts', e.target.checked)}
                    className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Custom Font Upload</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.booleanFeatures.teamCollaboration}
                    onChange={(e) => handleBooleanFeatureChange('teamCollaboration', e.target.checked)}
                    className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Team Collaboration Tools</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.booleanFeatures.watermarkRemoval}
                    onChange={(e) => handleBooleanFeatureChange('watermarkRemoval', e.target.checked)}
                    className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Remove Watermark</span>
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

      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl transform transition-all">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Delete Plan</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700">
                Are you sure you want to delete this subscription plan? All users currently subscribed to this plan will be affected.
              </p>
            </div>
            
            <div className="flex space-x-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanManagement;
