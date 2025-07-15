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
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-secondary to-primary-light overflow-hidden">
      {/* Navigation */}
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-light via-secondary to-accent">
          {/* Floating Picture Frame Mockups with Animations */}
          <div className="absolute inset-0 opacity-20">
            {/* Top left frames */}
            <div className="absolute top-20 left-10 w-32 h-24 bg-white border-4 border-primary-dark rounded-lg shadow-md transform rotate-12 animate-pulse hover:scale-110 transition-all duration-500">
              <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-300 rounded animate-pulse"></div>
            </div>
            <div className="absolute top-32 left-32 w-20 h-28 bg-white border-4 border-primary-dark rounded-lg shadow-md transform -rotate-6 hover:rotate-0 transition-all duration-700 animate-bounce delay-100">
              <div className="w-full h-full bg-gradient-to-br from-green-200 to-green-300 rounded"></div>
            </div>
            
            {/* Top right frames */}
            <div className="absolute top-40 right-20 w-28 h-20 bg-white border-4 border-primary-dark rounded-lg shadow-md transform rotate-6 hover:-rotate-3 transition-all duration-500 animate-pulse delay-200">
              <div className="w-full h-full bg-gradient-to-br from-purple-200 to-purple-300 rounded"></div>
            </div>
            <div className="absolute top-16 right-40 w-24 h-32 bg-white border-4 border-primary-dark rounded-lg shadow-md transform -rotate-12 hover:rotate-6 transition-all duration-700 animate-bounce delay-300">
              <div className="w-full h-full bg-gradient-to-br from-pink-200 to-pink-300 rounded"></div>
            </div>
            
            {/* Bottom frames */}
            <div className="absolute bottom-40 left-20 w-36 h-24 bg-white border-4 border-primary-dark rounded-lg shadow-md transform rotate-3 hover:scale-105 transition-all duration-500 animate-pulse delay-400">
              <div className="w-full h-full bg-gradient-to-br from-yellow-200 to-yellow-300 rounded"></div>
            </div>
            <div className="absolute bottom-20 right-16 w-24 h-32 bg-white border-4 border-primary-dark rounded-lg shadow-md transform -rotate-8 hover:rotate-4 transition-all duration-700 animate-bounce delay-500">
              <div className="w-full h-full bg-gradient-to-br from-red-200 to-red-300 rounded"></div>
            </div>
            
            {/* Center large frame with special animation */}
            <div className="absolute top-1/3 right-1/4 w-40 h-28 bg-white border-4 border-primary-dark rounded-lg shadow-lg rotate-3 hover:scale-110 hover:rotate-0 transition-all duration-700 animate-pulse">
              <div className="w-full h-full bg-gradient-to-br from-indigo-200 to-indigo-300 rounded"></div>
            </div>
          </div>
          
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-ping"></div>
            <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-primary-dark rounded-full animate-ping delay-75"></div>
            <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-accent rounded-full animate-ping delay-150"></div>
            <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-primary rounded-full animate-ping delay-300"></div>
          </div>
        </div>
        
        {/* Hero Content with Animations */}
        <div className={`relative z-10 text-center text-primary-dark px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold font-poppins mb-6 leading-tight">
            <span className="inline-block animate-pulse">Design Your Dream</span>
            <span className="block text-primary hover:text-primary-dark transition-colors duration-300 cursor-default">Wall Layout</span>
          </h1>
          
          <p className={`text-lg sm:text-xl lg:text-2xl font-inter mb-8 max-w-2xl mx-auto leading-relaxed text-gray-700 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            Create stunning picture walls with our intuitive design tool. Arrange, customize, and visualize your perfect wall layout in minutes.
          </p>
          
          {/* Interactive CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <button
              onClick={handleGetStarted}
              className="group w-full sm:w-auto bg-primary-dark hover:bg-primary transition-all duration-300 text-white font-semibold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 active:scale-95 relative overflow-hidden btn-interactive"
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-light opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <button
              onClick={handleCreateWall}
              className="group w-full sm:w-auto bg-transparent border-2 border-primary-dark hover:bg-primary-dark hover:text-white transition-all duration-300 text-primary-dark font-semibold py-4 px-8 rounded-xl text-lg hover:shadow-lg transform hover:scale-105 hover:-translate-y-1 active:scale-95 relative overflow-hidden btn-interactive"
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
              <div className="text-2xl font-bold text-primary-dark group-hover:scale-110 transition-transform duration-300">1000+</div>
              <div className="text-sm text-gray-600">Designs Created</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-2xl font-bold text-primary-dark group-hover:scale-110 transition-transform duration-300">500+</div>
              <div className="text-sm text-gray-600">Happy Users</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-2xl font-bold text-primary-dark group-hover:scale-110 transition-transform duration-300">24/7</div>
              <div className="text-sm text-gray-600">Support</div>
            </div>
          </div>
        </div>
        
        {/* Interactive Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer group">
          <div className="w-6 h-10 border-2 border-primary-dark rounded-full flex justify-center group-hover:border-primary transition-colors duration-300">
            <div className="w-1 h-3 bg-primary-dark rounded-full mt-2 animate-pulse group-hover:bg-primary transition-colors duration-300"></div>
          </div>
          <div className="text-xs text-primary-dark mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Scroll down</div>
        </div>
      </section>
      
      {/* Interactive Wall Layout Preview Section */}
      <section className="py-20 bg-gradient-to-b from-white to-primary-light/30 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-20 h-20 border border-primary-dark rounded-full animate-spin slow"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 border border-primary rounded-lg animate-pulse"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-poppins text-primary-dark mb-4 hover:text-primary transition-colors duration-300">
              See What You Can Create
            </h2>
            <p className="text-lg text-gray-600 font-inter max-w-2xl mx-auto">
              Get inspired by these beautiful wall layouts created with our designer
            </p>
          </div>
          
          {/* Interactive Sample Wall Layout */}
          <div className="relative max-w-4xl mx-auto group">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-primary/20 hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
              {/* Wall mockup with hover effects */}
              <div className="relative bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl p-8 min-h-[400px] overflow-hidden">
                {/* Interactive Gallery wall layout */}
                <div className="grid grid-cols-4 grid-rows-3 gap-4 h-full">
                  <div className="col-span-2 bg-white border-4 border-primary-dark rounded-lg shadow-md flex items-center justify-center hover:bg-primary-light hover:scale-105 transition-all duration-300 cursor-pointer group/item">
                    <span className="text-primary text-sm font-medium group-hover/item:text-primary-dark">Large Photo</span>
                  </div>
                  <div className="bg-white border-4 border-primary-dark rounded-lg shadow-md flex items-center justify-center hover:bg-primary-light hover:scale-105 transition-all duration-300 cursor-pointer group/item">
                    <span className="text-primary text-xs font-medium group-hover/item:text-primary-dark">Medium</span>
                  </div>
                  <div className="bg-white border-4 border-primary-dark rounded-lg shadow-md flex items-center justify-center hover:bg-primary-light hover:scale-105 transition-all duration-300 cursor-pointer group/item">
                    <span className="text-primary text-xs font-medium group-hover/item:text-primary-dark">Medium</span>
                  </div>
                  <div className="bg-white border-4 border-primary-dark rounded-lg shadow-md flex items-center justify-center hover:bg-primary-light hover:scale-105 transition-all duration-300 cursor-pointer group/item">
                    <span className="text-primary text-xs font-medium group-hover/item:text-primary-dark">Small</span>
                  </div>
                  <div className="bg-white border-4 border-primary-dark rounded-lg shadow-md flex items-center justify-center hover:bg-primary-light hover:scale-105 transition-all duration-300 cursor-pointer group/item">
                    <span className="text-primary text-xs font-medium group-hover/item:text-primary-dark">Small</span>
                  </div>
                  <div className="col-span-2 bg-white border-4 border-primary-dark rounded-lg shadow-md flex items-center justify-center hover:bg-primary-light hover:scale-105 transition-all duration-300 cursor-pointer group/item">
                    <span className="text-primary text-sm font-medium group-hover/item:text-primary-dark">Wide Photo</span>
                  </div>
                  <div className="bg-white border-4 border-primary-dark rounded-lg shadow-md flex items-center justify-center hover:bg-primary-light hover:scale-105 transition-all duration-300 cursor-pointer group/item">
                    <span className="text-primary text-xs font-medium group-hover/item:text-primary-dark">Square</span>
                  </div>
                  <div className="bg-white border-4 border-primary-dark rounded-lg shadow-md flex items-center justify-center hover:bg-primary-light hover:scale-105 transition-all duration-300 cursor-pointer group/item">
                    <span className="text-primary text-xs font-medium group-hover/item:text-primary-dark">Square</span>
                  </div>
                  <div className="bg-white border-4 border-primary-dark rounded-lg shadow-md flex items-center justify-center hover:bg-primary-light hover:scale-105 transition-all duration-300 cursor-pointer group/item">
                    <span className="text-primary text-xs font-medium group-hover/item:text-primary-dark">Square</span>
                  </div>
                  <div className="bg-white border-4 border-primary-dark rounded-lg shadow-md flex items-center justify-center hover:bg-primary-light hover:scale-105 transition-all duration-300 cursor-pointer group/item">
                    <span className="text-primary text-xs font-medium group-hover/item:text-primary-dark">Square</span>
                  </div>
                </div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                  <div className="text-center text-primary-dark">
                    <svg className="w-12 h-12 mx-auto mb-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <p className="font-medium">Click to explore</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-6">
                <p className="text-gray-600 font-inter group-hover:text-primary-dark transition-colors duration-300">
                  Arrange your photos in beautiful, balanced layouts with precise spacing and alignment
                </p>
                <button 
                  onClick={handleCreateWall}
                  className="mt-4 text-primary-dark hover:text-primary font-medium transition-colors duration-300 underline hover:no-underline"
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
        {/* Animated background patterns */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/20 to-transparent animate-pulse"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-poppins text-primary-dark mb-4">
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
              className={`text-center p-6 rounded-2xl bg-gradient-to-b from-primary-light to-accent shadow-md hover:shadow-xl transition-all duration-500 transform hover:scale-105 cursor-pointer ${activeFeature === 0 ? 'ring-4 ring-primary ring-opacity-50' : ''}`}
              onMouseEnter={() => setActiveFeature(0)}
            >
              <div className="w-16 h-16 bg-primary-dark rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-colors duration-300 hover:scale-110 transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold font-poppins text-primary-dark mb-3 hover:text-primary transition-colors duration-300">
                Easy Image Upload
              </h3>
              <p className="text-gray-600 font-inter">
                Simply drag and drop your photos to start designing your perfect wall layout
              </p>
              <div className={`mt-4 text-sm text-primary-dark font-medium transition-opacity duration-300 ${activeFeature === 0 ? 'opacity-100' : 'opacity-0'}`}>
                ✨ Currently Active
              </div>
            </div>
            
            {/* Feature 2 */}
            <div 
              className={`text-center p-6 rounded-2xl bg-gradient-to-b from-primary-light to-accent shadow-md hover:shadow-xl transition-all duration-500 transform hover:scale-105 cursor-pointer ${activeFeature === 1 ? 'ring-4 ring-primary ring-opacity-50' : ''}`}
              onMouseEnter={() => setActiveFeature(1)}
            >
              <div className="w-16 h-16 bg-primary-dark rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-primary transition-colors duration-300 hover:scale-110 transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold font-poppins text-primary-dark mb-3 hover:text-primary transition-colors duration-300">
                Flexible Layouts
              </h3>
              <p className="text-gray-600 font-inter">
                Resize, rotate, and arrange your pictures with precision for the perfect composition
              </p>
              <div className={`mt-4 text-sm text-primary-dark font-medium transition-opacity duration-300 ${activeFeature === 1 ? 'opacity-100' : 'opacity-0'}`}>
                ✨ Currently Active
              </div>
            </div>
            
            {/* Feature 3 */}
            <div 
              className={`text-center p-6 rounded-2xl bg-gradient-to-b from-primary-light to-accent shadow-md hover:shadow-xl transition-all duration-500 transform hover:scale-105 cursor-pointer ${activeFeature === 2 ? 'ring-4 ring-primary ring-opacity-50' : ''}`}
              onMouseEnter={() => setActiveFeature(2)}
            >
              <div className="w-16 h-16 bg-primary-dark rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-primary transition-colors duration-300 hover:scale-110 transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold font-poppins text-primary-dark mb-3 hover:text-primary transition-colors duration-300">
                Export & Print
              </h3>
              <p className="text-gray-600 font-inter">
                Download your design in high quality or get professional printing recommendations
              </p>
              <div className={`mt-4 text-sm text-primary-dark font-medium transition-opacity duration-300 ${activeFeature === 2 ? 'opacity-100' : 'opacity-0'}`}>
                ✨ Currently Active
              </div>
            </div>
          </div>
          
          {/* Call to Action in Features Section */}
          <div className="text-center mt-16">
            <button
              onClick={handleGetStarted}
              className="group bg-gradient-to-r from-primary-dark to-primary hover:from-primary hover:to-primary-light text-white font-semibold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
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
      <section className="py-20 bg-gradient-to-r from-primary-dark via-primary to-primary-light relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 border-2 border-white rounded-full animate-spin slow"></div>
          <div className="absolute bottom-10 left-10 w-20 h-20 border border-white rounded-lg animate-pulse"></div>
          <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-white rounded-full animate-ping"></div>
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-white rounded-full animate-ping delay-75"></div>
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
            <button className="w-full sm:w-auto bg-white text-primary-dark font-semibold px-6 py-3 rounded-lg hover:bg-white/90 transition-all duration-300 transform hover:scale-105 btn-interactive">
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
              className="group bg-white text-primary-dark font-bold py-4 px-8 rounded-xl text-lg shadow-xl hover:shadow-2xl transform hover:scale-110 hover:-translate-y-2 transition-all duration-300 btn-interactive animate-glow"
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
