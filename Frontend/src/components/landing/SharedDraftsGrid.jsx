import React from 'react';

const SharedDraftCard = ({ draft, onOpenDraft, onRemoveClick, formatDate }) => {
  return (
    <div className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 relative border border-orange-200/30 hover-lift animate-slide-in-up">
      {/* Remove from Shared Button */}
      <button
        onClick={() => {
          const id = draft.draftId?._id || draft._id;
          if (!id) {
            alert('Unable to remove: missing draft ID.');
            return;
          }
          onRemoveClick(id);
        }}
        className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 z-10 transform scale-90 group-hover:scale-100"
      >
        <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Design Preview Area */}
      <div className="h-32 bg-gradient-to-br from-orange-100 to-orange-200 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          {/* Mock picture frames for shared designs */}
          <div className="absolute top-3 left-3 w-8 h-6 bg-white border border-orange-500 rounded shadow-sm transform rotate-6"></div>
          <div className="absolute top-2 right-5 w-6 h-8 bg-white border border-orange-600 rounded shadow-sm transform -rotate-12"></div>
          <div className="absolute bottom-3 left-5 w-10 h-6 bg-white border border-orange-400 rounded shadow-sm transform -rotate-3"></div>
          <div className="absolute bottom-2 right-3 w-7 h-7 bg-white border border-orange-500 rounded shadow-sm transform rotate-12"></div>
        </div>
        <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
          Shared
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-orange-800 mb-2 group-hover:text-orange-700 transition-colors duration-300">
          {draft.draftName || draft.name}
        </h3>
        <p className="text-sm text-orange-600 mb-2 flex items-center gap-2">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {/* Show the user who shared, fallback to owner if needed */}
          {draft.sharedBy?.name || draft.draftId?.userId?.name || 'Unknown User'}
        </p>
        <p className="text-sm text-gray-600 mb-4 flex items-center gap-2">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {formatDate(draft.sharedAt || draft.draftId?.updatedAt)}
        </p>
        <button
          onClick={() => onOpenDraft(draft.draftId?._id || draft._id)}
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

const EmptySharedState = () => {
  return (
    <div className="col-span-full">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 text-center shadow-lg border border-orange-200/30 hover-lift">
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-200 to-orange-300 rounded-full flex items-center justify-center mb-4">
            <svg className="h-12 w-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-orange-800 mb-3">No shared designs yet</h3>
        <p className="text-gray-600 max-w-md mx-auto">Designs shared with you by other users will appear here</p>
      </div>
    </div>
  );
};

const LoadingState = ({ message = "Loading shared designs..." }) => {
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

const SharedDraftsGrid = ({ 
  sharedDrafts, 
  sharedLoading, 
  sharedError, 
  isVisible, 
  onOpenDraft, 
  onRemoveClick, 
  formatDate 
}) => {
  return (
    <div className={`mb-12 transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold font-poppins text-white mb-2 hover:text-orange-200 transition-colors duration-300">
            Shared With You
          </h2>
          <p className="text-white/80">
            {sharedDrafts.length} {sharedDrafts.length === 1 ? 'Design' : 'Designs'} from the community
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {sharedLoading ? (
          <LoadingState />
        ) : sharedError ? (
          <ErrorState error={sharedError} />
        ) : sharedDrafts.length === 0 ? (
          <EmptySharedState />
        ) : (
          sharedDrafts.map((draft, index) => (
            <div key={draft._id} style={{ animationDelay: `${index * 100}ms` }}>
              <SharedDraftCard 
                draft={draft}
                onOpenDraft={onOpenDraft}
                onRemoveClick={onRemoveClick}
                formatDate={formatDate}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Copy of SharedDraftsGrid for 'Shared By You' section
export const SharedByYouGrid = ({ 
  sharedByYouDrafts, 
  loading, 
  error, 
  isVisible, 
  onOpenDraft, 
  onRevokeClick, 
  formatDate 
}) => {
  return (
    <div className={`mb-12 transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold font-poppins text-white mb-2 hover:text-orange-200 transition-colors duration-300">
            Shared By You
          </h2>
          <p className="text-white/80">
            {sharedByYouDrafts.length} {sharedByYouDrafts.length === 1 ? 'Design' : 'Designs'} shared by you
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {loading ? (
          <LoadingState message="Loading your shared links..." />
        ) : error ? (
          <ErrorState error={error} />
        ) : sharedByYouDrafts.length === 0 ? (
          <EmptySharedState />
        ) : (
          sharedByYouDrafts.map((draft, index) => (
            <div key={draft._id} style={{ animationDelay: `${index * 100}ms` }}>
              <SharedByYouCard 
                draft={draft}
                onOpenDraft={onOpenDraft}
                onRevokeClick={onRevokeClick}
                formatDate={formatDate}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Card for Shared By You
const SharedByYouCard = ({ draft, onOpenDraft, onRevokeClick, formatDate }) => {
  return (
    <div className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 relative border border-orange-200/30 hover-lift animate-slide-in-up">
      {/* Revoke Share Button */}
      <button
        onClick={() => onRevokeClick(draft)}
        className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 z-10 transform scale-90 group-hover:scale-100"
        title="Revoke Share Link"
      >
        <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {/* Design Preview Area */}
      <div className="h-32 bg-gradient-to-br from-orange-100 to-orange-200 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          {/* Mock picture frames for shared designs */}
          <div className="absolute top-3 left-3 w-8 h-6 bg-white border border-orange-500 rounded shadow-sm transform rotate-6"></div>
          <div className="absolute top-2 right-5 w-6 h-8 bg-white border border-orange-600 rounded shadow-sm transform -rotate-12"></div>
          <div className="absolute bottom-3 left-5 w-10 h-6 bg-white border border-orange-400 rounded shadow-sm transform -rotate-3"></div>
          <div className="absolute bottom-2 right-3 w-7 h-7 bg-white border border-orange-500 rounded shadow-sm transform rotate-12"></div>
        </div>
        <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
          Shared Link
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-orange-800 mb-2 group-hover:text-orange-700 transition-colors duration-300">
          {draft.name}
        </h3>
        <p className="text-sm text-orange-600 mb-2 flex items-center gap-2">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          You
        </p>
        <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Shared {formatDate(draft.updatedAt)}
        </p>
        <p className="text-xs text-gray-500 mb-2">
          Expires: {draft.shareTokenExpires ? formatDate(draft.shareTokenExpires) : 'Never'}
        </p>
        <div className="mb-2">
          <input
            type="text"
            value={`${window.location.origin}/wall?draftId=${draft._id}&shared=true&token=${draft.shareToken}`}
            readOnly
            className="w-full text-xs bg-gray-100 rounded px-2 py-1 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
            onFocus={e => e.target.select()}
          />
        </div>
        <button
          onClick={() => onOpenDraft(draft._id, draft.shareToken)}
          className="w-full bg-orange-600 hover:bg-orange-700 transition-all duration-300 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-95 relative overflow-hidden btn-interactive mb-2"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Open Shared Link
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
        <button
          onClick={() => onRevokeClick(draft)}
          className="w-full bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 px-4 rounded-xl shadow-sm mt-1 transition-colors duration-200"
        >
          Revoke Link
        </button>
      </div>
    </div>
  );
};

export default SharedDraftsGrid;
