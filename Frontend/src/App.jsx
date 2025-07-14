import { useState, useRef, createContext, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import WallEditor from './pages/WallEditor'
import Landing from './pages/Landing'
import User from './pages/User'
import ChoosePlan from './pages/ChoosePlan'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import './index.css'
import { Upload, Settings, Palette, Image as LucideImage, Ruler, Trash2, Download, X } from 'lucide-react'
import { isAuthenticated, getAuthUser, authFetch, removeToken, removeAuthUser } from './utils/auth'

export const UserContext = createContext();

function App() {
  const [registeredUser, setRegisteredUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user state from localStorage
  useEffect(() => {
    const initializeUser = () => {
      setIsLoading(true);
      try {
        if (isAuthenticated()) {
          const storedUser = getAuthUser();
          
          if (storedUser) {
            // Set user from localStorage without backend verification for now
            const userWithLogin = { ...storedUser, isLoggedIn: true };
            setRegisteredUser(userWithLogin);
          } else {
            removeToken(); // Remove token if no user data exists
            setRegisteredUser(null);
          }
        } else {
          removeAuthUser(); // Remove user data if no token exists
          setRegisteredUser(null);
        }
      } catch (error) {
        console.error('Error initializing user:', error);
        removeToken();
        removeAuthUser();
        setRegisteredUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []);

  // Logout function
  const handleLogout = () => {
    removeToken();
    removeAuthUser();
    setRegisteredUser(null);
  };

  // Loading screen while checking user session
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f1e6cb' }}>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center">
          <svg className="animate-spin h-10 w-10 text-primary-dark mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-primary-dark text-lg font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ registeredUser, setRegisteredUser, handleLogout }}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={
            registeredUser?.isLoggedIn ? <Navigate to="/landing" replace /> : <Login />
          } />
          <Route path="/register" element={
            registeredUser?.isLoggedIn ? <Navigate to="/landing" replace /> : <Register />
          } />

          {/* Protected routes */}
          <Route path="/wall" element={
            <ProtectedRoute>
              <WallEditor />
            </ProtectedRoute>
          } />
          <Route path="/landing" element={
            <ProtectedRoute>
              <Landing />
            </ProtectedRoute>
          } />
          <Route path="/user" element={
            <ProtectedRoute>
              <User />
            </ProtectedRoute>
          } />
          <Route path="/choose-plan" element={
            <ProtectedRoute>
              <ChoosePlan />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Redirect root to login for non-logged-in users, to landing for logged-in users */}
          <Route path="/" element={
            registeredUser?.isLoggedIn ? <Navigate to="/landing" replace /> : <Navigate to="/login" replace />
          } />
        </Routes>
      </Router>
    </UserContext.Provider>
  )
}

export default App