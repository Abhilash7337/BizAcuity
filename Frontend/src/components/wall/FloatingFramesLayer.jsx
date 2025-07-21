import React from 'react';

export default function FloatingFramesLayer() {
  return (
    <div className="absolute inset-0 opacity-20">
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 20% 30%, rgba(249, 115, 22, 0.1) 0%, transparent 40%),\n                         radial-gradient(circle at 80% 20%, rgba(251, 146, 60, 0.08) 0%, transparent 50%),\n                         radial-gradient(circle at 40% 70%, rgba(234, 88, 12, 0.06) 0%, transparent 60%),\n                         radial-gradient(circle at 90% 80%, rgba(249, 115, 22, 0.1) 0%, transparent 45%)`
      }}></div>
      {/* Floating Picture Frame Elements */}
      <div className="absolute top-20 left-10 w-32 h-24 bg-white border-4 border-orange-600 rounded-lg shadow-md transform rotate-12 hover:scale-110 transition-all duration-500" style={{animation: 'gentleFloat 20s ease-in-out infinite'}}>
        <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
      </div>
      <div className="absolute top-32 left-32 w-20 h-28 bg-white border-4 border-orange-600 rounded-lg shadow-md transform -rotate-6 hover:rotate-0 transition-all duration-700" style={{animation: 'drift 25s ease-in-out infinite, slowRotate 40s linear infinite'}}>
        <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
      </div>
      {/* Right side floating frames */}
      <div className="absolute top-40 right-20 w-28 h-20 bg-white border-4 border-orange-600 rounded-lg shadow-md transform rotate-6 hover:-rotate-3 transition-all duration-500" style={{animation: 'float 18s ease-in-out infinite reverse'}}>
        <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
      </div>
      <div className="absolute top-16 right-40 w-24 h-32 bg-white border-4 border-orange-600 rounded-lg shadow-md transform -rotate-12 hover:rotate-6 transition-all duration-700" style={{animation: 'gentleFloat 22s ease-in-out infinite, slowRotate 35s linear infinite reverse'}}>
        <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
      </div>
      {/* Bottom floating frames */}
      <div className="absolute bottom-40 left-20 w-36 h-24 bg-white border-4 border-orange-600 rounded-lg shadow-md transform rotate-3 hover:scale-105 transition-all duration-500" style={{animation: 'drift 30s ease-in-out infinite reverse'}}>
        <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
      </div>
      <div className="absolute bottom-20 right-16 w-24 h-32 bg-white border-4 border-orange-600 rounded-lg shadow-md transform -rotate-8 hover:rotate-4 transition-all duration-700" style={{animation: 'float 16s ease-in-out infinite, slowRotate 45s linear infinite'}}>
        <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
      </div>
      {/* Center floating frame */}
      <div className="absolute top-1/3 right-1/4 w-40 h-28 bg-white border-4 border-orange-600 rounded-lg shadow-lg rotate-3 hover:scale-110 hover:rotate-0 transition-all duration-700" style={{animation: 'gentleFloat 24s ease-in-out infinite reverse, slowRotate 50s linear infinite'}}>
        <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
      </div>
      {/* Modern Floating Elements */}
      <div className="absolute top-20 left-1/4 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-orange-300/30 rounded-full blur-xl animate-pulse backdrop-blur-sm"></div>
      <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-gradient-to-br from-orange-400/20 to-orange-600/25 rounded-full blur-2xl animate-pulse delay-1000 backdrop-blur-sm"></div>
      <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-gradient-to-br from-orange-700/15 to-orange-500/20 rounded-full blur-xl animate-pulse delay-2000 backdrop-blur-sm"></div>
      <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-gradient-to-br from-secondary/30 to-accent/20 rounded-full blur-lg animate-pulse delay-3000 backdrop-blur-sm"></div>
      {/* Animated Mesh Grid */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `linear-gradient(rgba(152, 161, 188, 0.3) 1px, transparent 1px),\n                         linear-gradient(90deg, rgba(152, 161, 188, 0.3) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
        animation: 'mesh-move 20s ease-in-out infinite'
      }}></div>
      {/* Gradient Overlay for Depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-dark/5 to-primary-dark/10"></div>
    </div>
  );
}
