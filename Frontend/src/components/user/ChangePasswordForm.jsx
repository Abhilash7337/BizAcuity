import React, { useState } from 'react';

const ChangePasswordForm = () => {
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear any previous messages
    setUpdateError('');
    setUpdateSuccess('');
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setUpdateError('');
    setUpdateSuccess('');
    
    // Validate passwords
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setUpdateError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setUpdateError('New password must be at least 6 characters long');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/update-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update password');
      }

      // Clear form and show success message
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Set success message and keep it visible
      setUpdateSuccess('Password updated successfully!');
      
      // Wait 3 seconds before hiding the form
      setTimeout(() => {
        setIsUpdatingPassword(false);
        setUpdateSuccess(''); // Clear success message when form is hidden
      }, 1000);
      
    } catch (err) {
      setUpdateError(err.message || 'Failed to update password');
    }
  };

  return (
    <div className="space-y-4">
      <div className="pt-4">
        <button
          onClick={() => setIsUpdatingPassword(!isUpdatingPassword)}
          className="w-half py-3 px-6 rounded-xl text-white font-semibold
                   bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300
                   transition-all duration-200 shadow-xl hover:scale-105"
        >
          {isUpdatingPassword ? 'Cancel Password Update' : 'Change Password'}
        </button>
      </div>

      {/* Password Update Form */}
      {isUpdatingPassword && (
        <form onSubmit={handleUpdatePassword} className="pt-4 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-3 rounded-2xl border border-orange-200 
                       focus:outline-none focus:ring-2 focus:ring-orange-300/20 
                       focus:border-orange-400 transition-all duration-300
                       bg-white/80 backdrop-blur-sm text-orange-900 font-medium"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              className="w-half px-4 py-3 rounded-2xl border border-orange-200 
                       focus:outline-none focus:ring-2 focus:ring-orange-300/20 
                       focus:border-orange-400 transition-all duration-300
                       bg-white/80 backdrop-blur-sm text-orange-900 font-medium"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-3 rounded-2xl border border-orange-200 
                       focus:outline-none focus:ring-2 focus:ring-orange-300/20 
                       focus:border-orange-400 transition-all duration-300
                       bg-white/80 backdrop-blur-sm text-orange-900 font-medium"
              required
            />
          </div>

          {updateError && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm">
              {updateError}
            </div>
          )}

          {updateSuccess && (
            <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-orange-900 text-sm font-medium flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {updateSuccess}
            </div>
          )}

          <button
            type="submit"
            className="w-half py-3 px-6 rounded-2xl text-white font-semibold
                     bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300
                     transition-all duration-200 shadow-xl hover:scale-105"
          >
            Update Password
          </button>
        </form>
      )}
    </div>
  );
};

export default ChangePasswordForm; 