import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfileForm = ({ user, onProfileUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userType: 'regular'
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [profilePhotoBase64, setProfilePhotoBase64] = useState(null);
  const [photoRemoved, setPhotoRemoved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        userType: user.userType || 'regular'
      });
      if (user.profilePhoto) {
        setPhotoPreview(user.profilePhoto);
      }
      setPhotoRemoved(false); // Reset photo removed flag when user data changes
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear any previous messages
    setSaveStatus({ type: '', message: '' });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processImageFile(file);
    }
  };

  const processImageFile = (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setSaveStatus({ 
        type: 'error', 
        message: 'Please select a valid image file' 
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setSaveStatus({ 
        type: 'error', 
        message: 'Image size must be less than 5MB' 
      });
      return;
    }

    setProfilePhoto(file);
    
    // Create preview and convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target.result;
      setPhotoPreview(base64String);
      setProfilePhotoBase64(base64String);
    };
    reader.readAsDataURL(file);
    
    setPhotoRemoved(false);
    setSaveStatus({ type: '', message: '' });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleRemovePhoto = () => {
    console.log('🗑️ Remove photo clicked', { 
      hasCurrentPhoto: !!user?.profilePhoto,
      hasPreview: !!photoPreview 
    });
    setProfilePhoto(null);
    setPhotoPreview(null);
    setProfilePhotoBase64(null);
    setPhotoRemoved(true); // Mark that photo was explicitly removed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setSaveStatus({ type: '', message: '' });

    try {
      // Create JSON data for profile update
      const submitData = {
        name: formData.name,
        email: formData.email,
        userType: formData.userType
      };
      
      // Handle profile photo: include it if there's a new photo OR if we're removing it
      if (profilePhotoBase64) {
        submitData.profilePhoto = profilePhotoBase64;
        console.log('📸 Updating profile photo with new image');
      } else if (photoRemoved && user?.profilePhoto) {
        // Explicitly remove the profile photo if user had one and we're clearing it
        submitData.profilePhoto = null;
        console.log('🗑️ Removing profile photo');
      }

      console.log('📝 Profile update data:', {
        ...submitData,
        profilePhoto: submitData.profilePhoto ? '[Base64 Image Data]' : submitData.profilePhoto
      });

      const response = await fetch(`http://localhost:5001/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setSaveStatus({ 
        type: 'success', 
        message: 'Profile updated successfully!' 
      });
      
      // Clear the file input after successful upload
      if (profilePhoto) {
        setProfilePhoto(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
      
      // Reset photo removed flag after successful update
      setPhotoRemoved(false);
      
      // Exit edit mode
      setIsEditing(false);
      
      // Trigger parent component to refresh user data
      if (onProfileUpdate) {
        onProfileUpdate(data.user);
      }
      
    } catch (err) {
      setSaveStatus({ 
        type: 'error', 
        message: err.message || 'Failed to update profile' 
      });
    } finally {
      setLoading(false);
      // Clear status message after 3 seconds
      setTimeout(() => {
        setSaveStatus({ type: '', message: '' });
      }, 3000);
    }
  };

  return (
    <div className="space-y-6">
      {!isEditing ? (
        // View Mode
        <div className="space-y-6 font-poppins">
          {/* User Information Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#ff9800] uppercase tracking-wide">Full Name</label>
              <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                <p className="text-[#625d8c] font-semibold text-lg">{user?.name || 'Not set'}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#ff9800] uppercase tracking-wide">Email Address</label>
              <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                <p className="text-[#625d8c] font-semibold text-lg">{user?.email || 'Not set'}</p>
              </div>
            </div>
          </div>

          {/* Current Plan Display */}
          <div className="space-y-3">
            <label className="text-base font-bold text-[#625d8c] uppercase tracking-wide">Current Plan</label>
            <div className="bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl p-5 border border-orange-100">
              <div className="flex items-center justify-between">
                <p className="text-[#ff9800] font-bold text-xl">
                  {user?.plan ? user.plan.charAt(0).toUpperCase() + user.plan.slice(1) + ' Plan' : 'No plan selected'}
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/choose-plan')}
                  className="w-half py-3 px-6 rounded-2xl text-white font-semibold
                     bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300
                     transition-all duration-200 shadow-xl hover:scale-105"
                >
                  {user?.plan ? 'Change Plan' : 'Choose Plan'}
                </button>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => setIsEditing(true)}
            className="w-half py-3 px-6 rounded-2xl text-white font-semibold
                     bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300
                     transition-all duration-200 shadow-xl hover:scale-105"
          >
            <span className="flex items-center justify-center gap-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </span>
          </button>
        </div>
      ) : (
        // Edit Mode
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-black uppercase tracking-wide">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-4 rounded-2xl border-2 border-primary-light/30 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 bg-white/80 backdrop-blur-sm font-medium text-primary-dark"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-black uppercase tracking-wide">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-4 rounded-2xl border-2 border-primary-light/30 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 bg-white/80 backdrop-blur-sm font-medium text-primary-dark"
                required
              />
            </div>
          </div>

          {/* Status Messages */}
          {saveStatus.type && (
            <div className={`p-4 rounded-2xl border-2 text-sm font-medium flex items-center gap-3 ${
              saveStatus.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-700' 
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              {saveStatus.type === 'success' ? (
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              {saveStatus.message}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setSaveStatus({ type: '', message: '' });
                // Reset form data
                if (user) {
                  setFormData({
                    name: user.name || '',
                    email: user.email || '',
                    userType: user.userType || 'regular'
                  });
                  if (user.profilePhoto) {
                    setPhotoPreview(user.profilePhoto);
                  }
                }
              }}
              className="flex-1 bg-orange-100 text-orange-700 py-4 px-6 rounded-2xl font-semibold text-lg hover:bg-orange-200 transition-all duration-300"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-orange-600 to-orange-400 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving Changes...
                </div>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </span>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserProfileForm; 