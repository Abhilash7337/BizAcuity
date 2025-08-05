import { useState, useEffect } from 'react';
import { getAuthUser, fetchUserProfile } from '../utils/auth';

/**
 * Custom hook for accessing user data securely
 * Returns both public (cached) and private (fetched) user data
 */
export const useUser = () => {
  const [publicUserData, setPublicUserData] = useState(null);
  const [privateUserData, setPrivateUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get public user data from localStorage (safe data)
  useEffect(() => {
    const userData = getAuthUser();
    setPublicUserData(userData);
  }, []);

  // Function to fetch sensitive user data when needed
  const fetchSensitiveData = async () => {
    if (privateUserData) return privateUserData; // Return cached if available
    
    setLoading(true);
    setError(null);
    
    try {
      const profile = await fetchUserProfile();
      setPrivateUserData(profile);
      return profile;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    // Always available (from localStorage)
    name: publicUserData?.name,
    isLoggedIn: publicUserData?.isLoggedIn,
    userType: publicUserData?.userType,
    plan: publicUserData?.plan,
    
    // Available after calling fetchSensitiveData()
    id: privateUserData?.id,
    email: privateUserData?.email,
    profilePhoto: privateUserData?.profilePhoto,
    
    // Control functions
    fetchSensitiveData,
    loading,
    error,
    
    // Raw data objects
    publicData: publicUserData,
    privateData: privateUserData
  };
};

export default useUser;
