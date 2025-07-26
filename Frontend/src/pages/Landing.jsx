import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Footer } from '../components/layout';
import { UserContext } from '../App';
import { authFetch } from '../utils/auth';
import { 
  HeroSection, 
  DraftsGrid, 
  SharedDraftsGrid, 
  DeleteModal, 
  SharedDeleteModal,
  SharedByYouGrid
} from '../components/landing';

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
  const [sharedByYouDrafts, setSharedByYouDrafts] = useState([]);
  const [sharedByYouLoading, setSharedByYouLoading] = useState(true);
  const [sharedByYouError, setSharedByYouError] = useState(null);
  const [revokeLoading, setRevokeLoading] = useState(false);
  const [revokeError, setRevokeError] = useState(null);

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
        const response = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/drafts`);
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
        const response = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/drafts/shared`);
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

    const fetchSharedByYouDrafts = async () => {
      try {
        setSharedByYouLoading(true);
        const response = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/drafts/shared-by-me`);
        if (!response.ok) throw new Error('Failed to fetch drafts shared by you');
        const data = await response.json();
        setSharedByYouDrafts(data);
      } catch (err) {
        setSharedByYouError(err.message);
      } finally {
        setSharedByYouLoading(false);
      }
    };

    fetchDrafts();
    fetchSharedDrafts();
    fetchSharedByYouDrafts();
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
      const response = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/drafts/${draftToDelete._id}`, {
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

    // Handle case where sharedDraftToRemove is a string (ID), not an object
    let draftId = null;
    if (typeof sharedDraftToRemove === 'string') {
      draftId = sharedDraftToRemove;
      console.info('Removing shared draft using string ID:', draftId);
    } else if (sharedDraftToRemove.draftId && sharedDraftToRemove.draftId._id) {
      draftId = sharedDraftToRemove.draftId._id;
      console.info('Removing shared draft using draftId._id:', draftId);
    } else if (sharedDraftToRemove._id) {
      draftId = sharedDraftToRemove._id;
      console.info('Removing shared draft using _id:', draftId);
    }

    if (!draftId) {
      // Log the problematic draft object for debugging
      console.warn('SharedDraft missing both draftId._id and _id:', sharedDraftToRemove);
      alert('Unable to remove: missing draft ID.');
      return;
    }

    try {
      const response = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/drafts/shared/${draftId}/remove`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to remove from shared drafts');

      // Remove the draft from sharedDrafts state
      setSharedDrafts(sharedDrafts.filter(d => (d.draftId?._id || d._id) !== draftId));
      setShowSharedDeleteModal(false);
      setSharedDraftToRemove(null);
    } catch (error) {
      console.error('Remove shared draft error:', error);
      alert('Failed to remove from shared drafts. Please try again.');
    }
  };

  const handleRevokeShare = async (draft) => {
    if (!draft) return;
    setRevokeLoading(true);
    setRevokeError(null);
    try {
      const response = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/drafts/${draft._id}/revoke-share`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error('Failed to revoke share link');
      setSharedByYouDrafts(sharedByYouDrafts.filter(d => d._id !== draft._id));
    } catch (err) {
      setRevokeError(err.message);
    } finally {
      setRevokeLoading(false);
    }
  };
  const handleOpenSharedByYouDraft = (draftId, token) => {
    navigate(`/wall?draftId=${draftId}&shared=true&token=${token}`);
  };

  // Don't render anything until we verify authentication
  if (!registeredUser?.isLoggedIn) {
    return null;
  }

  return (
    <>
      {/* Custom animations for enhanced flowing SVG lines */}
      <style>{`
        @keyframes fluidFlow {
          0%, 100% { 
            d: path("M0,15 Q50,35 100,15");
            opacity: 0.4;
          }
          25% { 
            d: path("M0,10 Q50,45 100,20");
            opacity: 0.7;
          }
          50% { 
            d: path("M0,20 Q50,25 100,10");
            opacity: 0.8;
          }
          75% { 
            d: path("M0,25 Q50,40 100,25");
            opacity: 0.6;
          }
        }

        @keyframes streamFlow {
          0% { 
            transform: translateX(-20px) scale(1);
            opacity: 0.3;
          }
          25% { 
            transform: translateX(10px) scale(1.05);
            opacity: 0.6;
          }
          50% { 
            transform: translateX(-5px) scale(0.98);
            opacity: 0.8;
          }
          75% { 
            transform: translateX(15px) scale(1.02);
            opacity: 0.5;
          }
          100% { 
            transform: translateX(-20px) scale(1);
            opacity: 0.3;
          }
        }

        @keyframes verticalFlow {
          0%, 100% { 
            transform: translateY(0px) scaleY(1);
            opacity: 0.4;
          }
          33% { 
            transform: translateY(-10px) scaleY(1.1);
            opacity: 0.7;
          }
          66% { 
            transform: translateY(15px) scaleY(0.9);
            opacity: 0.8;
          }
        }
      `}</style>

    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 overflow-hidden">
      {/* Subtle Background Animation Layer */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Main background container */}
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Abstract morphing shapes */}
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
          
          {/* Enhanced Flowing lines effect with SVG - Multiple layers for fluid motion */}
          <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Primary flowing lines */}
            <path 
              d="M0,50 Q25,25 50,50 T100,50" 
              stroke="url(#flowGradient)" 
              strokeWidth="0.5" 
              fill="none"
              style={{animation: 'backgroundFlow 40s ease-in-out infinite'}}
            />
            <path 
              d="M0,30 Q25,5 50,30 T100,30" 
              stroke="url(#flowGradient)" 
              strokeWidth="0.3" 
              fill="none"
              style={{animation: 'backgroundFlow 50s ease-in-out infinite reverse', animationDelay: '-10s'}}
            />
            <path 
              d="M0,70 Q25,95 50,70 T100,70" 
              stroke="url(#flowGradient)" 
              strokeWidth="0.4" 
              fill="none"
              style={{animation: 'backgroundFlow 35s ease-in-out infinite', animationDelay: '-25s'}}
            />
            
            {/* Additional fluid motion lines */}
            <path 
              d="M0,15 Q50,35 100,15" 
              stroke="url(#flowGradient2)" 
              strokeWidth="0.25" 
              fill="none"
              style={{animation: 'fluidFlow 45s ease-in-out infinite', animationDelay: '-15s'}}
            />
            <path 
              d="M0,85 Q50,65 100,85" 
              stroke="url(#flowGradient2)" 
              strokeWidth="0.35" 
              fill="none"
              style={{animation: 'fluidFlow 55s ease-in-out infinite reverse', animationDelay: '-30s'}}
            />
            
            {/* Curved flowing streams */}
            <path 
              d="M-10,20 Q20,40 40,20 Q60,0 80,20 Q100,40 120,20" 
              stroke="url(#streamGradient)" 
              strokeWidth="0.2" 
              fill="none"
              style={{animation: 'streamFlow 60s linear infinite'}}
            />
            <path 
              d="M-10,80 Q20,60 40,80 Q60,100 80,80 Q100,60 120,80" 
              stroke="url(#streamGradient)" 
              strokeWidth="0.3" 
              fill="none"
              style={{animation: 'streamFlow 70s linear infinite reverse', animationDelay: '-20s'}}
            />
            
            {/* Vertical flowing lines */}
            <path 
              d="M25,0 Q35,25 25,50 Q15,75 25,100" 
              stroke="url(#verticalGradient)" 
              strokeWidth="0.15" 
              fill="none"
              style={{animation: 'verticalFlow 38s ease-in-out infinite'}}
            />
            <path 
              d="M75,0 Q65,25 75,50 Q85,75 75,100" 
              stroke="url(#verticalGradient)" 
              strokeWidth="0.2" 
              fill="none"
              style={{animation: 'verticalFlow 42s ease-in-out infinite reverse', animationDelay: '-12s'}}
            />
            
            <defs>
              <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(249, 115, 22, 0.6)" />
                <stop offset="50%" stopColor="rgba(251, 146, 60, 0.8)" />
                <stop offset="100%" stopColor="rgba(234, 88, 12, 0.6)" />
              </linearGradient>
              
              <linearGradient id="flowGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(234, 88, 12, 0.4)" />
                <stop offset="50%" stopColor="rgba(249, 115, 22, 0.7)" />
                <stop offset="100%" stopColor="rgba(251, 146, 60, 0.4)" />
              </linearGradient>
              
              <linearGradient id="streamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0.3)" />
                <stop offset="50%" stopColor="rgba(249, 115, 22, 0.5)" />
                <stop offset="100%" stopColor="rgba(255, 255, 255, 0.3)" />
              </linearGradient>
              
              <linearGradient id="verticalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(251, 146, 60, 0.2)" />
                <stop offset="50%" stopColor="rgba(234, 88, 12, 0.5)" />
                <stop offset="100%" stopColor="rgba(251, 146, 60, 0.2)" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Subtle gradient overlay that shifts */}
          <div 
            className="absolute inset-0 w-full h-full"
            style={{animation: 'gradientShift 80s ease-in-out infinite'}}
          ></div>
        </div>
      </div>

      <Header />
      
      <div className="relative z-10 container mx-auto px-4 py-8 pt-24">
        {/* Additional subtle background elements for content sections */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Floating Picture Frame Mockups with Animations (from PublicLanding) */}
          <div className="absolute inset-0 opacity-15">
            {/* Top left frames */}
            <div className="absolute top-20 left-10 w-32 h-24 bg-white border-4 border-orange-600 rounded-lg shadow-md transform rotate-12 hover:scale-110 transition-all duration-500" style={{animation: 'gentleFloat 20s ease-in-out infinite'}}>
              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
            </div>
            <div className="absolute top-32 left-32 w-20 h-28 bg-white border-4 border-orange-600 rounded-lg shadow-md transform -rotate-6 hover:rotate-0 transition-all duration-700" style={{animation: 'drift 25s ease-in-out infinite, slowRotate 40s linear infinite'}}>
              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
            </div>
            
            {/* Top right frames */}
            <div className="absolute top-40 right-20 w-28 h-20 bg-white border-4 border-orange-600 rounded-lg shadow-md transform rotate-6 hover:-rotate-3 transition-all duration-500" style={{animation: 'float 18s ease-in-out infinite reverse'}}>
              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
            </div>
            <div className="absolute top-16 right-40 w-24 h-32 bg-white border-4 border-orange-600 rounded-lg shadow-md transform -rotate-12 hover:rotate-6 transition-all duration-700" style={{animation: 'gentleFloat 22s ease-in-out infinite, slowRotate 35s linear infinite reverse'}}>
              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
            </div>
            
            {/* Bottom frames */}
            <div className="absolute bottom-40 left-20 w-36 h-24 bg-white border-4 border-orange-600 rounded-lg shadow-md transform rotate-3 hover:scale-105 transition-all duration-500" style={{animation: 'drift 30s ease-in-out infinite reverse'}}>
              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
            </div>
            <div className="absolute bottom-20 right-16 w-24 h-32 bg-white border-4 border-orange-600 rounded-lg shadow-md transform -rotate-8 hover:rotate-4 transition-all duration-700" style={{animation: 'float 16s ease-in-out infinite, slowRotate 45s linear infinite'}}>
              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
            </div>
            
            {/* Center large frame with special animation */}
            <div className="absolute top-1/3 right-1/4 w-40 h-28 bg-white border-4 border-orange-600 rounded-lg shadow-lg rotate-3 hover:scale-110 hover:rotate-0 transition-all duration-700" style={{animation: 'gentleFloat 24s ease-in-out infinite reverse, slowRotate 50s linear infinite'}}>
              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
            </div>
          </div>

          {/* Gentle floating elements for content sections */}
          <div 
            className="absolute top-32 right-20 w-24 h-24 bg-orange-300 opacity-8 blur-2xl rounded-full"
            style={{animation: 'gentleFloat 35s ease-in-out infinite'}}
          ></div>
          <div 
            className="absolute bottom-32 left-20 w-32 h-32 bg-white opacity-6 blur-3xl rounded-full"
            style={{animation: 'drift 45s ease-in-out infinite reverse'}}
          ></div>
          <div 
            className="absolute top-1/2 left-1/4 w-16 h-16 bg-orange-400 opacity-10 blur-xl rounded-full"
            style={{animation: 'abstractMorph 25s ease-in-out infinite'}}
          ></div>
          <div 
            className="absolute bottom-1/4 right-1/3 w-20 h-20 bg-orange-200 opacity-12 blur-2xl rounded-full"
            style={{animation: 'float 30s ease-in-out infinite'}}
          ></div>

          {/* Additional decorative elements from PublicLanding */}
          <div className="absolute inset-0 opacity-8">
            <div className="absolute top-10 right-10 w-32 h-32 border-2 border-orange-400 rounded-full" style={{animation: 'slowRotate 25s linear infinite'}}></div>
            <div className="absolute bottom-10 left-10 w-20 h-20 border border-orange-400 rounded-lg animate-pulse" style={{animationDuration: '5s'}}></div>
            <div className="absolute bottom-1/3 right-1/5 w-24 h-6 bg-orange-400/20 rounded-full" style={{animation: 'drift 20s ease-in-out infinite reverse'}}></div>
            <div className="absolute top-3/4 left-1/3 w-16 h-16 border border-orange-300/30 transform rotate-45" style={{animation: 'float 16s ease-in-out infinite'}}></div>
          </div>
        </div>
        {/* Hero Welcome Section */}
        <HeroSection 
          userName={registeredUser.name}
          isVisible={isVisible}
          onNewDesign={handleNewDesign}
        />

        {/* Drafts Section */}
        <DraftsGrid 
          drafts={drafts}
          loading={loading}
          error={error}
          isVisible={isVisible}
          onNewDesign={handleNewDesign}
          onOpenDraft={handleOpenDraft}
          onDeleteClick={handleDeleteClick}
          formatDate={formatDate}
        />

        {/* Shared Drafts Section */}
        <SharedDraftsGrid 
          sharedDrafts={sharedDrafts}
          sharedLoading={sharedLoading}
          sharedError={sharedError}
          isVisible={isVisible}
          onOpenDraft={handleOpenDraft}
          onRemoveClick={handleSharedDraftRemoveClick}
          formatDate={formatDate}
        />

        {/* Shared By You Section */}
        <SharedByYouGrid
          sharedByYouDrafts={sharedByYouDrafts}
          loading={sharedByYouLoading || revokeLoading}
          error={sharedByYouError || revokeError}
          isVisible={isVisible}
          onOpenDraft={handleOpenSharedByYouDraft}
          onRevokeClick={handleRevokeShare}
          formatDate={formatDate}
        />
      </div>

      {/* Delete Draft Modal */}
      <DeleteModal 
        show={showDeleteModal}
        title="Delete Design?"
        message="Are you sure you want to delete"
        itemName={draftToDelete?.name}
        onCancel={() => {
          setShowDeleteModal(false);
          setDraftToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        confirmText="Delete"
        confirmButtonClass="bg-red-500 hover:bg-red-600"
      />

      {/* Remove Shared Draft Modal */}
      <SharedDeleteModal 
        show={showSharedDeleteModal}
        itemName={sharedDraftToRemove?.name}
        onCancel={() => {
          setShowSharedDeleteModal(false);
          setSharedDraftToRemove(null);
        }}
        onConfirm={handleSharedDraftRemoveConfirm}
      />
      
      {/* Footer */}
      <Footer />
    </div>
    </>
  );
};

export default Landing;
