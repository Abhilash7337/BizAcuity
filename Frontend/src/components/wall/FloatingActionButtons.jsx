import React from 'react';
import ExportButton from '../shared/ExportButton';

export default function FloatingActionButtons({ onSave, onShare, wallRef, canExport }) {
  return (
    <div className="fixed bottom-8 right-8 z-30 flex flex-col gap-4">
      <button 
        onClick={onSave}
        className="w-14 h-14 bg-orange-600 hover:bg-orange-700 text-white rounded-full shadow-lg transition-all duration-300 animate-bounce-subtle transform hover:scale-110"
        title="Save Design"
      >
        <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </button>
      <button 
        onClick={onShare}
        className="w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg transition-all duration-300 animate-bounce-subtle delay-100 transform hover:scale-110"
        title="Share Design"
      >
        <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
        </svg>
      </button>
      <div className="w-14 h-14">
        <ExportButton wallRef={wallRef} canExport={canExport} />
      </div>
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="w-12 h-12 bg-white/90 hover:bg-white text-orange-600 rounded-full shadow-lg transition-all duration-300 animate-pulse transform hover:scale-110"
        title="Back to Top"
      >
        <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
}
