import React from 'react';

const DraftCard = ({ draft, onOpenDraft, onDeleteClick, formatDate }) => {
  return (
    <div className="group bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 relative border border-orange-500/20 hover-lift animate-slide-in-up touch-manipulation">
      {/* Delete Button - Always visible on mobile for better touch access */}
      <button
        onClick={() => onDeleteClick(draft)}
        className="absolute top-3 right-3 p-2 bg-slate-700/90 backdrop-blur-sm rounded-full shadow-md sm:opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-900/50 z-10 transform scale-100"
      >
        <svg className="h-4 w-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Design Preview Area */}
      <div className="h-32 bg-gradient-to-br from-slate-700 to-slate-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          {/* Mock picture frames */}
          <div className="absolute top-4 left-4 w-8 h-6 bg-slate-300 border border-orange-500 rounded shadow-sm transform rotate-6"></div>
          <div className="absolute top-2 right-6 w-6 h-8 bg-slate-300 border border-orange-500 rounded shadow-sm transform -rotate-12"></div>
          <div className="absolute bottom-4 left-6 w-10 h-6 bg-slate-300 border border-orange-500 rounded shadow-sm transform -rotate-3"></div>
          <div className="absolute bottom-2 right-4 w-7 h-7 bg-slate-300 border border-orange-500 rounded shadow-sm transform rotate-12"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-orange-400 mb-2 group-hover:text-orange-300 transition-colors duration-300">
          {draft.name}
        </h3>
        <p className="text-sm text-slate-400 mb-4 flex items-center gap-2">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {formatDate(draft.updatedAt)}
        </p>
        <button
          onClick={() => onOpenDraft(draft._id)}
          className="w-full bg-orange-600 hover:bg-orange-700 transition-all duration-300 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-95 relative overflow-hidden btn-interactive"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Open Design
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>
    </div>
  );
};

const EmptyDraftsState = ({ onNewDesign }) => {
  return (
    <div className="col-span-full">
      <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-12 text-center shadow-lg border border-orange-500/20 hover-lift">
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-slate-700 to-slate-600 rounded-full flex items-center justify-center mb-4">
            <svg className="h-12 w-12 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-orange-400 mb-3">No saved designs yet</h3>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">Ready to create your first masterpiece? Start designing your perfect wall layout now!</p>
        <button
          onClick={onNewDesign}
          className="group bg-orange-600 hover:bg-orange-700 transition-all duration-300 text-white font-semibold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 active:scale-95 relative overflow-hidden btn-interactive"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create First Design
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>
    </div>
  );
};

const LoadingState = ({ message = "Loading your designs..." }) => {
  return (
    <div className="col-span-full text-center py-16">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600 mx-auto"></div>
        <div className="mt-4 text-orange-800 font-medium">{message}</div>
      </div>
    </div>
  );
};

const ErrorState = ({ error }) => {
  return (
    <div className="col-span-full text-center py-16">
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
        <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    </div>
  );
};

const DraftsGrid = ({ 
  drafts, 
  loading, 
  error, 
  isVisible, 
  onNewDesign, 
  onOpenDraft, 
  onDeleteClick, 
  formatDate 
}) => {
  return (
    <div className={`mb-16 transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold font-poppins text-white mb-2 hover:text-orange-200 transition-colors duration-300">
            Your Saved Designs
          </h2>
          <p className="text-white/80">
            {drafts.length} {drafts.length === 1 ? 'Design' : 'Designs'} ready to continue
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState error={error} />
        ) : drafts.length === 0 ? (
          <EmptyDraftsState onNewDesign={onNewDesign} />
        ) : (
          drafts.map((draft, index) => (
            <div key={draft._id} style={{ animationDelay: `${index * 100}ms` }}>
              <DraftCard 
                draft={draft}
                onOpenDraft={onOpenDraft}
                onDeleteClick={onDeleteClick}
                formatDate={formatDate}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DraftsGrid;
