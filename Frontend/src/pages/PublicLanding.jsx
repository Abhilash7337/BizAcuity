import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Footer } from '../components/layout';

const PublicLanding = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-rotate features
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleCreateWall = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 overflow-hidden">
      {/* Subtle Background Animation Layer */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Main background container */}
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
          
          {/* Flowing lines effect with SVG */}
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
          
          {/* Subtle gradient overlay that shifts */}
          <div 
            className="absolute inset-0 w-full h-full"
            style={{animation: 'gradientShift 80s ease-in-out infinite'}}
          ></div>
        </div>
      </div>

      {/* Navigation */}
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400">
          {/* Floating Picture Frame Mockups with Animations */}
          <div className="absolute inset-0 opacity-20">
            {/* Top left frames */}
            <div className="absolute top-20 left-10 w-32 h-24 bg-white border-4 border-orange-600 rounded-lg shadow-md transform rotate-12 hover:scale-110 transition-all duration-500" style={{animation: 'gentleFloat 20s ease-in-out infinite'}}>
              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
            </div>
            <div className="absolute top-32 left-32 w-20 h-28 bg-white border-4 border-orange-600 rounded-lg shadow-md transform -rotate-6 hover:rotate-0 transition-all duration-700" style={{animation: 'drift 25s ease-in-out infinite, slowRotate 40s linear infinite'}}>
              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
            </div>
            
            {/* Top right frames */}
            <div className="absolute top-40 right-20 w-28 h-20 bg-white border-4 border-orange-600 rounded-lg shadow-md transform rotate-6 hover:-rotate-3 transition-all duration-500" style={{animation: 'float 18s ease-in-out infinite reverse'}}>
              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
            </div>
            <div className="absolute top-16 right-40 w-24 h-32 bg-white border-4 border-orange-600 rounded-lg shadow-md transform -rotate-12 hover:rotate-6 transition-all duration-700" style={{animation: 'gentleFloat 22s ease-in-out infinite, slowRotate 35s linear infinite reverse'}}>
              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
            </div>
            
            {/* Bottom frames */}
            <div className="absolute bottom-40 left-20 w-36 h-24 bg-white border-4 border-orange-600 rounded-lg shadow-md transform rotate-3 hover:scale-105 transition-all duration-500" style={{animation: 'drift 30s ease-in-out infinite reverse'}}>
              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
            </div>
            <div className="absolute bottom-20 right-16 w-24 h-32 bg-white border-4 border-orange-600 rounded-lg shadow-md transform -rotate-8 hover:rotate-4 transition-all duration-700" style={{animation: 'float 16s ease-in-out infinite, slowRotate 45s linear infinite'}}>
              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
            </div>
            
            {/* Center large frame with special animation */}
            <div className="absolute top-1/3 right-1/4 w-40 h-28 bg-white border-4 border-orange-600 rounded-lg shadow-lg rotate-3 hover:scale-110 hover:rotate-0 transition-all duration-700" style={{animation: 'gentleFloat 24s ease-in-out infinite reverse, slowRotate 50s linear infinite'}}>
              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
            </div>
          </div>
        </div>
        
        {/* Hero Content with Animations */}
        <div className={`relative z-10 text-center text-gray-700 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold font-poppins mb-6 leading-tight">
            <span className="inline-block animate-pulse text-white">Design your dream</span>
            <span className="block text-orange-600 hover:text-orange-700 transition-colors duration-300 cursor-default">wall layout</span>
          </h1>
          
          <p className={`text-lg sm:text-xl lg:text-2xl font-inter mb-8 max-w-2xl mx-auto leading-relaxed text-white transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            Create stunning visual compositions with our intuitive wall design tool.
            Upload your photos, arrange decorative elements, and bring your creative vision to life.
          </p>
          
          {/* Interactive CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <button
              onClick={handleGetStarted}
              className="group w-full sm:w-auto bg-orange-600 hover:bg-orange-700 transition-all duration-300 text-white font-semibold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 active:scale-95 relative overflow-hidden btn-interactive"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Get Started
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <button
              onClick={handleCreateWall}
              className="group w-full sm:w-auto bg-transparent border-2 border-white hover:bg-white hover:text-orange-600 transition-all duration-300 text-white font-semibold py-4 px-8 rounded-xl text-lg hover:shadow-lg transform hover:scale-105 hover:-translate-y-1 active:scale-95 relative overflow-hidden btn-interactive"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Create Wall 
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
          </div>
          
          {/* Interactive Stats */}
          <div className={`mt-12 grid grid-cols-3 gap-8 max-w-lg mx-auto transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="text-center group cursor-pointer">
              <div className="w-16 h-16 mx-auto bg-white/90 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-sm text-white/90 font-medium">Upload & Arrange</div>
              <div className="text-xs text-white/70">Your photos and arrange</div>
              <div className="text-xs text-white/70">them with precision</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="w-16 h-16 mx-auto bg-white/90 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <div className="text-sm text-white/90 font-medium">Customize Design</div>
              <div className="text-xs text-white/70">Choose from beautiful</div>
              <div className="text-xs text-white/70">backgrounds and decorative elements</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="w-16 h-16 mx-auto bg-white/90 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <div className="text-sm text-white/90 font-medium">Share & Export</div>
              <div className="text-xs text-white/70">Export your creations or</div>
              <div className="text-xs text-white/70">export them in high quality</div>
            </div>
          </div>
        </div>
        
        {/* Interactive Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer group">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center group-hover:border-orange-200 transition-colors duration-300">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse group-hover:bg-orange-200 transition-colors duration-300"></div>
          </div>
          <div className="text-xs text-white mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Scroll down</div>
        </div>
      </section>
      
      {/* Interactive Wall Layout Preview Section */}
      <section className="py-20 bg-gradient-to-b from-white to-orange-100 relative overflow-hidden">
        {/* Enhanced subtle background animation layer */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Flowing abstract background */}
          <div 
            className="absolute top-20 left-10 w-40 h-40 bg-orange-300 opacity-8 blur-3xl rounded-full"
            style={{animation: 'backgroundFlow 90s ease-in-out infinite'}}
          ></div>
          <div 
            className="absolute bottom-20 right-10 w-32 h-32 bg-orange-400 opacity-6 blur-2xl"
            style={{animation: 'abstractMorph 70s ease-in-out infinite reverse'}}
          ></div>
          
          {/* Flowing lines for this section */}
          <svg className="absolute inset-0 w-full h-full opacity-3" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path 
              d="M0,20 Q50,5 100,20" 
              stroke="rgba(234, 88, 12, 0.4)" 
              strokeWidth="0.2" 
              fill="none"
              style={{animation: 'backgroundFlow 60s ease-in-out infinite'}}
            />
            <path 
              d="M0,80 Q50,95 100,80" 
              stroke="rgba(249, 115, 22, 0.3)" 
              strokeWidth="0.15" 
              fill="none"
              style={{animation: 'backgroundFlow 45s ease-in-out infinite reverse'}}
            />
          </svg>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-20 h-20 border border-orange-600 rounded-full animate-spin" style={{animationDuration: '20s'}}></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 border border-orange-500 rounded-lg animate-pulse" style={{animationDuration: '4s'}}></div>
          <div className="absolute top-1/3 left-1/4 w-16 h-16 border-2 border-orange-400 rounded-full" style={{animation: 'float 15s ease-in-out infinite'}}></div>
          <div className="absolute bottom-1/4 right-1/3 w-24 h-24 border border-orange-300 transform rotate-45" style={{animation: 'drift 25s linear infinite'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-poppins text-orange-800 mb-4 hover:text-orange-700 transition-colors duration-300">
              See What You Can Create
            </h2>
            <p className="text-lg text-gray-600 font-inter max-w-2xl mx-auto">
              Get inspired by these beautiful wall layouts created with our designer
            </p>
          </div>
          
          {/* Interactive Sample Wall Layout */}
          <div className="relative max-w-4xl mx-auto group">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-200 hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
              {/* Wall mockup with hover effects */}
              <div className="relative bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl p-8 min-h-[400px] overflow-hidden">
                {/* Interactive Gallery wall layout */}
                <div className="grid grid-cols-4 grid-rows-3 gap-4 h-full">
                  <div className="col-span-2 bg-white border-4 border-orange-600 rounded-lg shadow-md flex items-center justify-center hover:bg-orange-50 hover:scale-105 transition-all duration-300 cursor-pointer group/item">
                    <span className="text-orange-600 text-sm font-medium group-hover/item:text-orange-700">Large Photo</span>
                  </div>
                  <div className="bg-white border-4 border-orange-600 rounded-lg shadow-md flex items-center justify-center hover:bg-orange-50 hover:scale-105 transition-all duration-300 cursor-pointer group/item">
                    <span className="text-orange-600 text-xs font-medium group-hover/item:text-orange-700">Medium</span>
                  </div>
                  <div className="bg-white border-4 border-orange-600 rounded-lg shadow-md flex items-center justify-center hover:bg-orange-50 hover:scale-105 transition-all duration-300 cursor-pointer group/item">
                    <span className="text-orange-600 text-xs font-medium group-hover/item:text-orange-700">Medium</span>
                  </div>
                  <div className="bg-white border-4 border-orange-600 rounded-lg shadow-md flex items-center justify-center hover:bg-orange-50 hover:scale-105 transition-all duration-300 cursor-pointer group/item">
                    <span className="text-orange-600 text-xs font-medium group-hover/item:text-orange-700">Small</span>
                  </div>
                  <div className="bg-white border-4 border-orange-600 rounded-lg shadow-md flex items-center justify-center hover:bg-orange-50 hover:scale-105 transition-all duration-300 cursor-pointer group/item">
                    <span className="text-orange-600 text-xs font-medium group-hover/item:text-orange-700">Small</span>
                  </div>
                  <div className="col-span-2 bg-white border-4 border-orange-600 rounded-lg shadow-md flex items-center justify-center hover:bg-orange-50 hover:scale-105 transition-all duration-300 cursor-pointer group/item">
                    <span className="text-orange-600 text-sm font-medium group-hover/item:text-orange-700">Wide Photo</span>
                  </div>
                  <div className="bg-white border-4 border-orange-600 rounded-lg shadow-md flex items-center justify-center hover:bg-orange-50 hover:scale-105 transition-all duration-300 cursor-pointer group/item">
                    <span className="text-orange-600 text-xs font-medium group-hover/item:text-orange-700">Square</span>
                  </div>
                  <div className="bg-white border-4 border-orange-600 rounded-lg shadow-md flex items-center justify-center hover:bg-orange-50 hover:scale-105 transition-all duration-300 cursor-pointer group/item">
                    <span className="text-orange-600 text-xs font-medium group-hover/item:text-orange-700">Square</span>
                  </div>
                  <div className="bg-white border-4 border-orange-600 rounded-lg shadow-md flex items-center justify-center hover:bg-orange-50 hover:scale-105 transition-all duration-300 cursor-pointer group/item">
                    <span className="text-orange-600 text-xs font-medium group-hover/item:text-orange-700">Square</span>
                  </div>
                  <div className="bg-white border-4 border-orange-600 rounded-lg shadow-md flex items-center justify-center hover:bg-orange-50 hover:scale-105 transition-all duration-300 cursor-pointer group/item">
                    <span className="text-orange-600 text-xs font-medium group-hover/item:text-orange-700">Square</span>
                  </div>
                </div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                  <div className="text-center text-orange-700">
                    <svg className="w-12 h-12 mx-auto mb-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <p className="font-medium">Click to explore</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-6">
                <p className="text-gray-600 font-inter group-hover:text-orange-700 transition-colors duration-300">
                  Arrange your photos in beautiful, balanced layouts with precise spacing and alignment
                </p>
                <button 
                  onClick={handleCreateWall}
                  className="mt-4 text-orange-600 hover:text-orange-700 font-medium transition-colors duration-300 underline hover:no-underline"
                >
                  Try it yourself →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Interactive Features Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Enhanced subtle background animation layer */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Gentle flowing background elements */}
          <div 
            className="absolute top-32 left-1/4 w-48 h-48 bg-orange-200 opacity-6 blur-3xl rounded-full"
            style={{animation: 'cloudDrift 120s linear infinite'}}
          ></div>
          <div 
            className="absolute bottom-32 right-1/4 w-36 h-36 bg-orange-300 opacity-8 blur-2xl"
            style={{animation: 'abstractMorph 80s ease-in-out infinite'}}
          ></div>
          
          {/* Subtle flowing lines */}
          <svg className="absolute inset-0 w-full h-full opacity-4" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path 
              d="M20,10 Q60,25 80,10" 
              stroke="rgba(251, 146, 60, 0.3)" 
              strokeWidth="0.1" 
              fill="none"
              style={{animation: 'backgroundFlow 50s ease-in-out infinite'}}
            />
            <path 
              d="M10,90 Q40,75 90,90" 
              stroke="rgba(234, 88, 12, 0.2)" 
              strokeWidth="0.12" 
              fill="none"
              style={{animation: 'backgroundFlow 65s ease-in-out infinite reverse'}}
            />
          </svg>
        </div>
        
        {/* Animated background patterns */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-orange-400/20 to-transparent animate-pulse" style={{animationDuration: '6s'}}></div>
          <div className="absolute top-20 right-20 w-40 h-40 border-2 border-orange-300 rounded-full" style={{animation: 'float 18s ease-in-out infinite'}}></div>
          <div className="absolute bottom-32 left-16 w-28 h-28 border border-orange-200 transform rotate-12" style={{animation: 'slowRotate 30s linear infinite'}}></div>
          <div className="absolute top-1/2 right-1/4 w-36 h-8 bg-orange-100 rounded-full" style={{animation: 'drift 22s ease-in-out infinite'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-poppins text-orange-800 mb-4">
              Why Choose Our Wall Designer?
            </h2>
            <p className="text-lg text-gray-600 font-inter max-w-2xl mx-auto">
              Professional tools made simple for everyone to create beautiful wall layouts
            </p>
          </div>
          
          {/* Interactive Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div 
              className={`text-center p-6 rounded-2xl bg-gradient-to-b from-orange-100 to-orange-200 shadow-md hover:shadow-xl transition-all duration-500 transform hover:scale-105 cursor-pointer ${activeFeature === 0 ? 'ring-4 ring-orange-400 ring-opacity-50' : ''}`}
              onMouseEnter={() => setActiveFeature(0)}
            >
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-700 transition-colors duration-300 hover:scale-110 transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold font-poppins text-orange-800 mb-3 hover:text-orange-700 transition-colors duration-300">
                Upload & Arrange
              </h3>
              <p className="text-gray-600 font-inter">
                Upload your photos and arrange them with precision using our intuitive drag and drop interface
              </p>
              <div className={`mt-4 text-sm text-orange-700 font-medium transition-opacity duration-300 ${activeFeature === 0 ? 'opacity-100' : 'opacity-0'}`}>
                ✨ Currently Active
              </div>
            </div>
            
            {/* Feature 2 */}
            <div 
              className={`text-center p-6 rounded-2xl bg-gradient-to-b from-orange-100 to-orange-200 shadow-md hover:shadow-xl transition-all duration-500 transform hover:scale-105 cursor-pointer ${activeFeature === 1 ? 'ring-4 ring-orange-400 ring-opacity-50' : ''}`}
              onMouseEnter={() => setActiveFeature(1)}
            >
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-orange-700 transition-colors duration-300 hover:scale-110 transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold font-poppins text-orange-800 mb-3 hover:text-orange-700 transition-colors duration-300">
                Customize Design
              </h3>
              <p className="text-gray-600 font-inter">
                Choose from beautiful backgrounds and decorative elements to enhance your wall design
              </p>
              <div className={`mt-4 text-sm text-orange-700 font-medium transition-opacity duration-300 ${activeFeature === 1 ? 'opacity-100' : 'opacity-0'}`}>
                ✨ Currently Active
              </div>
            </div>
            
            {/* Feature 3 */}
            <div 
              className={`text-center p-6 rounded-2xl bg-gradient-to-b from-orange-100 to-orange-200 shadow-md hover:shadow-xl transition-all duration-500 transform hover:scale-105 cursor-pointer ${activeFeature === 2 ? 'ring-4 ring-orange-400 ring-opacity-50' : ''}`}
              onMouseEnter={() => setActiveFeature(2)}
            >
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-orange-700 transition-colors duration-300 hover:scale-110 transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold font-poppins text-orange-800 mb-3 hover:text-orange-700 transition-colors duration-300">
                Share & Export
              </h3>
              <p className="text-gray-600 font-inter">
                Export your creations or export them in high quality for professional printing
              </p>
              <div className={`mt-4 text-sm text-orange-700 font-medium transition-opacity duration-300 ${activeFeature === 2 ? 'opacity-100' : 'opacity-0'}`}>
                ✨ Currently Active
              </div>
            </div>
          </div>
          
          {/* Call to Action in Features Section */}
          <div className="text-center mt-16">
            <button
              onClick={handleGetStarted}
              className="group bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Creating Now
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
          </div>
        </div>
      </section>
      
      {/* Interactive Newsletter/CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 relative overflow-hidden">
        {/* Enhanced subtle background animation layer */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Gentle flowing background elements for newsletter */}
          <div 
            className="absolute top-20 left-20 w-40 h-40 bg-white opacity-5 blur-3xl rounded-full"
            style={{animation: 'cloudDrift 100s linear infinite'}}
          ></div>
          <div 
            className="absolute bottom-20 right-20 w-32 h-32 bg-orange-300 opacity-8 blur-2xl"
            style={{animation: 'abstractMorph 60s ease-in-out infinite reverse'}}
          ></div>
          
          {/* Flowing lines effect */}
          <svg className="absolute inset-0 w-full h-full opacity-8" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path 
              d="M0,40 Q25,20 50,40 T100,40" 
              stroke="rgba(255, 255, 255, 0.2)" 
              strokeWidth="0.15" 
              fill="none"
              style={{animation: 'backgroundFlow 40s ease-in-out infinite'}}
            />
            <path 
              d="M0,60 Q25,80 50,60 T100,60" 
              stroke="rgba(255, 255, 255, 0.15)" 
              strokeWidth="0.1" 
              fill="none"
              style={{animation: 'backgroundFlow 55s ease-in-out infinite reverse'}}
            />
          </svg>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 border-2 border-white rounded-full" style={{animation: 'slowRotate 25s linear infinite'}}></div>
          <div className="absolute bottom-10 left-10 w-20 h-20 border border-white rounded-lg animate-pulse" style={{animationDuration: '5s'}}></div>
          <div className="absolute bottom-1/3 right-1/5 w-24 h-6 bg-white/20 rounded-full" style={{animation: 'drift 20s ease-in-out infinite reverse'}}></div>
          <div className="absolute top-3/4 left-1/3 w-16 h-16 border border-white/30 transform rotate-45" style={{animation: 'float 16s ease-in-out infinite'}}></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold font-poppins text-white mb-6 animate-fade-in-rotate">
            Ready to Transform Your Walls?
          </h2>
          <p className="text-xl text-white/90 font-inter mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied users who have created stunning wall layouts with our intuitive designer.
          </p>
          
          {/* Interactive signup form */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto mb-8">
            <input
              type="email"
              placeholder="Enter your email for updates"
              className="w-full sm:flex-1 px-6 py-3 rounded-lg border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all duration-300"
            />
            <button className="w-full sm:w-auto bg-white text-orange-600 font-semibold px-6 py-3 rounded-lg hover:bg-white/90 transition-all duration-300 transform hover:scale-105 btn-interactive">
              Get Updates
            </button>
          </div>
          
          {/* Social proof */}
          <div className="flex justify-center items-center space-x-8 text-white/80">
            <div className="text-center group cursor-pointer">
              <div className="text-2xl font-bold group-hover:scale-110 transition-transform duration-300">⭐⭐⭐⭐⭐</div>
              <div className="text-sm">4.9/5 Rating</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-2xl font-bold group-hover:scale-110 transition-transform duration-300">1000+</div>
              <div className="text-sm">Happy Users</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-2xl font-bold group-hover:scale-110 transition-transform duration-300">24/7</div>
              <div className="text-sm">Support</div>
            </div>
          </div>
          
          {/* Main CTA */}
          <div className="mt-8">
            <button
              onClick={handleGetStarted}
              className="group bg-white text-orange-600 font-bold py-4 px-8 rounded-xl text-lg shadow-xl hover:shadow-2xl transform hover:scale-110 hover:-translate-y-2 transition-all duration-300 btn-interactive animate-glow"
            >
              <span className="flex items-center gap-2">
                Start Your Free Design
                <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PublicLanding;
