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
        console.log('Categories fetched:', data); // Debug log
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
        console.error('Failed to fetch categories:', data);
        setCategoryError(data.error || 'Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
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
    
    
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('category', formData.category);
      submitData.append('description', formData.description);
      
      if (formData.image) {
        submitData.append('image', formData.image);
      } else {
      }

      const url = editingDecor 
        ? `/admin/decors/${editingDecor._id}` 
        : '/admin/decors';
      const method = editingDecor ? 'PUT' : 'POST';
      

      const response = await authFetch(url, {
        method,
        body: submitData
      });
      

      const data = await response.json();

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
    const defaultCategory = categories.length > 0 ? categories[0].name : '';
    setFormData({
      name: '',
      category: defaultCategory,
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
      <div className="flex justify-center items-center h-64 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-orange-500/20">
        <div className="text-center">
          <div className="relative mx-auto mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-600 border-t-orange-500"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-2 border-orange-400 opacity-20"></div>
          </div>
          <p className="text-slate-300 font-medium">Loading decors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-orange-500/20 shadow-xl">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2" style={{textShadow: '0 2px 8px rgba(0,0,0,0.3)'}}>
            Decor Management
          </h1>
          <p className="text-slate-300">Manage decorative elements for wall designs</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl"
            style={{boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)'}}
          >
            <Plus size={20} />
            Add Category
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl"
            style={{boxShadow: '0 8px 25px rgba(249, 115, 22, 0.3)'}}
          >
            <Plus size={20} />
            Add New Decor
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-orange-500/20 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <Filter size={20} className="text-orange-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Filter Decors</h3>
              <p className="text-slate-400 text-sm">Browse by category</p>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-1">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="bg-slate-700/50 rounded-xl px-4 py-2 border border-slate-600">
              <span className="text-orange-400 font-semibold">
                {filteredDecors.length}
              </span>
              <span className="text-slate-300 ml-1">
                decor{filteredDecors.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Decors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDecors.map((decor, index) => (
          <div 
            key={decor._id} 
            className="bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-orange-500/20 transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 group"
            style={{
              animationDelay: `${index * 0.1}s`,
              animation: 'fadeInUp 0.6s ease-out'
            }}
          >
            <div className="h-48 bg-slate-700/50 flex items-center justify-center relative overflow-hidden">
              <img
                src={decor.imageUrl ? `${import.meta.env.VITE_API_BASE_URL || ''}${decor.imageUrl}` : 'https://via.placeholder.com/150?text=No+Image'}
                alt={decor.name}
                className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
                onError={e => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-white mb-1 group-hover:text-orange-300 transition-colors duration-300">{decor.name}</h3>
              <p className="text-sm text-orange-400 mb-2 capitalize font-medium">{decor.category}</p>
              {decor.description && (
                <p className="text-sm text-slate-300 mb-3 leading-relaxed">{decor.description}</p>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-slate-700/50">
                <button
                  onClick={() => openEditModal(decor)}
                  className="text-orange-400 hover:text-orange-300 p-2 rounded-xl hover:bg-orange-500/20 transition-all duration-300 transform hover:scale-110"
                  title="Edit decor"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(decor._id)}
                  className="text-red-400 hover:text-red-300 p-2 rounded-xl hover:bg-red-500/20 transition-all duration-300 transform hover:scale-110"
                  title="Delete decor"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDecors.length === 0 && (
        <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-12 text-center border border-orange-500/20 shadow-xl">
          <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8h.01M12 13h.01M16 9h.01" />
            </svg>
          </div>
          <h3 className="text-white font-bold text-lg mb-2">No decors found</h3>
          <p className="text-slate-400">
            {selectedCategory === 'all' 
              ? 'No decors available. Add some decorative elements to get started.' 
              : `No decors found in the "${selectedCategory}" category.`
            }
          </p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl p-6 w-full max-w-md border border-orange-500/20 shadow-2xl transform animate-modal-fade-in">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">
                  {editingDecor ? 'Edit Decor' : 'Add New Decor'}
                </h2>
                <p className="text-slate-400 text-sm">
                  {editingDecor ? 'Update decor information' : 'Add a new decorative element'}
                </p>
              </div>
              <button
                onClick={resetForm}
                className="text-slate-400 hover:text-slate-200 p-2 rounded-xl hover:bg-slate-700/50 transition-all duration-300"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                  placeholder="Enter decor name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
                  required
                >
                  {categories.length === 0 && <option value="">No categories found</option>}
                  {categories.map(category => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 resize-none"
                  rows="3"
                  placeholder="Enter description (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Image {!editingDecor && <span className="text-red-400">*</span>}
                </label>
                <div className="border-2 border-dashed border-slate-600 rounded-xl p-6 bg-slate-700/30 hover:border-orange-500/50 transition-all duration-300">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setFormData({ ...formData, image: file });
                    }}
                    className="w-full text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600 file:transition-all file:duration-300"
                    required={!editingDecor}
                  />
                  <p className="text-sm text-slate-400 mt-2 text-center">
                    Upload PNG, JPG, or GIF (max 5MB)
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-slate-700/50 border border-slate-600 text-slate-300 py-3 rounded-xl font-semibold hover:bg-slate-600/50 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                  style={{boxShadow: '0 8px 25px rgba(249, 115, 22, 0.3)'}}
                >
                  {editingDecor ? 'Update' : 'Add'} Decor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl p-6 w-full max-w-md border border-orange-500/20 shadow-2xl transform animate-modal-fade-in">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Manage Categories</h2>
                <p className="text-slate-400 text-sm">Add or remove decor categories</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    fetchCategories();
                  }}
                  className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-700/50 transition-all duration-300"
                  title="Refresh categories"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button
                  onClick={() => { setIsCategoryModalOpen(false); setNewCategory(''); setCategoryError(''); }}
                  className="text-slate-400 hover:text-slate-200 p-2 rounded-xl hover:bg-slate-700/50 transition-all duration-300"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            {/* List existing categories */}
            <div className="mb-6 max-h-48 overflow-y-auto">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-2">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                Existing Categories
              </h3>
              {categories.length === 0 ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <p className="text-slate-400 text-sm">No categories found.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {categories.map((category, index) => (
                    <div 
                      key={category._id} 
                      className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-blue-500/50 transition-all duration-300 group animate-slideIn"
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span className="capitalize text-white font-medium">{category.name}</span>
                      </div>
                      <button
                        className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/20 transition-all duration-300 transform hover:scale-110 opacity-70 group-hover:opacity-100"
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
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Add new category form */}
            <div className="border-t border-slate-700/50 pt-6">
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
                      const updatedCategories = [...categories, data];
                      setCategories(updatedCategories);
                      setNewCategory('');
                      setCategoryError('');
                      // Update form data if this is the first category
                      if (categories.length === 0) {
                        setFormData(f => ({ ...f, category: data.name }));
                      }
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
                  <label className="block text-sm font-semibold text-white mb-2 flex items-center">
                    <div className="w-5 h-5 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-2">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    Add New Category
                  </label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                    placeholder="Enter category name"
                    required
                    maxLength={50}
                    disabled={categoryLoading}
                  />
                </div>
                {categoryError && (
                  <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
                    <p className="text-red-300 text-sm flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {categoryError}
                    </p>
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setIsCategoryModalOpen(false); setNewCategory(''); setCategoryError(''); }}
                    className="flex-1 bg-slate-700/50 border border-slate-600 text-slate-300 py-3 rounded-xl font-semibold hover:bg-slate-600/50 hover:text-white transition-all duration-300"
                    disabled={categoryLoading}
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={categoryLoading}
                  >
                    {categoryLoading ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Adding...
                      </span>
                    ) : (
                      'Add Category'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DecorManagement;