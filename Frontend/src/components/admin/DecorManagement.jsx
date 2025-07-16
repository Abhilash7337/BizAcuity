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
    category: 'clocks',
    description: '',
    image: null
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'clocks', label: 'Clocks' },
    { value: 'tables', label: 'Tables' },
    { value: 'plants', label: 'Plants' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'garlands', label: 'Garlands' },
    { value: 'lamps', label: 'Lamps' },
    { value: 'chairs', label: 'Chairs' },
    { value: 'flowers', label: 'Flowers' },
    { value: 'frames', label: 'Frames' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    fetchDecors();
  }, []);

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
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Decor
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-4">
        <Filter size={20} className="text-gray-600" />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          {categories.map(category => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
        <span className="text-gray-600">
          {filteredDecors.length} decor{filteredDecors.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Decors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDecors.map(decor => (
          <div key={decor._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-100 flex items-center justify-center">
              <img
                src={`http://localhost:5001${decor.imageUrl}`}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {categories.slice(1).map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

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
                    onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
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
    </div>
  );
};

export default DecorManagement;