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
  <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-orange-500/20 shadow-xl p-6 animate-slideIn">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
          {editingPlan ? 'Edit Plan' : 'Create New Plan'}
        </h3>
        <p className="text-slate-400 text-sm mt-1">
          {editingPlan ? 'Modify subscription plan details' : 'Set up a new subscription plan for users'}
        </p>
      </div>
      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
    </div>
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Plan Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
            placeholder="Enter plan name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Monthly Price (₹)</label>
          <input
            type="number"
            value={formData.monthlyPrice}
            onChange={(e) => {
              const value = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
              setFormData({ ...formData, monthlyPrice: value });
            }}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Yearly Price (₹)</label>
          <input
            type="number"
            value={formData.yearlyPrice}
            onChange={(e) => {
              const value = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
              setFormData({ ...formData, yearlyPrice: value });
            }}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
          rows="3"
          placeholder="Describe what this plan offers..."
          required
        ></textarea>
      </div>
      {/* Plan Limits */}
      <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/50">
        <h4 className="text-xl font-bold text-white mb-6 flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
            </svg>
          </div>
          Plan Features
        </h4>
        
        {/* Saved Drafts Limit */}
        <div className="mb-6 p-5 bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-xl">
          <label className="block text-sm font-medium text-orange-300 mb-3">
            <span className="flex items-center text-base">
              <svg className="w-5 h-5 text-orange-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
              </svg>
              Saved Drafts Limit
            </span>
            <span className="text-xs text-orange-400/80 ml-8 font-normal">Set -1 for unlimited drafts</span>
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
            className="w-full bg-slate-800/50 border border-orange-500/30 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
            min="-1"
            placeholder="Enter number of drafts allowed"
          />
          <div className="mt-3 text-sm">
            {formData.limits.designsPerMonth === -1 ? (
              <span className="text-green-400 font-medium flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Unlimited drafts allowed
              </span>
            ) : (
              <span className="text-orange-400">
                Users can save up to {formData.limits.designsPerMonth || 0} draft{formData.limits.designsPerMonth !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
        
        {/* Image Upload Limit */}
        <div className="mb-6 p-5 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl">
          <label className="block text-sm font-medium text-blue-300 mb-3">
            <span className="flex items-center text-base">
              <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              Image Upload Limit per Design
            </span>
            <span className="text-xs text-blue-400/80 ml-8 font-normal">Set -1 for unlimited image uploads</span>
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
            className="w-full bg-slate-800/50 border border-blue-500/30 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            min="-1"
            placeholder="Enter number of images allowed per design"
          />
          <div className="mt-3 text-sm">
            {formData.limits.imageUploadsPerDesign === -1 ? (
              <span className="text-green-400 font-medium flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Unlimited image uploads allowed
              </span>
            ) : (
              <span className="text-blue-400">
                Users can upload up to {formData.limits.imageUploadsPerDesign || 0} image{formData.limits.imageUploadsPerDesign !== 1 ? 's' : ''} per design
              </span>
            )}
          </div>
        </div>
        
        {/* Other Features */}
        <div>
          <h5 className="text-lg font-semibold text-white mb-4 flex items-center">
            <svg className="w-5 h-5 text-orange-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Additional Features
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600/50 hover:border-orange-500/50 transition-all duration-300 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.booleanFeatures.prioritySupport}
                onChange={(e) => handleBooleanFeatureChange('prioritySupport', e.target.checked)}
                className="mr-3 h-5 w-5 text-orange-600 focus:ring-orange-500 border-slate-600 rounded bg-slate-700"
              />
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors duration-300">24/7 Priority Support</span>
            </label>
            <label className="flex items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600/50 hover:border-orange-500/50 transition-all duration-300 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.booleanFeatures.commercialLicense}
                onChange={(e) => handleBooleanFeatureChange('commercialLicense', e.target.checked)}
                className="mr-3 h-5 w-5 text-orange-600 focus:ring-orange-500 border-slate-600 rounded bg-slate-700"
              />
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors duration-300">Commercial Usage License</span>
            </label>
            <label className="flex items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600/50 hover:border-orange-500/50 transition-all duration-300 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.booleanFeatures.advancedTemplates}
                onChange={(e) => handleBooleanFeatureChange('advancedTemplates', e.target.checked)}
                className="mr-3 h-5 w-5 text-orange-600 focus:ring-orange-500 border-slate-600 rounded bg-slate-700"
              />
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors duration-300">Premium Design Templates</span>
            </label>
            <label className="flex items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600/50 hover:border-orange-500/50 transition-all duration-300 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.booleanFeatures.customFonts}
                onChange={(e) => handleBooleanFeatureChange('customFonts', e.target.checked)}
                className="mr-3 h-5 w-5 text-orange-600 focus:ring-orange-500 border-slate-600 rounded bg-slate-700"
              />
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors duration-300">Custom Font Upload</span>
            </label>
            <label className="flex items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600/50 hover:border-orange-500/50 transition-all duration-300 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.booleanFeatures.teamCollaboration}
                onChange={(e) => handleBooleanFeatureChange('teamCollaboration', e.target.checked)}
                className="mr-3 h-5 w-5 text-orange-600 focus:ring-orange-500 border-slate-600 rounded bg-slate-700"
              />
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors duration-300">Team Collaboration Tools</span>
            </label>
            <label className="flex items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600/50 hover:border-orange-500/50 transition-all duration-300 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.booleanFeatures.watermarkRemoval}
                onChange={(e) => handleBooleanFeatureChange('watermarkRemoval', e.target.checked)}
                className="mr-3 h-5 w-5 text-orange-600 focus:ring-orange-500 border-slate-600 rounded bg-slate-700"
              />
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors duration-300">Remove Watermark</span>
            </label>
            <label className="flex items-center p-3 bg-slate-800/50 rounded-lg border border-slate-600/50 hover:border-green-500/50 transition-all duration-300 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.exportDrafts}
                onChange={(e) => setFormData({ ...formData, exportDrafts: e.target.checked })}
                className="mr-3 h-5 w-5 text-green-600 focus:ring-green-500 border-slate-600 rounded bg-slate-700"
              />
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors duration-300 flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Drafts
              </span>
            </label>
          </div>
        </div>
      </div>
      {/* Decor Category Limits */}
      <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/50">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <div>
            <h5 className="text-lg font-semibold text-white">Decor Category Limits</h5>
            <p className="text-slate-400 text-sm">Set specific limits for each decor category</p>
          </div>
        </div>
        
        <div className="bg-slate-800/50 border border-slate-600/50 rounded-xl p-4 max-h-80 overflow-y-auto custom-scrollbar">
          {categories.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <p className="text-slate-400">No categories found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((category, index) => {
                const val =
                  formData.categoryLimits && Object.prototype.hasOwnProperty.call(formData.categoryLimits, category._id) && formData.categoryLimits[category._id] !== null && formData.categoryLimits[category._id] !== undefined
                    ? String(formData.categoryLimits[category._id])
                    : '';
                return (
                  <div 
                    key={category._id || category.name} 
                    className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50 hover:border-purple-500/50 transition-all duration-300 animate-slideIn"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="font-semibold text-white capitalize min-w-32 flex items-center">
                        <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                        {category.name}
                      </div>
                      <input
                        type="number"
                        min="-1"
                        className="bg-slate-800/50 border border-purple-500/30 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-400 w-36 transition-all duration-300"
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
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="px-3 py-1 bg-slate-600/50 hover:bg-slate-500/50 text-slate-300 hover:text-white rounded-lg text-sm font-medium border border-slate-500/50 hover:border-slate-400/50 transition-all duration-300"
                          onClick={() => setFormData(f => {
                            const updated = { ...f.categoryLimits };
                            delete updated[category._id];
                            return { ...f, categoryLimits: updated };
                          })}
                        >
                          Remove
                        </button>
                        <button
                          type="button"
                          className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 hover:text-purple-200 rounded-lg text-sm font-medium border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300"
                          onClick={() => setFormData(f => ({
                            ...f,
                            categoryLimits: { ...f.categoryLimits, [category._id]: -1 }
                          }))}
                        >
                          Unlimited
                        </button>
                      </div>
                      <div className="flex-1 min-w-20">
                        {val === '-1' && (
                          <span className="text-sm text-green-400 font-medium flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Unlimited
                          </span>
                        )}
                        {val === '' && (
                          <span className="text-sm text-red-400 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Blocked
                          </span>
                        )}
                        {val !== '' && val !== '-1' && (
                          <span className="text-sm text-blue-400">
                            {val} item{val !== '1' ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="text-sm text-slate-400 mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-600/50">
          <div className="flex items-start">
            <svg className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>Specify how many items from each decor category are allowed for this plan. Set -1 for unlimited access.</span>
          </div>
        </div>
      </div>
      {/* Custom Features */}
      <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/50">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </div>
          <div>
            <h5 className="text-lg font-semibold text-white">Custom Features</h5>
            <p className="text-slate-400 text-sm">Add unique features specific to this plan</p>
          </div>
        </div>
        
        {formData.customFeatures && formData.customFeatures.length > 0 && (
          <div className="space-y-3 mb-4">
            {formData.customFeatures.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-600/50 animate-slideIn">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <input
                  type="text"
                  value={feature}
                  onChange={e => {
                    const updated = [...formData.customFeatures];
                    updated[idx] = e.target.value;
                    setFormData(f => ({ ...f, customFeatures: updated }));
                  }}
                  className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 flex-1"
                  placeholder="Enter custom feature description"
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = formData.customFeatures.filter((_, i) => i !== idx);
                    setFormData(f => ({ ...f, customFeatures: updated }));
                  }}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/20 p-2 rounded-lg transition-all duration-300 transform hover:scale-105"
                  title="Remove feature"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
        
        <button
          type="button"
          onClick={() => setFormData(f => ({ ...f, customFeatures: [...(f.customFeatures || []), ''] }))}
          className="w-full bg-gradient-to-r from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30 border border-green-500/30 hover:border-green-400/50 text-green-300 hover:text-green-200 px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 group"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Custom Feature
        </button>
      </div>
      
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          {editingPlan ? 'Update Plan' : 'Create Plan'}
        </button>
        <button
          type="button"
          onClick={() => {
            setShowForm(false);
            resetForm();
          }}
          className="px-6 py-3 bg-slate-600/50 hover:bg-slate-500/50 text-slate-300 hover:text-white rounded-xl font-medium transition-all duration-300 border border-slate-500/50 hover:border-slate-400/50 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Cancel
        </button>
      </div>
    </form>
  </div>
);

export default PlanForm;
