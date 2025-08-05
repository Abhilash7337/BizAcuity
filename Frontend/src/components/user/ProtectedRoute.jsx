import { useContext, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserContext } from '../../App';
import { isAuthenticated, getAuthUser, removeAuthUser, removeToken, setIntendedDestination } from '../../utils/auth';

const ProtectedRoute = ({ children }) => {
  const { registeredUser, setRegisteredUser } = useContext(UserContext);
  const location = useLocation();

  useEffect(() => {
    // Check if user data exists but no valid token
    if (registeredUser?.isLoggedIn && !isAuthenticated()) {
      // Token expired or removed, logout user
      removeAuthUser();
      removeToken();
      setRegisteredUser(null);
    }
  }, [registeredUser?.isLoggedIn]);

  // Check both token and user data
  if (!isAuthenticated() || !registeredUser?.isLoggedIn) {
    // Store the current location as intended destination before redirecting
    const currentPath = location.pathname + location.search;
    setIntendedDestination(currentPath);
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute; 