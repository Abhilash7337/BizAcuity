import React from 'react';
import ExportButton from '../shared/ExportButton';

const WallHeader = ({
  isSharedView,
  isCollaborating,
  setShowSaveModal,
  setShowShareModal,
  wallRef
}) => {
  return (
    <div className="flex justify-between items-center px-8 py-4 sticky top-0 z-30"
         style={{
           background: `linear-gradient(135deg, 
             rgba(255, 255, 255, 0.95) 0%, 
             rgba(249, 250, 251, 0.9) 100%)`,
           backdropFilter: 'blur(20px)',
           borderBottom: '1px solid rgba(99, 102, 241, 0.1)',
           boxShadow: `
             0 4px 6px -1px rgba(0, 0, 0, 0.05),
             0 0 0 1px rgba(255, 255, 255, 0.8),
             inset 0 1px 0 rgba(255, 255, 255, 0.9)
           `
         }}>
      
      {/* Header Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 100%'
        }}></div>
      </div>
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-primary-dark">Wall Designer</h1>
        {isSharedView && (
          <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            {isCollaborating ? 'Collaborative Mode' : 'Shared View'}
          </span>
        )}
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setShowSaveModal(true)}
          className="bg-primary-dark text-secondary px-4 py-2 rounded-lg text-base font-semibold shadow-md hover:bg-primary transition flex items-center gap-2"
        >
          <span>Save Draft</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h-2v5.586l-1.293-1.293z" />
            <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
          </svg>
        </button>
        <button
          onClick={() => setShowShareModal(true)}
          className="bg-primary-dark text-secondary px-4 py-2 rounded-lg text-base font-semibold shadow-md hover:bg-primary transition flex items-center gap-2"
        >
          <span>Share</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
          </svg>
        </button>
        <ExportButton wallRef={wallRef} />
      </div>
    </div>
  );
};

export default WallHeader; 