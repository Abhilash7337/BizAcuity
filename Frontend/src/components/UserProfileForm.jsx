import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfileForm = ({ user, userId, onProfileUpdate }) => {
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
      
      setPhotoRemoved(false); // Reset removed flag when new photo is selected
      setSaveStatus({ type: '', message: '' });
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

      const response = await fetch(`http://localhost:5001/user/profile/${userId}`, {
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Photo Section */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Profile Photo
        </label>
        
        <div className="flex items-center space-x-6">
          {/* Photo Preview */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
              {photoPreview ? (
                <img 
                  src={photoPreview} 
                  alt="Profile preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Upload Controls */}
          <div className="flex-1 space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
            
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 text-sm font-medium text-primary-dark bg-white border border-primary-dark rounded-lg hover:bg-primary-dark hover:text-white transition-colors duration-200"
              >
                Upload Photo
              </button>
              
              {photoPreview && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors duration-200"
                >
                  Remove
                </button>
              )}
            </div>
            
            <p className="text-xs text-gray-500">
              JPG, PNG or GIF. Max size 5MB.
            </p>
          </div>
        </div>
      </div>

      {/* Name Field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 
                   focus:outline-none focus:ring-2 focus:ring-purple-500/20 
                   focus:border-purple-500 transition-all duration-200
                   bg-white/50 backdrop-blur-sm"
          required
        />
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 
                   focus:outline-none focus:ring-2 focus:ring-purple-500/20 
                   focus:border-purple-500 transition-all duration-200
                   bg-white/50 backdrop-blur-sm"
          required
        />
      </div>

      {/* Current Plan Display */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Current Plan
        </label>
        <div className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-600">
          {user?.plan ? user.plan.charAt(0).toUpperCase() + user.plan.slice(1) : 'No plan selected'}
        </div>
      </div>

      {/* Choose Plan Button */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Subscription Plan
        </label>
        <button
          type="button"
          onClick={() => navigate('/choose-plan')}
          className="w-full px-4 py-3 rounded-xl text-white font-semibold
                   bg-primary-dark hover:bg-primary
                   transition-all duration-200 shadow-md
                   hover:shadow-lg hover:scale-[1.02]"
        >
          {user?.plan ? 'Change Plan' : 'Choose Plan'}
        </button>
      </div>

      {/* Status Messages */}
      {saveStatus.type && (
        <div className={`p-4 rounded-xl border text-sm font-medium flex items-center gap-2 ${
          saveStatus.type === 'success' 
            ? 'bg-[#eee3cb] border-[#967e76] text-[#967e76]' 
            : 'bg-red-50 border-red-100 text-red-600'
        }`}>
          {saveStatus.type === 'success' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
          {saveStatus.message}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-6 rounded-xl text-white font-semibold
                 bg-primary-dark hover:bg-primary
                 transition-all duration-200 shadow-md
                 hover:shadow-lg hover:scale-[1.02]
                 disabled:opacity-50 disabled:cursor-not-allowed
                 disabled:hover:scale-100"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Updating Profile...
          </div>
        ) : (
          'Update Profile'
        )}
      </button>
    </form>
  );
};

export default UserProfileForm; 