import React, { useState, useEffect } from 'react';
import { Filter, Plus, Edit, Trash2, X } from 'lucide-react';
import { authFetch } from '../../utils/auth';

const DecorManagement = () => {
  const [decors, setDecors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDecor, setEditingDecor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    image: null
  });
  const [categories, setCategories] = useState([]);
  const [categoryNumbers, setCategoryNumbers] = useState({});
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState('');

  useEffect(() => {
    fetchDecors();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setCategoryLoading(true);
      setCategoryError('');
      const response = await authFetch('/categories');
      const data = await response.json();
      if (response.ok) {
        setCategories(data);
        // Set default for form
        if (data.length > 0 && !formData.category) {
          setFormData(f => ({ ...f, category: data[0].name }));
        }
        // Load numbers for each category (default to -1 if not present)
        const numbers = {};
        data.forEach(cat => {
          numbers[cat.name] = typeof cat.number === 'number' ? cat.number : -1;
        });
        setCategoryNumbers(numbers);
      } else {
        setCategoryError(data.error || 'Failed to fetch categories');
      }
    } catch (error) {
      setCategoryError('Failed to fetch categories');
    } finally {
      setCategoryLoading(false);
    }
  };

  const fetchDecors = async () => {
    try {
      setLoading(true);
      const response = await authFetch('/decors');
      const data = await response.json();
      
      if (response.ok) {
        setDecors(data);
      } else {
        console.error('Failed to fetch decors:', data.error);
      }
    } catch (error) {
      console.error('Error fetching decors:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerDecorRefresh = () => {
    // Trigger refresh in DecorsPanel
    window.dispatchEvent(new CustomEvent('refreshDecors'));
    // Also use localStorage for cross-tab communication
    localStorage.setItem('refreshDecors', Date.now().toString());
    setTimeout(() => localStorage.removeItem('refreshDecors'), 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🎯 Admin: Starting decor submit...');
    console.log('🎯 Form data:', formData);
    console.log('🎯 Image file:', formData.image);
    
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('category', formData.category);
      submitData.append('description', formData.description);
      
      if (formData.image) {
        submitData.append('image', formData.image);
        console.log('🎯 Image appended to FormData');
      } else {
        console.log('❌ No image in form data!');
      }

      const url = editingDecor 
        ? `/admin/decors/${editingDecor._id}` 
        : '/admin/decors';
      const method = editingDecor ? 'PUT' : 'POST';
      
      console.log('🎯 Making request to:', url, 'with method:', method);

      const response = await authFetch(url, {
        method,
        body: submitData
      });
      
      console.log('🎯 Response status:', response.status);

      const data = await response.json();
      console.log('🎯 Response data:', data);

      if (response.ok) {
        if (editingDecor) {
          setDecors(decors.map(d => d._id === editingDecor._id ? data : d));
        } else {
          setDecors([...decors, data]);
        }
        resetForm();
        triggerDecorRefresh(); // Refresh the main decor panel
        alert('Decor saved successfully!');
      } else {
        console.error('Failed to save decor:', data.error);
        alert(data.error || 'Failed to save decor');
      }
    } catch (error) {
      console.error('Error saving decor:', error);
      alert('Failed to save decor');
    }
  };

  const handleDelete = async (decorId) => {
    if (!confirm('Are you sure you want to delete this decor?')) {
      return;
    }

    try {
      const response = await authFetch(`/admin/decors/${decorId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setDecors(decors.filter(d => d._id !== decorId));
        triggerDecorRefresh(); // Refresh the main decor panel
        alert('Decor deleted successfully!');
      } else {
        const data = await response.json();
        console.error('Failed to delete decor:', data.error);
        alert(data.error || 'Failed to delete decor');
      }
    } catch (error) {
      console.error('Error deleting decor:', error);
      alert('Failed to delete decor');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'clocks',
      description: '',
      image: null
    });
    setIsAddModalOpen(false);
    setEditingDecor(null);
  };

  const openEditModal = (decor) => {
    setEditingDecor(decor);
    setFormData({
      name: decor.name,
      category: decor.category,
      description: decor.description || '',
      image: null
    });
    setIsAddModalOpen(true);
  };

  const filteredDecors = selectedCategory === 'all' 
    ? decors 
    : decors.filter(decor => decor.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Decor Management</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <Plus size={20} />
            Add Category
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2"
          >
            <Plus size={20} />
            Add New Decor
          </button>
        </div>
      </div>

      {/* Category Filter with number input */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <Filter size={20} className="text-gray-600" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <span className="text-gray-600">
            {filteredDecors.length} decor{filteredDecors.length !== 1 ? 's' : ''}
          </span>
        </div>
        {/* Show number input for each category */}
        <div className="flex flex-wrap gap-4 items-center mt-2">
          {categories.map(category => (
            <div key={category._id} className="flex items-center gap-2 bg-orange-50 px-2 py-1 rounded">
              <span className="capitalize text-gray-700">{category.name}:</span>
              <input
                type="number"
                className="w-16 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={categoryNumbers[category.name] ?? -1}
                onChange={async (e) => {
                  const value = parseInt(e.target.value, 10);
                  setCategoryNumbers({ ...categoryNumbers, [category.name]: value });
                  // Optionally, update on server
                  await authFetch(`/admin/categories/${category._id}/number`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ number: value })
                  });
                }}
                min={-1}
              />
              <button
                className="text-xs text-orange-600 underline ml-1"
                title="Set all decors in this category to -1"
                onClick={async () => {
                  if (!window.confirm(`Set all decors in '${category.name}' to -1?`)) return;
                  // Update all decors in this category to -1 (API call)
                  await authFetch(`/admin/decors/category/${category.name}/set-all-minus-one`, {
                    method: 'PUT',
                  });
                  fetchDecors();
                }}
              >Set all -1</button>
            </div>
          ))}
        </div>
      </div>

      {/* Decors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDecors.map(decor => (
          <div key={decor._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-100 flex items-center justify-center">
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}${decor.imageUrl}`}
                alt={decor.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-1">{decor.name}</h3>
              <p className="text-sm text-orange-600 mb-2 capitalize">{decor.category}</p>
              {decor.description && (
                <p className="text-sm text-gray-600 mb-3">{decor.description}</p>
              )}
              <div className="flex justify-between items-center">
                <button
                  onClick={() => openEditModal(decor)}
                  className="text-orange-500 hover:text-orange-600 p-2"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(decor._id)}
                  className="text-red-500 hover:text-red-600 p-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDecors.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No decors found in this category.
        </div>
      )}

      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {editingDecor ? 'Edit Decor' : 'Add New Decor'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              {/* Category selection removed as per new logic */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image {!editingDecor && <span className="text-red-500">*</span>}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      console.log('🎯 File selected:', file);
                      setFormData({ ...formData, image: file });
                    }}
                    className="w-full"
                    required={!editingDecor}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Upload PNG, JPG, or GIF (max 5MB)
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
                >
                  {editingDecor ? 'Update' : 'Add'} Decor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal (moved outside decor modal) */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Manage Categories</h2>
              <button
                onClick={() => { setIsCategoryModalOpen(false); setNewCategory(''); setCategoryError(''); }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            {/* List existing categories with delete buttons */}
            <div className="mb-4 max-h-40 overflow-y-auto">
              {categories.length === 0 ? (
                <div className="text-gray-500 text-sm">No categories found.</div>
              ) : (
                <ul>
                  {categories.map(category => (
                    <li key={category._id} className="flex items-center justify-between py-1 group">
                      <span className="capitalize text-gray-800">{category.name}</span>
                      <button
                        className="text-red-500 hover:text-red-700 p-1 ml-2 opacity-70 group-hover:opacity-100"
                        title="Delete category"
                        onClick={async () => {
                          if (!window.confirm(`Delete category '${category.name}'? This cannot be undone.`)) return;
                          setCategoryLoading(true);
                          setCategoryError('');
                          try {
                            const response = await authFetch(`/admin/categories/${category._id}`, {
                              method: 'DELETE'
                            });
                            const data = await response.json();
                            if (response.ok) {
                              setCategories(categories.filter(c => c._id !== category._id));
                              // If the deleted category was selected in the form, reset it
                              setFormData(f => f.category === category.name ? { ...f, category: categories[0]?.name || '' } : f);
                            } else {
                              setCategoryError(data.error || 'Failed to delete category');
                            }
                          } catch (error) {
                            setCategoryError('Failed to delete category');
                          } finally {
                            setCategoryLoading(false);
                          }
                        }}
                        disabled={categoryLoading}
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Add new category form */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setCategoryLoading(true);
                setCategoryError('');
                try {
                  const response = await authFetch('/admin/categories', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: newCategory })
                  });
                  const data = await response.json();
                  if (response.ok) {
                    setCategories([...categories, data]);
                    setNewCategory('');
                    setCategoryError('');
                  } else {
                    setCategoryError(data.error || 'Failed to add category');
                  }
                } catch (error) {
                  setCategoryError('Failed to add category');
                } finally {
                  setCategoryLoading(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Add New Category</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  maxLength={50}
                  disabled={categoryLoading}
                />
              </div>
              {categoryError && <div className="text-red-500 text-sm">{categoryError}</div>}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setIsCategoryModalOpen(false); setNewCategory(''); setCategoryError(''); }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                  disabled={categoryLoading}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                  disabled={categoryLoading}
                >
                  {categoryLoading ? 'Adding...' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DecorManagement;