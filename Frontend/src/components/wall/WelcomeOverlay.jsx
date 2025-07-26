import React from 'react';

export default function WelcomeOverlay({ isInitialized }) {
  if (isInitialized) return null;

  return (
    <>
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        .animation-reverse {
          animation-direction: reverse;
        }
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
      <div className="fixed inset-0 bg-gradient-to-br from-orange-100 via-orange-50 to-orange-200 z-50 flex items-center justify-center overflow-hidden animate-fade-in-up">
        {/* Background decorative shapes */}
        <div className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
        
        <div className="text-center text-orange-800">
          {/* Modern Loader Animation */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 border-2 border-orange-300 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-2 border-2 border-orange-400/70 rounded-full animate-spin-slow animation-reverse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-10 h-10 text-orange-600 animate-pulse-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold font-poppins mb-2 tracking-wider animate-pulse" style={{animationDelay: '0.5s', animationDuration: '3s'}}>
            MIALTAR
          </h2>
          <p className="text-orange-600/80 font-inter text-lg animate-pulse" style={{animationDelay: '1s', animationDuration: '3s'}}>
            Preparing your creative workspace...
          </p>
        </div>
      </div>
    </>
  );
}
