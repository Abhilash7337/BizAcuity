import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Footer } from '../components/layout';
import { UserContext } from '../App';
import { authFetch } from '../utils/auth';

const Landing = () => {
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState([]);
  const [sharedDrafts, setSharedDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sharedLoading, setSharedLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sharedError, setSharedError] = useState(null);
  const { registeredUser } = useContext(UserContext);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [draftToDelete, setDraftToDelete] = useState(null);
  const [showSharedDeleteModal, setShowSharedDeleteModal] = useState(false);
  const [sharedDraftToRemove, setSharedDraftToRemove] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Extra protection - redirect to login if not authenticated
  useEffect(() => {
    if (!registeredUser?.isLoggedIn) {
      navigate('/login', { replace: true });
      return;
    }

    // Set visibility animation
    setIsVisible(true);

    const fetchDrafts = async () => {
      try {
        setLoading(true);
        const response = await authFetch(`http://localhost:5001/drafts`);
        if (!response.ok) throw new Error('Failed to fetch drafts');
        const data = await response.json();
        setDrafts(data);
      } catch (err) {
        console.error('Fetch drafts error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchSharedDrafts = async () => {
      try {
        setSharedLoading(true);
        const response = await authFetch(`http://localhost:5001/drafts/shared`);
        if (!response.ok) throw new Error('Failed to fetch shared drafts');
        const data = await response.json();
        setSharedDrafts(data);
      } catch (err) {
        console.error('Fetch shared drafts error:', err);
        setSharedError(err.message);
      } finally {
        setSharedLoading(false);
      }
    };

    fetchDrafts();
    fetchSharedDrafts();
  }, [registeredUser, navigate]);

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleNewDesign = () => {
    navigate('/wall');
  };

  const handleOpenDraft = (draftId) => {
    navigate(`/wall?draftId=${draftId}`);
  };

  const handleDeleteClick = (draft) => {
    setDraftToDelete(draft);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!draftToDelete) return;

    try {
      const response = await authFetch(`http://localhost:5001/drafts/${draftToDelete._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete draft');

      // Remove the deleted draft from state
      setDrafts(drafts.filter(d => d._id !== draftToDelete._id));
      setShowDeleteModal(false);
      setDraftToDelete(null);
    } catch (error) {
      console.error('Delete draft error:', error);
      alert('Failed to delete draft. Please try again.');
    }
  };

  const handleSharedDraftRemoveClick = (draft) => {
    setSharedDraftToRemove(draft);
    setShowSharedDeleteModal(true);
  };

  const handleSharedDraftRemoveConfirm = async () => {
    if (!sharedDraftToRemove) return;

    try {
      const response = await authFetch(`http://localhost:5001/drafts/shared/${sharedDraftToRemove._id}/remove`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to remove from shared drafts');

      // Remove the draft from sharedDrafts state
      setSharedDrafts(sharedDrafts.filter(d => d._id !== sharedDraftToRemove._id));
      setShowSharedDeleteModal(false);
      setSharedDraftToRemove(null);
    } catch (error) {
      console.error('Remove shared draft error:', error);
      alert('Failed to remove from shared drafts. Please try again.');
    }
  };

  // Don't render anything until we verify authentication
  if (!registeredUser?.isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-secondary to-primary-light overflow-hidden">
      <Header />
      
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        {/* Floating Picture Frame Decorations */}
        <div className="absolute top-20 left-10 w-24 h-16 bg-white border-3 border-primary-dark rounded-lg shadow-md transform rotate-12 animate-pulse hover:scale-110 transition-all duration-500">
          <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-300 rounded"></div>
        </div>
        <div className="absolute top-32 right-20 w-20 h-24 bg-white border-3 border-primary-dark rounded-lg shadow-md transform -rotate-6 animate-bounce delay-100">
          <div className="w-full h-full bg-gradient-to-br from-green-200 to-green-300 rounded"></div>
        </div>
        <div className="absolute bottom-40 left-32 w-28 h-20 bg-white border-3 border-primary-dark rounded-lg shadow-md transform rotate-6 animate-pulse delay-200">
          <div className="w-full h-full bg-gradient-to-br from-purple-200 to-purple-300 rounded"></div>
        </div>
        <div className="absolute bottom-20 right-16 w-16 h-20 bg-white border-3 border-primary-dark rounded-lg shadow-md transform -rotate-12 animate-bounce delay-300">
          <div className="w-full h-full bg-gradient-to-br from-yellow-200 to-yellow-300 rounded"></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 pt-24">
        {/* Hero Welcome Section */}
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-4xl sm:text-5xl font-bold font-poppins text-primary-dark mb-4 leading-tight">
            <span className="inline-block animate-pulse">Welcome back,</span>
            <span className="block text-primary hover:text-primary-dark transition-colors duration-300 cursor-default">
              {registeredUser.name}!
            </span>
          </h1>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
            Continue creating amazing wall designs or start a fresh new project
          </p>
          
          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleNewDesign}
              className="group w-full sm:w-auto bg-primary-dark hover:bg-primary transition-all duration-300 text-white font-semibold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 active:scale-95 relative overflow-hidden btn-interactive"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Start New Design
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-light opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>

        {/* Drafts Section */}
        <div className={`mb-16 transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold font-poppins text-primary-dark mb-2 hover:text-primary transition-colors duration-300">
                Your Saved Designs
              </h2>
              <p className="text-gray-600">
                {drafts.length} {drafts.length === 1 ? 'Design' : 'Designs'} ready to continue
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-16">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-light border-t-primary mx-auto"></div>
                  <div className="mt-4 text-primary-dark font-medium">Loading your designs...</div>
                </div>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-16">
                <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
                  <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-600 font-medium">{error}</p>
                </div>
              </div>
            ) : drafts.length === 0 ? (
              <div className="col-span-full">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center shadow-lg border border-white/20 hover-lift">
                  <div className="mb-6">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-light to-primary rounded-full flex items-center justify-center mb-4">
                      <svg className="h-12 w-12 text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-primary-dark mb-3">No saved designs yet</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">Ready to create your first masterpiece? Start designing your perfect wall layout now!</p>
                  <button
                    onClick={handleNewDesign}
                    className="group bg-primary-dark hover:bg-primary transition-all duration-300 text-white font-semibold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 active:scale-95 relative overflow-hidden btn-interactive"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Create First Design
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-light opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>
            ) : (
              drafts.map((draft, index) => (
                <div
                  key={draft._id}
                  className={`group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 relative border border-white/20 hover-lift animate-slide-in-up`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteClick(draft)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 z-10 transform scale-90 group-hover:scale-100"
                  >
                    <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Design Preview Area */}
                  <div className="h-32 bg-gradient-to-br from-primary-light to-secondary relative overflow-hidden">
                    <div className="absolute inset-0 opacity-30">
                      {/* Mock picture frames */}
                      <div className="absolute top-4 left-4 w-8 h-6 bg-white border border-primary-dark rounded shadow-sm transform rotate-6"></div>
                      <div className="absolute top-2 right-6 w-6 h-8 bg-white border border-primary-dark rounded shadow-sm transform -rotate-12"></div>
                      <div className="absolute bottom-4 left-6 w-10 h-6 bg-white border border-primary-dark rounded shadow-sm transform -rotate-3"></div>
                      <div className="absolute bottom-2 right-4 w-7 h-7 bg-white border border-primary-dark rounded shadow-sm transform rotate-12"></div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-primary-dark mb-2 group-hover:text-primary transition-colors duration-300">
                      {draft.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 flex items-center gap-2">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatDate(draft.updatedAt)}
                    </p>
                    <button
                      onClick={() => handleOpenDraft(draft._id)}
                      className="w-full bg-primary-dark hover:bg-primary transition-all duration-300 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-95 relative overflow-hidden btn-interactive"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Open Design
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-light opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Shared Walls Section */}
        <div className={`mb-12 transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold font-poppins text-primary-dark mb-2 hover:text-primary transition-colors duration-300">
                Shared With You
              </h2>
              <p className="text-gray-600">
                {sharedDrafts.length} {sharedDrafts.length === 1 ? 'Design' : 'Designs'} from the community
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sharedLoading ? (
              <div className="col-span-full text-center py-16">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-light border-t-primary mx-auto"></div>
                  <div className="mt-4 text-primary-dark font-medium">Loading shared designs...</div>
                </div>
              </div>
            ) : sharedError ? (
              <div className="col-span-full text-center py-16">
                <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
                  <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-600 font-medium">{sharedError}</p>
                </div>
              </div>
            ) : sharedDrafts.length === 0 ? (
              <div className="col-span-full">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center shadow-lg border border-white/20 hover-lift">
                  <div className="mb-6">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-light to-primary rounded-full flex items-center justify-center mb-4">
                      <svg className="h-12 w-12 text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-primary-dark mb-3">No shared designs yet</h3>
                  <p className="text-gray-600 max-w-md mx-auto">Designs shared with you by other users will appear here</p>
                </div>
              </div>
            ) : (
              sharedDrafts.map((draft, index) => (
                <div
                  key={draft._id}
                  className={`group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 relative border border-white/20 hover-lift animate-slide-in-up`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Remove from Shared Button */}
                  <button
                    onClick={() => handleSharedDraftRemoveClick(draft)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 z-10 transform scale-90 group-hover:scale-100"
                  >
                    <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Design Preview Area */}
                  <div className="h-32 bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-30">
                      {/* Mock picture frames for shared designs */}
                      <div className="absolute top-3 left-3 w-8 h-6 bg-white border border-blue-400 rounded shadow-sm transform rotate-6"></div>
                      <div className="absolute top-2 right-5 w-6 h-8 bg-white border border-purple-400 rounded shadow-sm transform -rotate-12"></div>
                      <div className="absolute bottom-3 left-5 w-10 h-6 bg-white border border-green-400 rounded shadow-sm transform -rotate-3"></div>
                      <div className="absolute bottom-2 right-3 w-7 h-7 bg-white border border-pink-400 rounded shadow-sm transform rotate-12"></div>
                    </div>
                    <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Shared
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-primary-dark mb-2 group-hover:text-primary transition-colors duration-300">
                      {draft.name}
                    </h3>
                    <p className="text-sm text-blue-600 mb-2 flex items-center gap-2">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {draft.userId.name}
                    </p>
                    <p className="text-sm text-gray-600 mb-4 flex items-center gap-2">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatDate(draft.updatedAt)}
                    </p>
                    <button
                      onClick={() => handleOpenDraft(draft._id)}
                      className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-95 relative overflow-hidden btn-interactive"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Open Design
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full shadow-2xl border border-white/20 animate-slide-in-up">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Delete Design?
              </h2>
              <p className="text-gray-600">
                Are you sure you want to delete <span className="font-semibold">"{draftToDelete?.name}"</span>? This action cannot be undone.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDraftToDelete(null);
                }}
                className="flex-1 px-6 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-[1.02] active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-95"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shared Draft Remove Confirmation Modal */}
      {showSharedDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full shadow-2xl border border-white/20 animate-slide-in-up">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Remove Shared Design?
              </h2>
              <p className="text-gray-600">
                Are you sure you want to remove <span className="font-semibold">"{sharedDraftToRemove?.name}"</span> from your shared designs? This action cannot be undone.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowSharedDeleteModal(false);
                  setSharedDraftToRemove(null);
                }}
                className="flex-1 px-6 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-[1.02] active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleSharedDraftRemoveConfirm}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-95"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;