import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Footer } from '../components/layout';

const PublicLanding = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-rotate features
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);


  const handleGetStarted = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/register');
    }, 1200); // Simulate loading for 1.2s
  };

  const handleCreateWall = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-slate-900 overflow-hidden">
      {/* Subtle Background Animation Layer */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Main background container - Dark theme optimized */}
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Simplified background animation for better performance */}
          <div className="hidden sm:block">
            <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path 
                d="M0,50 Q25,25 50,50 T100,50" 
                stroke="url(#darkFlowGradient)" 
                strokeWidth="0.5" 
                fill="none"
                style={{animation: 'backgroundFlow 40s ease-in-out infinite'}}
              />
              <path 
                d="M0,30 Q25,5 50,30 T100,30" 
                stroke="url(#darkFlowGradient)" 
                strokeWidth="0.3" 
                fill="none"
                style={{animation: 'backgroundFlow 50s ease-in-out infinite reverse', animationDelay: '-10s'}}
              />
              <path 
                d="M0,70 Q25,95 50,70 T100,70" 
                stroke="url(#darkFlowGradient)" 
                strokeWidth="0.4" 
                fill="none"
                style={{animation: 'backgroundFlow 35s ease-in-out infinite', animationDelay: '-25s'}}
              />
              <defs>
                <linearGradient id="darkFlowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(249, 115, 22, 0.4)" />
                  <stop offset="50%" stopColor="rgba(251, 146, 60, 0.6)" />
                  <stop offset="100%" stopColor="rgba(234, 88, 12, 0.4)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          
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
      <section className="relative min-h-screen flex items-center justify-center pt-20 bg-slate-900 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-slate-900 overflow-hidden">
          {/* Floating Picture Frame Mockups with Animations */}
          <div className="absolute inset-0 opacity-15">
            {/* Top left frames */}
            <div className="absolute top-20 left-10 w-32 h-24 bg-slate-700/50 border-4 border-orange-500 rounded-lg shadow-md transform rotate-12 hover:scale-110 transition-all duration-500" style={{animation: 'gentleFloat 20s ease-in-out infinite'}}>
              <div className="w-full h-full bg-gradient-to-br from-orange-100/20 to-orange-200/20 rounded"></div>
            </div>
            <div className="absolute top-32 left-32 w-20 h-28 bg-slate-700/50 border-4 border-orange-500 rounded-lg shadow-md transform -rotate-6 hover:rotate-0 transition-all duration-700" style={{animation: 'drift 25s ease-in-out infinite, slowRotate 40s linear infinite'}}>
              <div className="w-full h-full bg-gradient-to-br from-orange-100/20 to-orange-200/20 rounded"></div>
            </div>
            
            {/* Top right frames */}
            <div className="absolute top-40 right-20 w-28 h-20 bg-slate-700/50 border-4 border-orange-500 rounded-lg shadow-md transform rotate-6 hover:-rotate-3 transition-all duration-500" style={{animation: 'float 18s ease-in-out infinite reverse'}}>
              <div className="w-full h-full bg-gradient-to-br from-orange-100/20 to-orange-200/20 rounded"></div>
            </div>
            <div className="absolute top-16 right-40 w-24 h-32 bg-slate-700/50 border-4 border-orange-500 rounded-lg shadow-md transform -rotate-12 hover:rotate-6 transition-all duration-700" style={{animation: 'gentleFloat 22s ease-in-out infinite, slowRotate 35s linear infinite reverse'}}>
              <div className="w-full h-full bg-gradient-to-br from-orange-100/20 to-orange-200/20 rounded"></div>
            </div>
            
            {/* Bottom frames */}
            <div className="absolute bottom-40 left-20 w-36 h-24 bg-slate-700/50 border-4 border-orange-500 rounded-lg shadow-md transform rotate-3 hover:scale-105 transition-all duration-500" style={{animation: 'drift 30s ease-in-out infinite reverse'}}>
              <div className="w-full h-full bg-gradient-to-br from-orange-100/20 to-orange-200/20 rounded"></div>
            </div>
            <div className="absolute bottom-20 right-16 w-24 h-32 bg-slate-700/50 border-4 border-orange-500 rounded-lg shadow-md transform -rotate-8 hover:rotate-4 transition-all duration-700" style={{animation: 'float 16s ease-in-out infinite, slowRotate 45s linear infinite'}}>
              <div className="w-full h-full bg-gradient-to-br from-orange-100/20 to-orange-200/20 rounded"></div>
            </div>
            
            {/* Center large frame with special animation */}
            <div className="absolute top-1/3 right-1/4 w-40 h-28 bg-slate-700/50 border-4 border-orange-500 rounded-lg shadow-lg rotate-3 hover:scale-110 hover:rotate-0 transition-all duration-700" style={{animation: 'gentleFloat 24s ease-in-out infinite reverse, slowRotate 50s linear infinite'}}>
              <div className="w-full h-full bg-gradient-to-br from-orange-100/20 to-orange-200/20 rounded"></div>
            </div>
          </div>
        </div>
        
        {/* Hero Content with Animations */}
        <div className={`relative z-10 text-center text-white px-6 sm:px-8 lg:px-12 max-w-5xl mx-auto transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-8xl font-black font-poppins mb-8 leading-tight tracking-tight">
            <span className="inline-block animate-pulse text-white drop-shadow-2xl" style={{textShadow: '0 4px 20px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)'}}>Design your dream</span>
            <span className="block text-orange-400 hover:text-orange-300 transition-all duration-500 cursor-default drop-shadow-xl transform hover:scale-105" style={{textShadow: '0 4px 15px rgba(0,0,0,0.4)'}}>wall layout</span>
          </h1>
          
          <p className={`text-xl sm:text-2xl lg:text-3xl font-inter mb-12 max-w-3xl mx-auto leading-relaxed text-slate-300 font-medium transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{textShadow: '0 2px 10px rgba(0,0,0,0.4)', letterSpacing: '0.5px', lineHeight: '1.6'}}>
            Create stunning visual compositions with our intuitive wall design tool.
            Upload your photos, arrange decorative elements, and bring your creative vision to life.
          </p>
          
          {/* Interactive CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <button
              onClick={handleGetStarted}
              className="btn-cta group transform hover:scale-110 hover:-translate-y-2 active:scale-95 transition-all duration-300 ease-out shadow-2xl hover:shadow-3xl"
              style={{boxShadow: '0 20px 40px rgba(0,0,0,0.15), 0 8px 16px rgba(0,0,0,0.1)'}}
            >
              <span className="btn-content">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Get Started
              </span>
              <div className="btn-overlay"></div>
            </button>
            
            <button
              onClick={handleCreateWall}
              className="btn-cta group bg-transparent border-3 border-white hover:bg-white text-white hover:text-orange-600 transform hover:scale-110 hover:-translate-y-2 active:scale-95 transition-all duration-300 ease-out shadow-xl hover:shadow-2xl"
              style={{boxShadow: '0 15px 30px rgba(255,255,255,0.2), 0 6px 12px rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)'}}
            >
              <span className="btn-content font-semibold">
                Create Wall 
                <svg className="w-6 h-6 btn-arrow transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
          </div>
          
          {/* Interactive Stats */}
          <div className={`mt-16 grid grid-cols-3 gap-12 max-w-4xl mx-auto transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="text-center group cursor-pointer transform hover:scale-110 hover:-translate-y-2 transition-all duration-300 ease-out">
              <div className="w-20 h-20 mx-auto bg-slate-800/90 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-xl group-hover:shadow-2xl border border-orange-500/20" style={{boxShadow: '0 10px 25px rgba(0,0,0,0.3), 0 4px 10px rgba(0,0,0,0.2)'}}>
                <svg className="w-10 h-10 text-orange-400 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-base text-white font-bold mb-1" style={{textShadow: '0 2px 8px rgba(0,0,0,0.5)'}}>Upload & Arrange</div>
              <div className="text-sm text-slate-300 leading-relaxed" style={{textShadow: '0 1px 4px rgba(0,0,0,0.4)'}}>Your photos and arrange</div>
              <div className="text-sm text-slate-300 leading-relaxed" style={{textShadow: '0 1px 4px rgba(0,0,0,0.4)'}}>them with precision</div>
            </div>
            <div className="text-center group cursor-pointer transform hover:scale-110 hover:-translate-y-2 transition-all duration-300 ease-out">
              <div className="w-20 h-20 mx-auto bg-slate-800/90 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-xl group-hover:shadow-2xl border border-orange-500/20" style={{boxShadow: '0 10px 25px rgba(0,0,0,0.3), 0 4px 10px rgba(0,0,0,0.2)'}}>
                <svg className="w-10 h-10 text-orange-400 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <div className="text-base text-white font-bold mb-1" style={{textShadow: '0 2px 8px rgba(0,0,0,0.5)'}}>Customize Design</div>
              <div className="text-sm text-slate-300 leading-relaxed" style={{textShadow: '0 1px 4px rgba(0,0,0,0.4)'}}>Choose from beautiful</div>
              <div className="text-sm text-slate-300 leading-relaxed" style={{textShadow: '0 1px 4px rgba(0,0,0,0.4)'}}>backgrounds and decorative elements</div>
            </div>
            <div className="text-center group cursor-pointer transform hover:scale-110 hover:-translate-y-2 transition-all duration-300 ease-out">
              <div className="w-20 h-20 mx-auto bg-slate-800/90 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-xl group-hover:shadow-2xl border border-orange-500/20" style={{boxShadow: '0 10px 25px rgba(0,0,0,0.3), 0 4px 10px rgba(0,0,0,0.2)'}}>
                <svg className="w-10 h-10 text-orange-400 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <div className="text-base text-white font-bold mb-1" style={{textShadow: '0 2px 8px rgba(0,0,0,0.5)'}}>Share & Export</div>
              <div className="text-sm text-slate-300 leading-relaxed" style={{textShadow: '0 1px 4px rgba(0,0,0,0.4)'}}>Export your creations or</div>
              <div className="text-sm text-slate-300 leading-relaxed" style={{textShadow: '0 1px 4px rgba(0,0,0,0.4)'}}>export them in high quality</div>
            </div>
          </div>
        </div>
        
      </section>
      
      {/* Interactive Wall Layout Preview Section */}
      <section className="py-20 bg-slate-800 relative overflow-hidden">
        {/* Subtle animated background */}
        <div className="absolute inset-0 pointer-events-none">
         
        </div>
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex flex-col items-center justify-center mb-4">
              <img 
                src="/mialtar-logo.png" 
                alt="MIALTAR Logo" 
                className="h-16 mb-2 select-none" 
                style={{ userSelect: 'none' }} 
              />
              <h2 className="text-4xl sm:text-5xl font-bold font-poppins text-white mb-2 tracking-wider">
                MIALTAR
              </h2>
            </div>
            <p className="text-lg text-slate-300 font-inter max-w-2xl mx-auto">
              Get inspired by these beautiful wall layouts created with <span className="font-bold text-orange-400">MIALTAR</span>
            </p>
          </div>

          {/* Wall Layout Preview */}
          <div className="group relative mx-auto rounded-2xl sm:rounded-[2.5rem] p-0 sm:p-2 bg-gradient-to-br from-slate-700/50 via-slate-600/30 to-slate-700/50 shadow-xl flex items-center justify-center w-full max-w-[99vw] sm:w-[800px] md:w-[1100px] h-auto sm:h-[600px] md:h-[800px] max-h-[80vw] sm:max-h-none transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-300/20 border border-orange-500/20">
            {/* Image - bigger, no border */}
            <img
              src="/sample-modern-wall.png"
              alt="MIALTAR Wall Layout Example"
              className="object-contain w-full h-full max-h-[420px] sm:max-h-[440px] md:max-h-[560px] rounded-2xl sm:rounded-[2.5rem] border-4 border-slate-800 shadow-2xl bg-gradient-to-br from-slate-800/40 to-slate-900/60"
              style={{
                background: 'linear-gradient(135deg, rgba(71, 85, 105, 0.3) 0%, rgba(51, 65, 85, 0.5) 100%)',
                display: 'block',
                margin: '0 auto'
              }}
            />
          </div>
        </div>
      </section>
      
      {/* Interactive Features Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        {/* Fade-in keyframes and classes */}
        <style>{`
          @keyframes fadeInTop {
            from { opacity: 0; transform: translateY(-32px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeInBottom {
            from { opacity: 0; transform: translateY(32px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .fade-in-top {
            animation: fadeInTop 0.8s ease-out both;
          }
          .fade-in-bottom {
            animation: fadeInBottom 1s ease-out both;
            animation-delay: 0.3s;
          }

          /* Modern feature card hover animation */
          .feature-card {
            transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;
            opacity: 0;
            transform: translateY(30px);
          }
          .feature-card:hover {
            box-shadow: 0 12px 32px 0 rgba(251,146,60,0.18), 0 2px 8px 0 rgba(0,0,0,0.08);
            transform: translateY(-10px) scale(1.02);
            z-index: 2;
          }
          .feature-icon {
            transition: transform 0.3s ease-in-out;
          }
          .feature-card:hover .feature-icon {
            transform: rotate(5deg) scale(1.02);
          }

          /* Pulse animation for button */
          @keyframes pulseOnce {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(251,146,60,0.3); }
            50% { transform: scale(1.05); box-shadow: 0 0 0 8px rgba(251,146,60,0.12); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(251,146,60,0.0); }
          }
          .btn-pulse-once {
            animation: pulseOnce 0.8s cubic-bezier(0.4,0,0.2,1) 0.2s 1 both;
          }
          .btn-animated {
            transition: background 0.2s cubic-bezier(0.4,0,0.2,1), transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s cubic-bezier(0.4,0,0.2,1);
            background: linear-gradient(90deg, #fb923c 0%, #f97316 100%);
          }
          .btn-animated:hover {
            background: linear-gradient(90deg, #ea7c1a 0%, #d65d0a 100%);
            transform: scale(1.05);
            box-shadow: 0 8px 24px 0 rgba(251,146,60,0.18);
          }
          .btn-spinner {
            display: inline-block;
            width: 1.5rem;
            height: 1.5rem;
            border: 3px solid #fff;
            border-top: 3px solid #fb923c;
            border-radius: 50%;
            animation: spin 0.7s linear infinite;
            vertical-align: middle;
            margin-right: 0.5rem;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .fade-in-up-1 {
            animation: fadeInUp 0.6s ease-out 0.2s both;
          }
          .fade-in-up-2 {
            animation: fadeInUp 0.6s ease-out 0.4s both;
          }
          .fade-in-up-3 {
            animation: fadeInUp 0.6s ease-out 0.6s both;
          }
        `}</style>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight" style={{textShadow: '0 4px 20px rgba(0,0,0,0.4)', letterSpacing: '-0.02em'}}>
              Why Choose Our Wall Designer?
            </h2>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium" style={{textShadow: '0 2px 10px rgba(0,0,0,0.3)'}}>
              Professional tools made simple for everyone to create beautiful wall layouts
            </p>
          </div>
          
          {/* Interactive Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
            {/* Feature 1 */}
            <div 
              className={`bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 lg:p-10 transition-all duration-700 delay-100 group hover:bg-slate-800/80 hover:scale-105 hover:-translate-y-3 cursor-pointer ${activeFeature === 0 ? 'ring-4 ring-orange-400 ring-opacity-50' : ''}`}
              style={{boxShadow: '0 20px 40px rgba(0,0,0,0.2), 0 4px 15px rgba(0,0,0,0.1)', backdropFilter: 'blur(20px)'}}
              onMouseEnter={() => setActiveFeature(0)}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" style={{boxShadow: '0 8px 25px rgba(255, 125, 45, 0.3)'}}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 group-hover:text-orange-300 transition-colors duration-300" style={{textShadow: '0 2px 8px rgba(0,0,0,0.3)'}}>
                Upload & Arrange
              </h3>
              <p className="text-slate-300 leading-relaxed text-lg group-hover:text-slate-200 transition-colors duration-300" style={{textShadow: '0 1px 4px rgba(0,0,0,0.2)'}}>
                Upload your photos and arrange them with precision using our intuitive drag and drop interface
              </p>
              <div className={`mt-6 text-sm text-orange-400 font-medium transition-opacity duration-300 ${activeFeature === 0 ? 'opacity-100' : 'opacity-0'}`}>
                ✨ Currently Active
              </div>
            </div>
            {/* Feature 2 */}
            <div 
              className={`bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 lg:p-10 transition-all duration-700 delay-200 group hover:bg-slate-800/80 hover:scale-105 hover:-translate-y-3 cursor-pointer ${activeFeature === 1 ? 'ring-4 ring-orange-400 ring-opacity-50' : ''}`}
              style={{boxShadow: '0 20px 40px rgba(0,0,0,0.2), 0 4px 15px rgba(0,0,0,0.1)', backdropFilter: 'blur(20px)'}}
              onMouseEnter={() => setActiveFeature(1)}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" style={{boxShadow: '0 8px 25px rgba(255, 125, 45, 0.3)'}}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 group-hover:text-orange-300 transition-colors duration-300" style={{textShadow: '0 2px 8px rgba(0,0,0,0.3)'}}>
                Customize Design
              </h3>
              <p className="text-slate-300 leading-relaxed text-lg group-hover:text-slate-200 transition-colors duration-300" style={{textShadow: '0 1px 4px rgba(0,0,0,0.2)'}}>
                Choose from beautiful backgrounds and decorative elements to enhance your wall design
              </p>
              <div className={`mt-6 text-sm text-orange-400 font-medium transition-opacity duration-300 ${activeFeature === 1 ? 'opacity-100' : 'opacity-0'}`}>
                ✨ Currently Active
              </div>
            </div>
            {/* Feature 3 */}
            <div 
              className={`bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 lg:p-10 transition-all duration-700 delay-300 group hover:bg-slate-800/80 hover:scale-105 hover:-translate-y-3 cursor-pointer ${activeFeature === 2 ? 'ring-4 ring-orange-400 ring-opacity-50' : ''}`}
              style={{boxShadow: '0 20px 40px rgba(0,0,0,0.2), 0 4px 15px rgba(0,0,0,0.1)', backdropFilter: 'blur(20px)'}}
              onMouseEnter={() => setActiveFeature(2)}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" style={{boxShadow: '0 8px 25px rgba(255, 125, 45, 0.3)'}}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 group-hover:text-orange-300 transition-colors duration-300" style={{textShadow: '0 2px 8px rgba(0,0,0,0.3)'}}>
                Share & Export
              </h3>
              <p className="text-slate-300 leading-relaxed text-lg group-hover:text-slate-200 transition-colors duration-300" style={{textShadow: '0 1px 4px rgba(0,0,0,0.2)'}}>
                Export your creations or export them in high quality for professional printing
              </p>
              <div className={`mt-6 text-sm text-orange-400 font-medium transition-opacity duration-300 ${activeFeature === 2 ? 'opacity-100' : 'opacity-0'}`}>
                ✨ Currently Active
              </div>
            </div>
          </div>
          
          {/* Call to Action in Features Section */}
          <div className="text-center mt-20">
            <button
              onClick={handleGetStarted}
              className={`btn-cta group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-10 rounded-2xl transform hover:scale-110 hover:-translate-y-2 active:scale-95 transition-all duration-300 ease-out shadow-2xl hover:shadow-3xl ${isLoading ? 'pointer-events-none opacity-80' : ''}`}
              style={{boxShadow: '0 20px 40px rgba(255, 125, 45, 0.3), 0 8px 16px rgba(255, 125, 45, 0.2)', backdropFilter: 'blur(10px)'}}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner" />
                  <span className="ml-2 text-lg">Loading...</span>
                </>
              ) : (
                <span className="btn-content flex items-center gap-3 text-lg">
                  Start Creating Now
                  <svg className="w-6 h-6 btn-arrow transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              )}
            </button>
          </div>
        </div>
      </section>
      
      {/* Interactive Newsletter/CTA Section */}
      <section className="py-20 bg-slate-800 relative overflow-hidden">
        {/* Subtle animated background */}
        <div className="absolute inset-0 pointer-events-none">
          
          {/* Flowing lines effect */}
          <svg className="absolute inset-0 w-full h-full opacity-8" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path 
              d="M0,40 Q25,20 50,40 T100,40" 
              stroke="rgba(255, 125, 45, 0.2)" 
              strokeWidth="0.15" 
              fill="none"
              style={{animation: 'backgroundFlow 40s ease-in-out infinite'}}
            />
            <path 
              d="M0,60 Q25,80 50,60 T100,60" 
              stroke="rgba(255, 125, 45, 0.15)" 
              strokeWidth="0.1" 
              fill="none"
              style={{animation: 'backgroundFlow 55s ease-in-out infinite reverse'}}
            />
          </svg>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 border-2 border-orange-400 rounded-full" style={{animation: 'slowRotate 25s linear infinite'}}></div>
          <div className="absolute bottom-10 left-10 w-20 h-20 border border-orange-400 rounded-lg animate-pulse" style={{animationDuration: '5s'}}></div>
          <div className="absolute bottom-1/3 right-1/5 w-24 h-6 bg-orange-400/20 rounded-full" style={{animation: 'drift 20s ease-in-out infinite reverse'}}></div>
          <div className="absolute top-3/4 left-1/3 w-16 h-16 border border-orange-400/30 transform rotate-45" style={{animation: 'float 16s ease-in-out infinite'}}></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold font-poppins text-white mb-6 animate-fade-in-rotate">
            Ready to Transform Your Walls?
          </h2>
          <p className="text-xl text-slate-300 font-inter mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied users who have created stunning wall layouts with our intuitive designer.
          </p>
          
          {/* Interactive signup form */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto mb-8">
            <input
              type="email"
              placeholder="Enter your email for updates"
              className="w-full sm:flex-1 px-6 py-3 rounded-lg border-2 border-orange-400/30 bg-slate-700/50 backdrop-blur-sm text-white placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:bg-slate-700/70 transition-all duration-300"
            />
            <button className="btn-cta bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
              <span className="btn-content">Get Updates</span>
            </button>
          </div>
          
          {/* Social proof */}
          <div className="flex justify-center items-center space-x-8 text-slate-300">
            <div className="text-center group cursor-pointer">
              <div className="text-2xl font-bold group-hover:scale-110 transition-transform duration-300 text-orange-400">⭐⭐⭐⭐⭐</div>
              <div className="text-sm">4.9/5 Rating</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-2xl font-bold group-hover:scale-110 transition-transform duration-300 text-orange-400">1000+</div>
              <div className="text-sm">Happy Users</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-2xl font-bold group-hover:scale-110 transition-transform duration-300 text-orange-400">24/7</div>
              <div className="text-sm">Support</div>
            </div>
          </div>
          
          {/* Main CTA */}
          <div className="mt-8">
            <button
              onClick={handleGetStarted}
              className="btn-cta group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white animate-glow transform hover:scale-110 hover:-translate-y-2 transition-all duration-300"
              style={{boxShadow: '0 20px 40px rgba(255, 125, 45, 0.3), 0 8px 16px rgba(255, 125, 45, 0.2)'}}
            >
              <span className="btn-content flex items-center gap-2">
                Start Your Free Design
                <svg className="w-5 h-5 btn-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
