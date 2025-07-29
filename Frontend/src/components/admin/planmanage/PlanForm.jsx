import React from 'react';

const PlanForm = ({
  formData,
  setFormData,
  handleSubmit,
  handleLimitChange,
  handleBooleanFeatureChange,
  categories,
  editingPlan,
  resetForm,
  setShowForm,
  allDecors
}) => (
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
      {/* Plan Limits */}
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
      {/* Decor Category Limits */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Set Decor Category Limits for this Plan</label>
        <div className="border border-gray-200 rounded-lg p-3 max-h-64 overflow-y-auto bg-gray-50">
          {categories.length === 0 ? (
            <div className="text-gray-500 text-sm">No categories found.</div>
          ) : (
            categories.map(category => {
              const val =
                formData.categoryLimits && Object.prototype.hasOwnProperty.call(formData.categoryLimits, category._id) && formData.categoryLimits[category._id] !== null && formData.categoryLimits[category._id] !== undefined
                  ? String(formData.categoryLimits[category._id])
                  : '';
              return (
                <div key={category._id || category.name} className="mb-3 flex items-center gap-4">
                  <div className="font-semibold text-gray-800 capitalize w-32">{category.name}</div>
                  <input
                    type="number"
                    min="-1"
                    className="border border-orange-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white w-32"
                    placeholder="-1 for unlimited"
                    value={val}
                    onChange={e => {
                      let value = e.target.value;
                      if (value === '') {
                        setFormData(f => ({
                          ...f,
                          categoryLimits: { ...f.categoryLimits, [category._id]: '' }
                        }));
                      } else {
                        value = parseInt(value, 10);
                        if (!isNaN(value) && value >= -1) {
                          setFormData(f => ({
                            ...f,
                            categoryLimits: { ...f.categoryLimits, [category._id]: value }
                          }));
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="ml-2 px-2 py-1 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded text-xs font-medium border border-orange-200"
                    onClick={() => setFormData(f => ({
                      ...f,
                      categoryLimits: { ...f.categoryLimits, [category._id]: -1 }
                    }))}
                  >
                    Select All
                  </button>
                  {val === '-1' && (
                    <span className="text-xs text-green-600 ml-2">Unlimited</span>
                  )}
                </div>
              );
            })
          )}
        </div>
        <div className="text-xs text-gray-500 mt-1">Specify how many items from each decor category are allowed for this plan. Set -1 for unlimited.</div>
      {/* Decor Picker Section */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Decors for this Plan</label>
        <div className="border border-gray-200 rounded-lg p-3 max-h-64 overflow-y-auto bg-gray-50">
          {Array.isArray(allDecors) && allDecors.length > 0 ? (
            allDecors.map(decor => (
              <div key={decor._id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={formData.decors && formData.decors.includes(decor._id)}
                  onChange={e => {
                    if (e.target.checked) {
                      setFormData(f => ({
                        ...f,
                        decors: [...(f.decors || []), decor._id]
                      }));
                    } else {
                      setFormData(f => ({
                        ...f,
                        decors: (f.decors || []).filter(id => id !== decor._id)
                      }));
                    }
                  }}
                  className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <span className="text-gray-800 font-medium mr-2">{decor.name}</span>
                {decor.category && <span className="text-xs text-gray-500">({decor.category})</span>}
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-sm">No decors found.</div>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-1">Check the decors to include in this plan. Leave unchecked to exclude.</div>
      </div>
      </div>
      {/* Custom Features */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Custom Features</label>
        {formData.customFeatures && formData.customFeatures.length > 0 && (
          <ul className="mb-2">
            {formData.customFeatures.map((feature, idx) => (
              <li key={idx} className="flex items-center mb-1">
                <input
                  type="text"
                  value={feature}
                  onChange={e => {
                    const updated = [...formData.customFeatures];
                    updated[idx] = e.target.value;
                    setFormData(f => ({ ...f, customFeatures: updated }));
                  }}
                  className="border border-gray-300 rounded px-2 py-1 mr-2 flex-1"
                  placeholder="Custom feature"
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = formData.customFeatures.filter((_, i) => i !== idx);
                    setFormData(f => ({ ...f, customFeatures: updated }));
                  }}
                  className="text-red-500 hover:text-red-700 px-2"
                  title="Remove feature"
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        )}
        <button
          type="button"
          onClick={() => setFormData(f => ({ ...f, customFeatures: [...(f.customFeatures || []), ''] }))}
          className="bg-orange-100 hover:bg-orange-200 text-orange-700 px-3 py-1 rounded text-sm font-medium border border-orange-200"
        >
          Add Custom Feature
        </button>
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
);

export default PlanForm;
