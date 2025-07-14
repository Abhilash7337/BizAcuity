import React from 'react';
import useUser from '../../hooks/useUser';

/**
 * Example component showing secure user data usage
 */
const UserProfile = () => {
  const { 
    name, 
    userType, 
    plan, 
    id, 
    email, 
    fetchSensitiveData, 
    loading 
  } = useUser();

  const handleShowSensitiveData = async () => {
    // Only fetch sensitive data when user explicitly requests it
    await fetchSensitiveData();
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">User Profile</h2>
      
      {/* Always available data (safe to store in localStorage) */}
      <div className="mb-4">
        <h3 className="font-semibold text-green-600 mb-2">Public Data (Cached Locally)</h3>
        <p><strong>Name:</strong> {name || 'Not available'}</p>
        <p><strong>User Type:</strong> {userType || 'Not available'}</p>
        <p><strong>Plan:</strong> {plan || 'Not available'}</p>
      </div>

      {/* Sensitive data (fetched from server when needed) */}
      <div className="mb-4">
        <h3 className="font-semibold text-orange-600 mb-2">Sensitive Data (Server Only)</h3>
        {id || email ? (
          <>
            <p><strong>ID:</strong> {id || 'Not loaded'}</p>
            <p><strong>Email:</strong> {email || 'Not loaded'}</p>
          </>
        ) : (
          <button 
            onClick={handleShowSensitiveData}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load Sensitive Data'}
          </button>
        )}
      </div>

      <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded">
        <strong>Security Note:</strong> Only name, userType, and plan are stored in localStorage. 
        Sensitive data like ID and email are fetched from the server when needed.
      </div>
    </div>
  );
};

export default UserProfile;
