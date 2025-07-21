import React from 'react';

export default function ErrorBanner({ errorMsg }) {
  if (!errorMsg) return null;
  return (
    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-up">
      <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3">
        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-semibold">{errorMsg}</span>
      </div>
    </div>
  );
}
