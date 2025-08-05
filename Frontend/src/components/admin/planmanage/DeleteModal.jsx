import React from 'react';

const DeleteModal = ({ show, onCancel, onConfirm }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl shadow-red-500/10 border border-red-500/20 transform transition-all animate-slideIn">
        <div className="flex items-center mb-6">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-xl font-bold text-white">Delete Plan</h3>
            <p className="text-sm text-red-400">This action cannot be undone</p>
          </div>
        </div>
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-slate-300 leading-relaxed">
            Are you sure you want to delete this subscription plan? All users currently subscribed to this plan will be affected.
          </p>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-slate-600/50 hover:bg-slate-500/50 border border-slate-500/50 hover:border-slate-400/50 rounded-xl text-slate-300 hover:text-white transition-all duration-300 font-medium flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 font-medium flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
