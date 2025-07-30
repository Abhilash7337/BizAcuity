import React, { useState, useEffect, useCallback } from 'react';
import { authFetch } from '../../../utils/auth';
import PlanForm from './PlanForm';
import PlanList from './PlanList';
import DeleteModal from './DeleteModal';
import { predefinedFeatures } from './utils';

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
    customFeatures: [],
    limits: {
      designsPerMonth: 1,
      imageUploadsPerDesign: 3
    },
    booleanFeatures: {
      prioritySupport: false,
      commercialLicense: false,
      advancedTemplates: false,
      customFonts: false,
      teamCollaboration: false,
      watermarkRemoval: false
    },
    isActive: true,
    exportDrafts: false,
    categoryLimits: {},
  });
  const [allDecors, setAllDecors] = useState([]);
  const [categories, setCategories] = useState([]);

  const handleEdit = useCallback((plan) => {
    setEditingPlan(plan);
    const booleanFeatures = {
      prioritySupport: plan.features?.includes('24/7 Priority Support') || plan.features?.includes('Priority Support') || false,
      commercialLicense: plan.features?.includes('Commercial Usage License') || plan.features?.includes('Commercial License') || false,
      advancedTemplates: plan.features?.includes('Premium Design Templates') || plan.features?.includes('Advanced Templates') || false,
      customFonts: plan.features?.includes('Custom Font Upload') || plan.features?.includes('Custom Fonts') || false,
      teamCollaboration: plan.features?.includes('Team Collaboration Tools') || plan.features?.includes('Team Collaboration') || false,
      watermarkRemoval: plan.features?.includes('Remove Watermark') || false
    };
    const customFeatures = (plan.features || []).filter(f => !predefinedFeatures.includes(f));
    let categoryLimits = {};
    if (plan.categoryLimits && typeof plan.categoryLimits === 'object' && Object.keys(plan.categoryLimits).length > 0) {
      categoryLimits = {};
      Object.entries(plan.categoryLimits).forEach(([catId, value]) => {
        categoryLimits[catId] = value === null || value === undefined ? '' : String(value);
      });
    } else if (plan.decors && Array.isArray(plan.decors)) {
      if (Array.isArray(allDecors) && allDecors.length > 0) {
        allDecors.forEach(decor => {
          if (plan.decors.includes(decor._id)) {
            let catId = decor.categoryId || decor.category_id || decor.category?._id;
            if (!catId && decor.category && Array.isArray(categories)) {
              const catObj = categories.find(c => c.name === decor.category);
              if (catObj) catId = catObj._id;
            }
            if (catId && /^[a-fA-F0-9]{24}$/.test(catId)) {
              categoryLimits[catId] = (categoryLimits[catId] || 0) + 1;
            }
          }
        });
      }
    } else {
      categoryLimits = {};
    }
    if (Array.isArray(categories) && categories.length > 0) {
      categories.forEach(cat => {
        if (!Object.prototype.hasOwnProperty.call(categoryLimits, cat._id)) {
          categoryLimits[cat._id] = '';
        }
      });
    }
    setFormData({
      ...plan,
      limits: {
        designsPerMonth: plan.limits?.designsPerMonth || 1,
        imageUploadsPerDesign: plan.limits?.imageUploadsPerDesign || 3
      },
      booleanFeatures,
      customFeatures,
      exportDrafts: plan.exportDrafts === true,
      categoryLimits,
      decors: Array.isArray(plan.decors) ? plan.decors.filter(d => typeof d === 'string' && /^[a-fA-F0-9]{24}$/.test(d)) : []
    });
    setShowForm(true);
  }, [allDecors, categories]);

  useEffect(() => {
    fetchPlans();
    fetchAllDecors();
    fetchCategories();
  }, []);

  // When building categoryLimits and decors, always use _id
  const fetchAllDecors = async () => {
    try {
      const response = await authFetch('/decors');
      const data = await response.json();
      if (response.ok) {
        setAllDecors(data);
      } else {
        setAllDecors([]);
      }
    } catch (e) {
      setAllDecors([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await authFetch('/categories');
      const data = await response.json();
      if (response.ok) {
        setCategories(data);
      } else {
        setCategories([]);
      }
    } catch (e) {
      setCategories([]);
    }
  };

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError('');
      let response = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/admin/plans`);
      if (!response.ok) {
        response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/plans`);
      }
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch plans: ${response.status} ${errorText}`);
      }
      const data = await response.json();
      if (data.plans) {
        setPlans(data.plans);
      } else if (Array.isArray(data)) {
        setPlans(data);
      } else {
        setPlans([]);
      }
    } catch (error) {
      setError('Failed to load subscription plans: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const featuresList = [];
      if (formData.booleanFeatures.prioritySupport) featuresList.push('24/7 Priority Support');
      if (formData.booleanFeatures.commercialLicense) featuresList.push('Commercial Usage License');
      if (formData.booleanFeatures.advancedTemplates) featuresList.push('Premium Design Templates');
      if (formData.booleanFeatures.customFonts) featuresList.push('Custom Font Upload');
      if (formData.booleanFeatures.teamCollaboration) featuresList.push('Team Collaboration Tools');
      if (formData.booleanFeatures.watermarkRemoval) featuresList.push('Remove Watermark');
      if (formData.customFeatures && Array.isArray(formData.customFeatures)) {
        featuresList.push(...formData.customFeatures.filter(f => f && f.trim() !== ''));
      }
      // Clean categoryLimits: handle all valid inputs including empty strings
      const cleanedCategoryLimits = {};
      Object.entries(formData.categoryLimits || {}).forEach(([catId, value]) => {
        if (/^[a-fA-F0-9]{24}$/.test(catId)) {
          if (typeof value === 'number' && !isNaN(value)) {
            cleanedCategoryLimits[catId] = value;
          } else if (value === '-1' || value === -1) {
            cleanedCategoryLimits[catId] = -1;
          } else if (value === '' || value === undefined || value === null) {
            cleanedCategoryLimits[catId] = 0;
          } else {
            const parsedValue = parseInt(value, 10);
            cleanedCategoryLimits[catId] = isNaN(parsedValue) ? 0 : parsedValue;
          }
        }
      });
      const cleanedDecors = Array.isArray(formData.decors) ? formData.decors.filter(d => typeof d === 'string' && /^[a-fA-F0-9]{24}$/.test(d)) : [];
      const submitData = {
        ...formData,
        features: featuresList,
        limits: formData.limits,
        exportDrafts: formData.exportDrafts,
        decors: cleanedDecors,
        categoryLimits: cleanedCategoryLimits
      };
      delete submitData.booleanFeatures;
      delete submitData.customFeatures;
      // Debug log: confirm outgoing payload
      console.log('Submitting plan data:', submitData);
      const url = editingPlan 
        ? `${import.meta.env.VITE_API_BASE_URL}/admin/plans/${editingPlan._id}`
        : `${import.meta.env.VITE_API_BASE_URL}/admin/plans`;
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
      const response = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/admin/plans/${planToDelete}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete plan');
      fetchPlans();
      setShowDeleteModal(false);
      setPlanToDelete(null);
    } catch (error) {
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
      customFeatures: [],
      limits: {
        designsPerMonth: 1,
        imageUploadsPerDesign: 3
      },
      booleanFeatures: {
        prioritySupport: false,
        commercialLicense: false,
        advancedTemplates: false,
        customFonts: false,
        teamCollaboration: false,
        watermarkRemoval: false
      },
      isActive: true,
      exportDrafts: false,
      categoryLimits: {},
    });
    setEditingPlan(null);
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
    <div className="space-y-6 p-2 sm:p-6  max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
        <div className="w-full sm:w-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Plan Management</h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Create and manage subscription plans</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 w-full sm:w-auto"
        >
          Add New Plan
        </button>
      </div>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-2 sm:p-4 rounded-md">
          <p className="text-red-700 text-xs sm:text-base">{error}</p>
        </div>
      )}
      {showForm && (
        <PlanForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          handleLimitChange={handleLimitChange}
          handleBooleanFeatureChange={handleBooleanFeatureChange}
          categories={categories}
          editingPlan={editingPlan}
          resetForm={resetForm}
          setShowForm={setShowForm}
          allDecors={allDecors}
        />
      )}
      <div className="w-full">
        <PlanList plans={plans} handleEdit={handleEdit} handleDelete={handleDelete} />
      </div>
      <DeleteModal show={showDeleteModal} onCancel={cancelDelete} onConfirm={confirmDelete} />
    </div>
  );
};

export default PlanManagement;
