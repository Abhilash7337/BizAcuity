import React from 'react';
import DraggableImage from './DraggableImage';

const WallCanvas = ({
  wallRef,
  wallColor,
  wallWidth,
  wallHeight,
  wallImage,
  images,
  imageStates,
  selectedIdx,
  setSelectedIdx,
  setActiveTab,
  setImageStates
}) => {
  return (
    <main className="canvas-area min-h-screen flex items-center justify-center relative overflow-hidden" 
          style={{ 
            marginLeft: '360px', // Space for floating sidebar
            padding: '2rem',
            minHeight: 'calc(100vh - 80px)', // Account for header
            paddingTop: '1rem',
            background: `linear-gradient(135deg, 
              rgba(102, 126, 234, 0.1) 0%, 
              rgba(118, 75, 162, 0.08) 25%, 
              rgba(240, 147, 251, 0.1) 50%, 
              rgba(245, 87, 108, 0.08) 75%, 
              rgba(79, 172, 254, 0.1) 100%)`
          }}>
      
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {/* Primary Floating Orbs */}
        <div className="absolute top-16 left-12 w-32 h-32 bg-gradient-to-br from-white/30 to-blue-300/40 rounded-full blur-xl animate-float-slow backdrop-blur-sm shadow-2xl"></div>
        <div className="absolute top-40 right-24 w-24 h-24 bg-gradient-to-br from-pink-300/35 to-purple-400/30 rounded-full blur-lg animate-float-medium backdrop-blur-sm shadow-xl"></div>
        <div className="absolute bottom-32 left-20 w-40 h-40 bg-gradient-to-br from-blue-300/25 to-indigo-400/35 rounded-full blur-2xl animate-float-fast backdrop-blur-sm shadow-2xl"></div>
        <div className="absolute top-1/2 right-16 w-28 h-28 bg-gradient-to-br from-yellow-300/40 to-orange-400/25 rounded-full blur-xl animate-float-slow backdrop-blur-sm shadow-xl"></div>
        <div className="absolute bottom-16 right-32 w-20 h-20 bg-gradient-to-br from-green-300/30 to-teal-400/35 rounded-full blur-lg animate-float-medium backdrop-blur-sm shadow-lg"></div>
        <div className="absolute top-1/4 left-1/3 w-36 h-36 bg-gradient-to-br from-purple-300/20 to-pink-400/30 rounded-full blur-2xl animate-float-fast backdrop-blur-sm shadow-2xl"></div>
        
        {/* Secondary Layer - Smaller Orbs */}
        <div className="absolute top-24 right-1/3 w-16 h-16 bg-gradient-to-br from-cyan-200/40 to-blue-300/30 rounded-full blur-md animate-float-medium backdrop-blur-sm shadow-lg"></div>
        <div className="absolute bottom-40 left-1/4 w-18 h-18 bg-gradient-to-br from-lime-300/35 to-emerald-400/25 rounded-full blur-lg animate-float-slow backdrop-blur-sm shadow-md"></div>
        <div className="absolute top-3/4 right-1/4 w-14 h-14 bg-gradient-to-br from-rose-300/45 to-pink-400/35 rounded-full blur-md animate-float-fast backdrop-blur-sm shadow-lg"></div>
        
        {/* Animated Geometric Shapes */}
        <div className="absolute top-20 right-1/4 w-16 h-16 bg-gradient-to-br from-cyan-300/40 to-blue-400/30 transform rotate-45 animate-spin-slow backdrop-blur-sm shadow-lg" style={{ borderRadius: '20%' }}></div>
        <div className="absolute bottom-24 left-1/4 w-12 h-12 bg-gradient-to-br from-rose-300/35 to-red-400/25 transform rotate-12 animate-bounce-slow backdrop-blur-sm shadow-md" style={{ borderRadius: '30%' }}></div>
        <div className="absolute top-1/3 left-16 w-20 h-20 bg-gradient-to-br from-emerald-300/30 to-green-400/40 transform -rotate-12 animate-pulse-slow backdrop-blur-sm shadow-lg" style={{ borderRadius: '25%' }}></div>
        <div className="absolute bottom-1/3 right-1/5 w-14 h-14 bg-gradient-to-br from-amber-300/38 to-yellow-400/28 transform rotate-30 animate-spin-slow backdrop-blur-sm shadow-lg" style={{ borderRadius: '35%' }}></div>
        
        {/* Enhanced Moving Particles */}
        <div className="absolute top-8 left-1/5 w-3 h-3 bg-white/60 rounded-full animate-particle-1 shadow-lg"></div>
        <div className="absolute top-1/4 right-1/6 w-2 h-2 bg-blue-300/70 rounded-full animate-particle-2 shadow-md"></div>
        <div className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-purple-300/50 rounded-full animate-particle-3 shadow-lg"></div>
        <div className="absolute top-2/3 right-1/3 w-2.5 h-2.5 bg-pink-300/65 rounded-full animate-particle-4 shadow-md"></div>
        <div className="absolute bottom-1/6 left-1/6 w-3.5 h-3.5 bg-cyan-300/55 rounded-full animate-particle-5 shadow-lg"></div>
        <div className="absolute top-1/6 left-2/3 w-2 h-2 bg-green-300/70 rounded-full animate-particle-1 shadow-md"></div>
        <div className="absolute bottom-2/3 right-1/5 w-3 h-3 bg-yellow-300/60 rounded-full animate-particle-3 shadow-lg"></div>
        <div className="absolute top-1/2 left-1/8 w-2.5 h-2.5 bg-indigo-300/65 rounded-full animate-particle-2 shadow-md"></div>
        
        {/* Advanced Grid Pattern with Animation */}
        <div className="absolute inset-0 opacity-15" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, rgba(102, 126, 234, 0.2) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          animation: 'mesh-drift 15s ease-in-out infinite'
        }}></div>
        
        {/* Diagonal Grid Overlay */}
        <div className="absolute inset-0 opacity-8" style={{
          backgroundImage: `linear-gradient(45deg, rgba(102, 126, 234, 0.2) 1px, transparent 1px),
                           linear-gradient(-45deg, rgba(240, 147, 251, 0.15) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          animation: 'mesh-drift 18s ease-in-out infinite'
        }}></div>
        
        {/* Radial Wave Effect - Enhanced */}
        <div className="absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 opacity-8">
          <div className="w-full h-full rounded-full border border-white/30 animate-ping"></div>
          <div className="absolute inset-4 rounded-full border border-blue-300/20 animate-ping delay-1000"></div>
          <div className="absolute inset-8 rounded-full border border-purple-300/15 animate-ping delay-2000"></div>
          <div className="absolute inset-12 rounded-full border border-pink-300/10 animate-ping delay-3000"></div>
        </div>
        
        {/* Gradient Waves */}
        <div className="absolute inset-0 opacity-25">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-blue-400/15 to-transparent animate-wave-1"></div>
          <div className="absolute bottom-0 right-0 w-full h-32 bg-gradient-to-t from-purple-400/12 to-transparent animate-wave-2"></div>
          <div className="absolute top-1/3 left-0 w-full h-20 bg-gradient-to-b from-pink-400/10 to-transparent animate-wave-1 delay-1000"></div>
        </div>
      </div>
      
      {/* Enhanced Canvas Shadow with Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div 
          className="absolute rounded-3xl blur-3xl animate-glow-pulse"
          style={{
            width: wallWidth + 120,
            height: wallHeight + 120,
            background: `radial-gradient(ellipse, 
              rgba(255, 255, 255, 0.1) 0%, 
              rgba(102, 126, 234, 0.05) 30%, 
              rgba(240, 147, 251, 0.03) 60%, 
              transparent 100%)`
          }}
        ></div>
        
        {/* Secondary Glow Ring */}
        <div 
          className="absolute rounded-3xl blur-2xl animate-glow-pulse-slow"
          style={{
            width: wallWidth + 80,
            height: wallHeight + 80,
            background: `radial-gradient(ellipse, 
              rgba(255, 255, 255, 0.08) 0%, 
              rgba(118, 75, 162, 0.04) 40%, 
              transparent 100%)`
          }}
        ></div>
      </div>
      
      <div
        ref={wallRef}
        className="relative border-4 border-white/80 bg-cover bg-center bg-no-repeat overflow-hidden rounded-2xl shadow-2xl backdrop-blur-sm"
        style={{
          backgroundColor: wallColor,
          width: wallWidth,
          height: wallHeight,
          backgroundImage: wallImage ? `url(${wallImage})` : undefined,
          position: 'relative',
          flexShrink: 0,
          boxShadow: `
            0 25px 50px -12px rgba(0, 0, 0, 0.15),
            0 0 0 1px rgba(255, 255, 255, 0.8),
            inset 0 1px 0 rgba(255, 255, 255, 0.8)
          `
        }}
      >
        {images.map((src, idx) => (
          <DraggableImage
            key={`image-${idx}`}
            src={src}
            idx={idx}
            imageState={imageStates[idx]}
            setImageStates={setImageStates}
            wallWidth={wallWidth}
            wallHeight={wallHeight}
            isSelected={selectedIdx === idx}
            setSelectedIdx={(index) => {
              setSelectedIdx(index);
            }}
          />
        ))}
      </div>
    </main>
  );
};

export default WallCanvas;
