import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import { isAuthenticated, getIntendedDestination, clearIntendedDestination } from '../utils/auth';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOTP] = useState('');
  const [tempUserId, setTempUserId] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { registeredUser, setRegisteredUser } = useContext(UserContext);

  useEffect(() => {
    if (isAuthenticated()) {
      // Check if there's an intended destination without clearing it
      const intended = getIntendedDestination();
      if (intended) {
        clearIntendedDestination();
        navigate(intended, { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [navigate]);

  // Animation trigger
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: name.trim(), 
          email: email.trim(), 
          password: password.trim() 
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed. Please try again.');
      }

      setTempUserId(data.tempId);
      setShowOTPInput(true);
    } catch (err) {
      setError(err.message || 'An error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tempId: tempUserId, 
          otp: otp.trim() 
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'OTP verification failed. Please try again.');
      }

      // Navigate to login with success message
      navigate('/login', { 
        state: { 
          message: 'Registration successful! Please sign in with your credentials.' 
        },
        replace: true 
      });
    } catch (err) {
      setError(err.message || 'An error occurred during OTP verification. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 relative overflow-hidden">
      {/* Animated Background Elements - morphing shapes and flowing lines */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Abstract morphing shapes */}
          <div 
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-orange-300 to-orange-500 opacity-15 blur-xl"
            style={{animation: 'abstractMorph 45s ease-in-out infinite'}}
          ></div>
          <div 
            className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 opacity-12 blur-xl"
            style={{animation: 'abstractMorph 60s ease-in-out infinite reverse', animationDelay: '-20s'}}
          ></div>
          <div 
            className="absolute top-1/2 left-1/3 w-20 h-20 bg-gradient-to-br from-white to-orange-300 opacity-10 blur-lg"
            style={{animation: 'abstractMorph 35s ease-in-out infinite', animationDelay: '-15s'}}
          ></div>
          {/* Flowing SVG lines */}
          <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path 
              d="M0,50 Q25,25 50,50 T100,50" 
              stroke="url(#flowGradient)" 
              strokeWidth="0.5" 
              fill="none"
              style={{animation: 'backgroundFlow 40s ease-in-out infinite'}}
            />
            <path 
              d="M0,30 Q25,5 50,30 T100,30" 
              stroke="url(#flowGradient)" 
              strokeWidth="0.3" 
              fill="none"
              style={{animation: 'backgroundFlow 50s ease-in-out infinite reverse', animationDelay: '-10s'}}
            />
            <path 
              d="M0,70 Q25,95 50,70 T100,70" 
              stroke="url(#flowGradient)" 
              strokeWidth="0.4" 
              fill="none"
              style={{animation: 'backgroundFlow 35s ease-in-out infinite', animationDelay: '-25s'}}
            />
            <defs>
              <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(249, 115, 22, 0.6)" />
                <stop offset="50%" stopColor="rgba(251, 146, 60, 0.8)" />
                <stop offset="100%" stopColor="rgba(234, 88, 12, 0.6)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        {/* Floating picture frames in orange/cream/white palette */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-32 h-24 bg-white border-4 border-orange-600 rounded-lg shadow-md transform rotate-12 animate-float">
            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
          </div>
          <div className="absolute top-32 left-32 w-20 h-28 bg-white border-4 border-orange-600 rounded-lg shadow-md transform -rotate-6 animate-drift">
            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
          </div>
          <div className="absolute top-40 right-20 w-28 h-20 bg-white border-4 border-orange-600 rounded-lg shadow-md transform rotate-6 animate-float">
            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
          </div>
          <div className="absolute top-16 right-40 w-24 h-32 bg-white border-4 border-orange-600 rounded-lg shadow-md transform -rotate-12 animate-gentleFloat">
            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
          </div>
          <div className="absolute bottom-40 left-20 w-36 h-24 bg-white border-4 border-orange-600 rounded-lg shadow-md transform rotate-3 animate-drift">
            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
          </div>
          <div className="absolute bottom-20 right-16 w-24 h-32 bg-white border-4 border-orange-600 rounded-lg shadow-md transform -rotate-8 animate-float">
            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
          </div>
          <div className="absolute top-1/3 right-1/4 w-40 h-28 bg-white border-4 border-orange-600 rounded-lg shadow-lg rotate-3 animate-gentleFloat">
            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
          </div>
        </div>
      </div>
      {/* Navigation */}
      <nav className="relative z-50 bg-white/95 backdrop-blur-sm shadow-lg">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 gap-2 sm:gap-0">
            <Link to="/" className="flex items-center text-2xl font-bold font-poppins text-orange-700 hover:text-orange-600 transition-colors duration-300">
              <span className="truncate max-w-[180px] sm:max-w-none">MIALTAR</span>
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-4 mt-2 sm:mt-0">
              <Link 
                to="/" 
                className="text-orange-700 hover:text-orange-600 font-medium font-inter px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 hover:bg-orange-100 text-sm sm:text-base"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </nav>
      {/* Main Content */}
      <main className="relative z-10 min-h-screen flex items-center justify-center px-2 sm:px-4 py-8">
        <div className="w-full max-w-md sm:max-w-md md:max-w-lg lg:max-w-md xl:max-w-md mx-auto">
          {!showOTPInput ? (
            <>
              {/* Welcome Section with Animation */}
              <div className={`text-center mb-8 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="w-20 h-20 bg-gradient-to-br from-orange-600 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-pulse">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold font-poppins text-orange-700 mb-2">
                  Join Our Community!
                </h1>
                <p className="text-orange-900 font-inter">
                  Create your account and start designing beautiful walls
                </p>
              </div>
              {/* Register Form */}
              <div className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <form onSubmit={handleRegister} className="space-y-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-semibold text-orange-700 font-inter">
                      Full Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-orange-300 group-focus-within:text-orange-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-orange-200 
                                 focus:outline-none focus:ring-4 focus:ring-orange-300/20 
                                 focus:border-orange-400 transition-all duration-300
                                 bg-orange-50/50 backdrop-blur-sm hover:bg-white/80
                                 text-orange-900 font-medium"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  {/* Email Field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-orange-700 font-inter">
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-orange-300 group-focus-within:text-orange-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-orange-200 
                                 focus:outline-none focus:ring-4 focus:ring-orange-300/20 
                                 focus:border-orange-400 transition-all duration-300
                                 bg-orange-50/50 backdrop-blur-sm hover:bg-white/80
                                 text-orange-900 font-medium"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  {/* Password Field */}
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-semibold text-orange-700 font-inter">
                      Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-orange-300 group-focus-within:text-orange-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Create a strong password"
                        className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-orange-200 
                                 focus:outline-none focus:ring-4 focus:ring-orange-300/20 
                                 focus:border-orange-400 transition-all duration-300
                                 bg-orange-50/50 backdrop-blur-sm hover:bg-white/80
                                 text-orange-900 font-medium"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-orange-300 hover:text-orange-500 transition-colors duration-300"
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  {/* Error Message */}
                  {error && (
                    <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-200 text-red-700 text-sm animate-slide-in-up">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                      </div>
                    </div>
                  )}
                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    className="group w-full py-4 px-6 rounded-2xl text-white font-bold text-lg
                             bg-gradient-to-r from-orange-600 to-orange-400 
                             hover:from-orange-500 hover:to-orange-300
                             transition-all duration-300 shadow-xl hover:shadow-2xl
                             disabled:opacity-50 disabled:cursor-not-allowed
                             transform hover:scale-105 hover:-translate-y-1 active:scale-95
                             relative overflow-hidden btn-interactive"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-3">
                        <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Create Account
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    )}
                  </button>
                  {/* Divider */}
                  <div className="relative flex items-center justify-center py-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-orange-200"></div>
                    </div>
                    <div className="relative bg-white px-4 text-sm text-orange-400 font-medium">
                      Already have an account?
                    </div>
                  </div>
                  {/* Login Link */}
                  <Link 
                    to="/login" 
                    className="group w-full flex items-center justify-center py-4 px-6 rounded-2xl 
                             border-2 border-orange-600 text-orange-700 font-bold text-lg
                             hover:bg-orange-600 hover:text-white
                             transition-all duration-300 shadow-lg hover:shadow-xl
                             transform hover:scale-105 hover:-translate-y-1"
                  >
                    <span className="flex items-center gap-2">
                      Sign In Instead
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                    </span>
                  </Link>
                </form>
              </div>
            </>
          ) : (
            <>
              {/* OTP Verification Section */}
              <div className={`text-center mb-8 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="w-20 h-20 bg-gradient-to-br from-orange-600 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-pulse">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold font-poppins text-orange-700 mb-2">
                  Check Your Email!
                </h1>
                <p className="text-orange-900 font-inter">
                  We've sent a verification code to your email address
                </p>
              </div>
              {/* OTP Form */}
              <div className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <form onSubmit={handleOTPVerification} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="otp" className="block text-sm font-semibold text-orange-700 font-inter">
                      Verification Code
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-orange-300 group-focus-within:text-orange-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={e => setOTP(e.target.value)}
                        placeholder="Enter the 6-digit code"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-orange-200 
                                 focus:outline-none focus:ring-4 focus:ring-orange-300/20 
                                 focus:border-orange-400 transition-all duration-300
                                 bg-orange-50/50 backdrop-blur-sm hover:bg-white/80
                                 text-orange-900 font-medium text-center text-2xl tracking-widest"
                        required
                        disabled={isLoading}
                        maxLength="6"
                      />
                    </div>
                  </div>
                  {/* Error Message */}
                  {error && (
                    <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-200 text-red-700 text-sm animate-slide-in-up">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                      </div>
                    </div>
                  )}
                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    className="group w-full py-4 px-6 rounded-2xl text-white font-bold text-lg
                             bg-gradient-to-r from-orange-600 to-orange-400 
                             hover:from-orange-500 hover:to-orange-300
                             transition-all duration-300 shadow-xl hover:shadow-2xl
                             disabled:opacity-50 disabled:cursor-not-allowed
                             transform hover:scale-105 hover:-translate-y-1 active:scale-95
                             relative overflow-hidden btn-interactive"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-3">
                        <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Verify & Complete Registration
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                    )}
                  </button>
                </form>
              </div>
            </>
          )}
          {/* Additional Features */}
          <div className={`text-center space-y-4 mt-8 transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex justify-center items-center space-x-8 text-orange-400/80">
              <div className="text-center group cursor-pointer">
                <div className="text-lg font-bold group-hover:scale-110 transition-transform duration-300">🚀</div>
                <div className="text-xs">Quick Setup</div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="text-lg font-bold group-hover:scale-110 transition-transform duration-300">🎯</div>
                <div className="text-xs">Easy to Use</div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="text-lg font-bold group-hover:scale-110 transition-transform duration-300">💎</div>
                <div className="text-xs">Premium Quality</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
