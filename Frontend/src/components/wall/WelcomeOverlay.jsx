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
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes futuristic-glow {
          0%, 100% { box-shadow: 0 0 32px 8px #fb923c44, 0 0 0 0 #f59e42; }
          50% { box-shadow: 0 0 64px 16px #fb923c99, 0 0 16px 8px #f59e4288; }
        }
        .animation-reverse { animation-direction: reverse; }
        .animate-spin-slow { animation: spin-slow 4s linear infinite; }
        .animate-pulse-slow { animation: pulse-slow 3.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .futuristic-glow { animation: futuristic-glow 3.5s ease-in-out infinite; }
      `}</style>
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 z-50 flex items-center justify-center overflow-hidden animate-fade-in-up">
        {/* Futuristic animated background shapes */}
        <div className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl animate-pulse-slow animation-reverse" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-orange-500/10 via-orange-400/10 to-slate-900/60 blur-2xl opacity-60 animate-pulse-slow"></div>
        <div className="absolute top-1/3 left-1/3 w-40 h-40 bg-orange-500/20 rounded-full blur-2xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/3 w-32 h-32 bg-orange-400/20 rounded-full blur-2xl animate-pulse-slow animation-reverse"></div>
        <div className="text-center text-orange-200">
          {/* Futuristic Loader Animation with MIALTAR Logo */}
          <div className="relative w-28 h-28 mx-auto mb-8 futuristic-glow">
            <div className="absolute inset-0 border-2 border-orange-400/60 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-3 border-2 border-orange-500/80 rounded-full animate-spin-slow animation-reverse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <img src="/mialtar-logo.png" alt="MIALTAR Logo" className="w-16 h-16 object-contain animate-pulse-slow" style={{filter: 'drop-shadow(0 0 16px #fb923c88)'}} />
            </div>
          </div>
          <h2 className="text-3xl font-bold font-poppins mb-2 tracking-wider animate-pulse-slow text-orange-400 drop-shadow-lg" style={{animationDelay: '0.5s', animationDuration: '4.5s'}}>
            MIALTAR
          </h2>
          <p className="text-orange-300/80 font-inter text-lg animate-pulse-slow" style={{animationDelay: '1s', animationDuration: '4.5s'}}>
            Preparing your creative workspace...
          </p>
        </div>
      </div>
    </>
  );
}
