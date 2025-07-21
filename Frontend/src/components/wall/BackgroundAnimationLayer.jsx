import React from 'react';

export default function BackgroundAnimationLayer() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
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
        <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path 
            d="M0,50 Q25,25 50,50 T100,50" 
            stroke="url(#editorFlowGradient)" 
            strokeWidth="0.5" 
            fill="none"
            style={{animation: 'backgroundFlow 40s ease-in-out infinite'}}
          />
          <path 
            d="M0,30 Q25,5 50,30 T100,30" 
            stroke="url(#editorFlowGradient)" 
            strokeWidth="0.3" 
            fill="none"
            style={{animation: 'backgroundFlow 50s ease-in-out infinite reverse', animationDelay: '-10s'}}
          />
          <path 
            d="M0,70 Q25,95 50,70 T100,70" 
            stroke="url(#editorFlowGradient)" 
            strokeWidth="0.4" 
            fill="none"
            style={{animation: 'backgroundFlow 35s ease-in-out infinite', animationDelay: '-25s'}}
          />
          <defs>
            <linearGradient id="editorFlowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(249, 115, 22, 0.6)" />
              <stop offset="50%" stopColor="rgba(251, 146, 60, 0.8)" />
              <stop offset="100%" stopColor="rgba(234, 88, 12, 0.6)" />
            </linearGradient>
          </defs>
        </svg>
        <div 
          className="absolute inset-0 w-full h-full"
          style={{animation: 'gradientShift 80s ease-in-out infinite'}}
        ></div>
      </div>
    </div>
  );
}
