import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { authFetch } from '../../utils/auth';

const SaveDraftModal = ({ 
  showModal, 
  onClose, 
  wallRef, 
  draftId, 
  registeredUser,
  wallData,
  initialDraftName = ''
}) => {
  const [draftName, setDraftName] = useState(initialDraftName);
  const [saveError, setSaveError] = useState('');
  const [loading, setLoading] = useState(false);
  const [draftStatus, setDraftStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch draft status when modal opens
  useEffect(() => {
    if (showModal && registeredUser?.isLoggedIn && !draftId) {
      fetchDraftStatus();
    }
  }, [showModal, registeredUser?.isLoggedIn, draftId]);

  const fetchDraftStatus = async () => {
    try {
      setStatusLoading(true);
      const response = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/drafts/status`);
      
      if (response.ok) {
        const status = await response.json();
        setDraftStatus(status);
        
        // Check if user can save more drafts
        if (!status.canSaveMore) {
          setSaveError(`You have reached your plan limit of ${status.limit} saved draft${status.limit > 1 ? 's' : ''}. Please upgrade your plan or delete existing drafts to continue.`);
        } else {
          setSaveError(''); // Clear any previous errors
        }
      }
    } catch (error) {
      console.error('Failed to fetch draft status:', error);
    } finally {
      setStatusLoading(false);
    }
  };

  const captureWallPreview = async () => {
    if (!wallRef.current) {
      setSaveError('Wall preview is not ready. Please make sure your design is visible.');
      return null;
    }
    try {
      // Wait for images to load
      const imgs = Array.from(wallRef.current.getElementsByTagName('img'));
      await Promise.all(
        imgs.map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );
      // Check if wallRef is visible
      const rect = wallRef.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        setSaveError('Wall preview area is not visible. Please check your design.');
        return null;
      }
      // Try to capture
      const canvas = await html2canvas(wallRef.current, {
        useCORS: true,
        scale: 0.25,
        backgroundColor: null,
        logging: false,
        allowTaint: true,
        foreignObjectRendering: true
      });
      const dataUrl = canvas.toDataURL('image/jpeg', 0.5);
      const base64 = dataUrl.replace(/^data:image\/jpeg;base64,/, '');
      return {
        data: base64,
        contentType: 'image/jpeg'
      };
    } catch (error) {
      setSaveError('Failed to capture wall preview. Please try again or check your design.');
      console.error('Failed to capture wall preview:', error, wallRef.current);
      return null;
    }
  };

  const handleSaveDraft = async () => {
    if (!draftName.trim()) {
      setSaveError('Please enter a name for your draft');
      return;
    }

    if (!registeredUser?.isLoggedIn) {
      setSaveError('Please log in to save drafts');
      return;
    }

    // Check draft limits for new drafts
    if (!draftId && draftStatus && !draftStatus.canSaveMore) {
      setSaveError(`You have reached your plan limit of ${draftStatus.limit} saved draft${draftStatus.limit > 1 ? 's' : ''}. Please upgrade your plan or delete existing drafts to continue.`);
      return;
    }

    try {
      setLoading(true);
      setSaveError('');

      // Capture wall preview
      const previewImage = await captureWallPreview();
      if (!previewImage) {
        throw new Error('Failed to capture wall preview');
      }

      const url = draftId 
        ? `${import.meta.env.VITE_API_BASE_URL}/drafts/${draftId}`
        : `${import.meta.env.VITE_API_BASE_URL}/drafts`;

      const method = draftId ? 'PUT' : 'POST';

      const response = await authFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: draftName,
          wallData,
          previewImage // { data, contentType }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle specific draft limit error
        if (errorData.error === 'Draft limit exceeded') {
          setSaveError(errorData.message || 'You have reached your plan limit for saved drafts.');
          // Refresh draft status to update the UI
          if (!draftId) {
            fetchDraftStatus();
          }
        } else {
          throw new Error(errorData.error || 'Failed to save draft');
        }
        return;
      }

      const result = await response.json();
      
      onClose();
      
      // If this was a new draft, update the URL with the new draft ID
      if (!draftId && result.draft._id) {
        window.history.replaceState(null, '', `/wall?draftId=${result.draft._id}`);
      }
      
      // Show success message and navigate
      alert('Design saved successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Save draft error:', error);
      setSaveError(error.message || 'Failed to save draft. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 1000 }}>
      <div className="bg-slate-800 rounded-lg p-8 max-w-md w-full mx-4 transform transition-all border border-orange-500/20">
        <h2 className="text-2xl font-semibold text-white mb-4">
          {draftId ? 'Update Design' : 'Save Design'}
        </h2>
        
        {/* Draft Status Display */}
        {!draftId && draftStatus && !statusLoading && (
          <div className={`mb-4 p-3 rounded-lg ${draftStatus.canSaveMore ? 'bg-green-900/20 border border-green-500/30' : 'bg-red-900/20 border border-red-500/30'}`}>
            <div className="text-sm">
              <span className="font-medium text-slate-300">Draft Usage: </span>
              <span className={draftStatus.canSaveMore ? 'text-green-400' : 'text-red-400'}>
                {draftStatus.currentDrafts}/{draftStatus.unlimited ? '∞' : draftStatus.limit}
              </span>
              <span className="text-slate-400 ml-1">
                ({draftStatus.planName} plan)
              </span>
            </div>
            {!draftStatus.canSaveMore && (
              <div className="text-xs text-red-400 mt-1">
                Upgrade your plan to save more drafts
              </div>
            )}
          </div>
        )}
        
        {statusLoading && !draftId && (
          <div className="mb-4 p-3 bg-slate-700/50 rounded-lg">
            <div className="text-sm text-slate-400">Checking draft limits...</div>
          </div>
        )}
        
        <input
          type="text"
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
          placeholder="Enter a name for your design"
          className="w-full px-4 py-2 border border-slate-600 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-slate-700 text-white placeholder-slate-400"
          disabled={!draftId && draftStatus && !draftStatus.canSaveMore}
        />
        {saveError && (
          <p className="text-red-400 mb-4">{saveError}</p>
        )}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-400 hover:text-slate-200 transition duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveDraft}
            disabled={loading || (!draftId && draftStatus && !draftStatus.canSaveMore)}
            className="bg-gradient-to-r from-orange-600 to-orange-400 text-white px-4 py-2 rounded-lg text-base font-semibold shadow-md hover:from-orange-500 hover:to-orange-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : draftId ? 'Update' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveDraftModal; 