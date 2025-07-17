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
    <div className="p-8 bg-gradient-to-br from-orange-100 via-orange-50 to-orange-200 rounded-3xl shadow-xl border border-orange-200/50 max-w-xl mx-auto font-poppins">
      <h2 className="text-2xl font-bold mb-6 text-[#625d8c]">User Profile</h2>
      {/* Always available data (safe to store in localStorage) */}
      <div className="mb-6 bg-white rounded-2xl shadow border border-orange-100 p-6">
        <h3 className="font-semibold text-[#ff9800] mb-3 text-lg">Public Data (Cached Locally)</h3>
        <div className="flex flex-col md:flex-row md:space-x-8 space-y-2 md:space-y-0">
          <p><span className="font-semibold text-[#625d8c]">Name:</span> <span className="text-gray-800">{name || 'Not available'}</span></p>
          <p><span className="font-semibold text-[#625d8c]">User Type:</span> <span className="text-gray-800">{userType || 'Not available'}</span></p>
          <p><span className="font-semibold text-[#625d8c]">Plan:</span> <span className="text-[#ff9800] font-bold">{plan || 'Not available'}</span></p>
        </div>
      </div>
      {/* Sensitive data (fetched from server when needed) */}
      <div className="mb-6 bg-white rounded-2xl shadow border border-orange-100 p-6">
        <h3 className="font-semibold text-[#625d8c] mb-3 text-lg">Sensitive Data (Server Only)</h3>
        {id || email ? (
          <div className="flex flex-col md:flex-row md:space-x-8 space-y-2 md:space-y-0">
            <p><span className="font-semibold text-[#ff9800]">ID:</span> <span className="text-gray-800">{id || 'Not loaded'}</span></p>
            <p><span className="font-semibold text-[#ff9800]">Email:</span> <span className="text-gray-800">{email || 'Not loaded'}</span></p>
          </div>
        ) : (
          <button 
            onClick={handleShowSensitiveData}
            disabled={loading}
            className="bg-gradient-to-r from-[#ff9800] to-[#625d8c] text-white px-6 py-2 rounded-xl shadow-xl hover:from-orange-500 hover:to-orange-300 transition-all duration-300 font-semibold"
          >
            {loading ? 'Loading...' : 'Load Sensitive Data'}
          </button>
        )}
      </div>
      <div className="text-sm text-gray-600 bg-orange-50 p-4 rounded-xl border border-orange-100">
        <strong className="text-[#625d8c]">Security Note:</strong> Only name, userType, and plan are stored in localStorage. <br/>
        Sensitive data like ID and email are fetched from the server when needed.
      </div>
    </div>
  );
};

export default UserProfile;
