import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 opacity-10 pointer-events-none">
      {/* Floating Picture Frame Decorations */}
      <div className="absolute top-20 left-10 w-24 h-16 bg-white border-3 border-primary-dark rounded-lg shadow-md transform rotate-12 animate-pulse hover:scale-110 transition-all duration-500">
        <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-300 rounded"></div>
      </div>
      <div className="absolute top-32 right-20 w-20 h-24 bg-white border-3 border-primary-dark rounded-lg shadow-md transform -rotate-6 animate-bounce delay-100">
        <div className="w-full h-full bg-gradient-to-br from-green-200 to-green-300 rounded"></div>
      </div>
      <div className="absolute bottom-40 left-32 w-28 h-20 bg-white border-3 border-primary-dark rounded-lg shadow-md transform rotate-6 animate-pulse delay-200">
        <div className="w-full h-full bg-gradient-to-br from-purple-200 to-purple-300 rounded"></div>
      </div>
      <div className="absolute bottom-20 right-16 w-16 h-20 bg-white border-3 border-primary-dark rounded-lg shadow-md transform -rotate-12 animate-bounce delay-300">
        <div className="w-full h-full bg-gradient-to-br from-yellow-200 to-yellow-300 rounded"></div>
      </div>
    </div>
  );
};

export default AnimatedBackground;
