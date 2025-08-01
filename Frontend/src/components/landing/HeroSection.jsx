import React from 'react';

const HeroSection = ({ userName, isVisible, onNewDesign }) => {
  return (
    <div className={`text-center px-4 sm:px-6 mb-8 sm:mb-12 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-poppins text-white mb-3 sm:mb-4 leading-tight">
        <span className="inline-block animate-pulse">Welcome back,</span>
        <span className="block text-orange-600 hover:text-orange-700 transition-colors duration-300 cursor-default">
          {userName}!
        </span>
      </h1>
      <p className="text-base sm:text-lg text-white/90 mb-4 sm:mb-6 max-w-2xl mx-auto">
        Continue creating amazing wall designs or start a fresh new project
      </p>
      
      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          onClick={onNewDesign}
          className="group w-full sm:w-auto bg-orange-600 hover:bg-orange-700 transition-all duration-300 text-white font-semibold py-4 sm:py-4 px-6 sm:px-8 rounded-xl text-base sm:text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 active:scale-95 relative overflow-hidden btn-interactive touch-manipulation"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Start New Design
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
