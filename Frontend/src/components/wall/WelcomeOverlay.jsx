import React from 'react';

export default function WelcomeOverlay({ isInitialized }) {
  if (isInitialized) return null;
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary-light via-secondary to-primary-light z-50 flex items-center justify-center animate-fade-in-up">
      <div className="text-center text-primary-dark">
        <div className="w-20 h-20 border-4 border-primary-dark border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold font-poppins mb-2 animate-pulse">Loading Wall Designer</h2>
        <p className="text-gray-600 font-inter animate-pulse delay-200">Preparing your creative workspace...</p>
      </div>
    </div>
  );
}
