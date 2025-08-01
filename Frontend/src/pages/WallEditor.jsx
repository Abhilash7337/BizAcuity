import React, { useState, useEffect, useContext } from 'react';
import { authFetch } from '../utils/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../App';
import { Image } from 'lucide-react';


import { 
  Header, 
  Footer 
} from '../components/layout';
import { 
  WallSidebar, 
  WallCanvas, 
  WallModals, 
  ImagePropertiesPanel 
} from '../components/wall';
import TabContentBackground from '../components/wall/TabContentBackground';
import TabContentUploads from '../components/wall/TabContentUploads';
import TabContentEditor from '../components/wall/TabContentEditor';
import TabContentDecors from '../components/wall/TabContentDecors';

// Modular floating UI components
import ErrorBanner from '../components/wall/ErrorBanner';
import FloatingFramesLayer from '../components/wall/FloatingFramesLayer';
import WelcomeOverlay from '../components/wall/WelcomeOverlay';
import FloatingActionButtons from '../components/wall/FloatingActionButtons';

// Custom hooks
import useWallData from '../components/wall/hooks/useWallData';
import useImageUploadLimits from '../components/wall/hooks/useImageUploadLimits';
import useExportPermission from '../components/wall/hooks/useExportPermission';
import useDraftLoader from '../components/wall/hooks/useDraftLoader';

const MIN_SIZE = 200;
const MAX_SIZE = 2000;

const TABS = [
  { key: 'background', label: 'Background' },
  { key: 'uploads', label: ' Uploads' },
  { key: 'editor', label: ' Editor' },
  { key: 'decors', label: 'Decors' },
];

function WallEditor() {
  // Router and Context (must be first for registeredUser)
  const { registeredUser } = useContext(UserContext);

  // Wall state and handlers from custom hook
  const {
    wallImage, setWallImage,
    wallColor, setWallColor,
    inputWidth, setInputWidth,
    inputHeight, setInputHeight,
    wallWidth, setWallWidth,
    wallHeight, setWallHeight,
    images, setImages,
    imageStates, setImageStates,
    selectedIdx, setSelectedIdx,
    wallRef, wallImageInputRef, imagesInputRef,
    userUploadedImages, userUploadedImageStates,
    handleWallImageChange, handleImageChange, handleRemoveWallImage, handleRemoveImage,
    handleColorChange, handleSetWallSize, handleShapeChange, handleFrameChange,
    handleSizeChange, handleRotationChange, handleOpacityChange, handleResetSize,
    handleFitToWall, handleDelete, handleAddDecor,
    // keep other state/handlers for now
  } = useWallData();

  // UI State
  const [activeTab, setActiveTab] = useState('editor');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSharedView, setIsSharedView] = useState(false);
  const [isCollaborating, setIsCollaborating] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [linkPermission, setLinkPermission] = useState('edit');
  const [isVisible, setIsVisible] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Restrict decors by plan
  const [userPlanAllowedDecors, setUserPlanAllowedDecors] = useState(null);

  // Router and Context
  // (registeredUser is already declared above)

  // Fetch allowed decors for user's plan (must come after registeredUser is defined)
  // Always recalculate allowed decors after plan change or user login
  useEffect(() => {
    let isMounted = true;
    async function fetchAllowedDecors() {
      if (!registeredUser?.isLoggedIn) return;
      try {
        const profileRes = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/user/profile`);
        if (!profileRes.ok) return;
        const profile = await profileRes.json();
        if (!profile.plan) return;
        const plansRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/plans`);
        const plansData = await plansRes.json();
        let plans = plansData.plans || plansData;
        const userPlan = plans.find(p => p.name.toLowerCase() === profile.plan.toLowerCase());
        if (userPlan) {
          const allDecorsRes = await authFetch('/decors');
          const allDecorsData = await allDecorsRes.json();
          const decorsByCategoryId = {};
          allDecorsData.forEach(decor => {
            // Always use categoryId (ObjectId) for mapping
            if (!decorsByCategoryId[decor.categoryId]) decorsByCategoryId[decor.categoryId] = [];
            decorsByCategoryId[decor.categoryId].push(decor);
          });
          let allowedDecorIds = [];
          const planDecors = Array.isArray(userPlan.decors) ? userPlan.decors.filter(d => typeof d === 'string' && /^[a-fA-F0-9]{24}$/.test(d)) : [];
          if (userPlan.categoryLimits && Object.keys(userPlan.categoryLimits).length > 0) {
            const categoriesRes = await authFetch('/categories');
            const categoriesData = await categoriesRes.json();
            Object.entries(userPlan.categoryLimits).forEach(([catId, limit]) => {
              const decorsInCat = decorsByCategoryId[catId] || [];
              const decorIdsInCat = decorsInCat.map(d => d._id);
              if (limit === -1) {
                const decorIdsToAdd = planDecors.length > 0 
                  ? decorsInCat.filter(d => planDecors.includes(d._id)).map(d => d._id)
                  : decorIdsInCat;
                allowedDecorIds.push(...decorIdsToAdd);
              } else if (limit > 0) {
                const decorIdsToAdd = planDecors.length > 0
                  ? decorsInCat.filter(d => planDecors.includes(d._id)).slice(0, limit).map(d => d._id)
                  : decorIdsInCat.slice(0, limit);
                allowedDecorIds.push(...decorIdsToAdd);
              }
              // If limit is 0 or negative (except -1), don't add any decors from this category
            });
          } else {
            allowedDecorIds = planDecors.length > 0 ? planDecors : allDecorsData.map(d => d._id);
          }
          if (isMounted) setUserPlanAllowedDecors(allowedDecorIds);
        } else {
          if (isMounted) setUserPlanAllowedDecors(null);
        }
      } catch (e) {
        if (isMounted) setUserPlanAllowedDecors(null);
      }
    }
    fetchAllowedDecors();
    // Listen for admin plan changes and force refresh
    window.addEventListener('refreshDecors', fetchAllowedDecors);
    return () => {
      isMounted = false;
      window.removeEventListener('refreshDecors', fetchAllowedDecors);
    };
  }, [registeredUser]);

  // Export permission
  const canExport = useExportPermission();

  // Use image upload limits hook
  const { imageUploadLimit, imageUploadPlan } = useImageUploadLimits();

  // Refs (provided by useWallData)


  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const draftId = searchParams.get('draftId');
  const shareToken = searchParams.get('token');
  const sharedParam = searchParams.get('shared');

  // Integrate useDraftLoader hook for draft loading and real-time updates
  const setWallData = (wallData) => {
    setWallColor(wallData.wallColor || '#FFFFFF');
    setWallWidth(wallData.wallWidth || 800);
    setWallHeight(wallData.wallHeight || 600);
    setWallImage(wallData.wallImage);
    setImages(wallData.images || []);
    setImageStates(wallData.imageStates || []);
  };

  useDraftLoader({
    draftId,
    isCollaborating,
    setLoading,
    setErrorMsg,
    setDraftName,
    setWallData,
    searchParams
  });

  // (image upload limits now handled by useImageUploadLimits hook)

  // Load user wall data
  useEffect(() => {
    if (registeredUser && registeredUser.isLoggedIn) {
      // TODO: Implement wall API endpoint when needed
      // For now, use default values
    }
  }, [registeredUser]);

  // Initialize animations and UI
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    const initTimer = setTimeout(() => {
      setIsInitialized(true);
    }, 800);

    return () => {
      clearTimeout(timer);
      clearTimeout(initTimer);
    };
  }, []);

  // Debug refs
  useEffect(() => {
    // Only log once when component is initialized
    if (isInitialized && wallImageInputRef.current && imagesInputRef.current) {
      // File upload refs are ready
    }
  }, [isInitialized]);

  // Save wall data (disabled until backend endpoint is implemented)
  useEffect(() => {
    if (registeredUser && registeredUser.isLoggedIn) {
      // TODO: Implement wall API endpoint on backend
      // For now, we'll save locally or skip this step
      // Only log occasionally to avoid spam
      if (Math.random() < 0.1) {
        // Wall data updated locally (backend endpoint not implemented yet)
      }
    }
  }, [wallColor, wallWidth, wallHeight, wallImage, images, imageStates, registeredUser]);

  // Sync image states with images
  useEffect(() => {
    setImageStates(prevStates => {
      if (images.length < prevStates.length) {
        return prevStates.slice(0, images.length);
      }
      if (images.length > prevStates.length) {
        const newStates = [...prevStates];
        for (let i = prevStates.length; i < images.length; i++) {
          newStates.push({
            x: 100,
            y: 100,
            width: 150,
            height: 150,
            shape: 'square',
          });
        }
        return newStates;
      }
      return prevStates;
    });
  }, [images]);

  // Adjust image positions when wall size changes
  useEffect(() => {
    setImageStates(states =>
      states.map(img => ({
        ...img,
        x: Math.max(0, Math.min(img.x, wallWidth - img.width)),
        y: Math.max(0, Math.min(img.y, wallHeight - img.height)),
        width: Math.min(img.width, wallWidth),
        height: Math.min(img.height, wallHeight),
      }))
    );
  }, [wallWidth, wallHeight]);

  // Check shared view status
  useEffect(() => {
    const sharedParam = searchParams.get('shared');
    const collaborateParam = searchParams.get('collaborate');
    const permissionParam = searchParams.get('permission');

    setIsSharedView(sharedParam === 'true');
    setIsCollaborating(collaborateParam === 'true');
    setLinkPermission(permissionParam || 'edit');
    setIsViewOnly(permissionParam === 'view');
  }, [searchParams]);

  // (draft loading and real-time updates now handled by useDraftLoader hook)

  // Send updates in collaboration mode
  useEffect(() => {
    if (isCollaborating && draftId) {
      const wallData = {
        wallColor,
        wallWidth,
        wallHeight,
        wallImage,
        images,
        imageStates
      };

      authFetch(`${import.meta.env.VITE_API_BASE_URL}/drafts/${draftId}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallData }),
      }).catch(error => {
        // Error updating shared wall
      });
    }
  }, [wallColor, wallWidth, wallHeight, wallImage, images, imageStates, isCollaborating, draftId]);

  // Always preserve share token and shared=true in the URL if present
  useEffect(() => {
    if (draftId && shareToken && sharedParam === 'true') {
      const params = new URLSearchParams(location.search);
      let changed = false;
      if (params.get('token') !== shareToken) {
        params.set('token', shareToken);
        changed = true;
      }
      if (params.get('shared') !== 'true') {
        params.set('shared', 'true');
        changed = true;
      }
      if (changed) {
        window.history.replaceState(null, '', `/wall?${params.toString()}`);
      }
    }
  }, [draftId, shareToken, sharedParam, location.search]);

  // (export permission now handled by useExportPermission hook)

  // Helper function to sync image states
  const syncImageStates = (imgs, states) => {
    return imgs.map((img, idx) => {
      if (states[idx]) {
        return {
          ...states[idx],
          zIndex: states[idx].zIndex || Date.now() + idx
        };
      }
      return {
        x: 100 + (idx * 20),
        y: 100 + (idx * 20),
        width: 150,
        height: 150,
        shape: 'square',
        isDecor: false,
        frame: 'none',
        zIndex: Date.now() + idx
      };
    });
  };

  // (refs and handlers provided by useWallData)

  // Generate tab content based on active tab
  let tabContent = null;
  if (activeTab === 'background') {
    tabContent = (
      <TabContentBackground
        wallImageInputRef={wallImageInputRef}
        wallImage={wallImage}
        handleRemoveWallImage={handleRemoveWallImage}
        wallColor={wallColor}
        handleColorChange={handleColorChange}
      />
    );
  } else if (activeTab === 'uploads') {
    tabContent = (
      <TabContentUploads
        imagesInputRef={imagesInputRef}
        images={userUploadedImages}
        handleRemoveImage={handleRemoveImage}
        imageUploadLimit={imageUploadLimit}
        imageUploadPlan={imageUploadPlan}
      />
    );
  } else if (activeTab === 'editor') {
    tabContent = (
      <TabContentEditor
        selectedIdx={selectedIdx}
        imageStates={imageStates}
        handleShapeChange={handleShapeChange}
        handleFrameChange={handleFrameChange}
        handleDelete={handleDelete}
        handleSizeChange={handleSizeChange}
        handleRotationChange={handleRotationChange}
        handleOpacityChange={handleOpacityChange}
        handleResetSize={handleResetSize}
        handleFitToWall={handleFitToWall}
      />
    );
  } else if (activeTab === 'decors') {
    // Find user-uploaded decors (isDecor: true)
    const userDecors = images
      .map((img, idx) => {
        // Convert image object to proper src URL
        let src = '';
        if (img && typeof img === 'object') {
          if (img.data && img.contentType) {
            // Uploaded image format
            src = `data:${img.contentType};base64,${img.data}`;
          } else if (img.src) {
            // Decor format
            src = img.src;
          }
        } else if (typeof img === 'string') {
          // Direct URL
          src = img;
        }
        return { src, state: imageStates[idx], idx };
      })
      .filter(item => item.state && item.state.isDecor);

    // Handler to remove a decor by its index in images/imageStates
    const handleRemoveDecor = (decorIdx) => {
      setImages(prev => prev.filter((_, i) => i !== decorIdx));
      setImageStates(prev => prev.filter((_, i) => i !== decorIdx));
      if (selectedIdx === decorIdx) setSelectedIdx(null);
      else if (selectedIdx > decorIdx) setSelectedIdx(selectedIdx - 1);
    };

    // Handler to select a user decor by its index
    const handleSelectUserDecor = (decorIdx) => {
      setSelectedIdx(decorIdx);
      setActiveTab('editor'); // Switch to editor tab for property changes
    };

    tabContent = (
      <TabContentDecors
        userDecors={userDecors}
        handleAddDecor={handleAddDecor}
        handleRemoveUserDecor={handleRemoveDecor}
        handleSelectUserDecor={handleSelectUserDecor}
        selectedIdx={selectedIdx}
        setSelectedIdx={setSelectedIdx}
        setActiveTab={setActiveTab}
        userPlanAllowedDecors={userPlanAllowedDecors}
      />
    );
  }

  return (
    <>
      {/* Error Message UI (modular) */}
      <ErrorBanner errorMsg={errorMsg} />

      <div
        className="min-h-screen relative overflow-hidden bg-slate-900"
        onClick={(e) => {
          const clickedElement = e.target;
          // Define what counts as a button, input, sidebar, canvas, modal, interactive
          let isClickOnButton = false;
          let isClickOnInput = false;
          let isClickOnSidebar = false;
          let isClickOnCanvas = false;
          let isClickOnModal = false;
          let isClickOnInteractive = false;
          if (clickedElement) {
            isClickOnButton = clickedElement.tagName === 'BUTTON' || clickedElement.closest('button');
            isClickOnInput = clickedElement.tagName === 'INPUT' || clickedElement.closest('input');
            isClickOnSidebar = clickedElement.closest('.sidebar') || clickedElement.classList.contains('sidebar');
            isClickOnCanvas = clickedElement.closest('.wall-canvas') || clickedElement.classList.contains('wall-canvas');
            isClickOnModal = clickedElement.closest('.modal') || clickedElement.classList.contains('modal');
            isClickOnInteractive = clickedElement.closest('.interactive') || clickedElement.classList.contains('interactive');
          }
          if (!isClickOnButton && !isClickOnInput && !isClickOnSidebar &&
              !isClickOnCanvas && !isClickOnModal && !isClickOnInteractive) {
            setSelectedIdx(null);
          }
        }}
      >
        {/* Hidden file inputs - positioned off-screen but accessible */}
        <input
          ref={wallImageInputRef}
          type="file"
          accept="image/*"
          style={{
            position: 'absolute',
            left: '-9999px',
            width: '1px',
            height: '1px',
            opacity: 0,
            overflow: 'hidden'
          }}
          onChange={handleWallImageChange}
        />
        <input
          ref={imagesInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{
            position: 'absolute',
            left: '-9999px',
            width: '1px',
            height: '1px',
            opacity: 0,
            overflow: 'hidden'
          }}
          onChange={handleImageChange}
        />

        {/* Enhanced Background Animation Layer (modular) */}
        <FloatingFramesLayer />

        {/* Enhanced Background Pattern with Floating Elements */}
        <div className="absolute inset-0 opacity-20">
          {/* ...existing code... */}
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, rgba(249, 115, 22, 0.05) 0%, transparent 40%),
                             radial-gradient(circle at 80% 20%, rgba(251, 146, 60, 0.04) 0%, transparent 50%),
                             radial-gradient(circle at 40% 70%, rgba(234, 88, 12, 0.03) 0%, transparent 60%),
                             radial-gradient(circle at 90% 80%, rgba(249, 115, 22, 0.05) 0%, transparent 45%)`
          }}></div>
          {/* ...existing code... */}
        </div>

        <Header />

        {/* Welcome Animation Overlay (modular) */}
        <WelcomeOverlay isInitialized={isInitialized} />

        {/* Responsive Full-Screen Layout */}
        <main
          className={`full-width-layout relative z-10 transition-all duration-1000 flex flex-col-reverse lg:flex-row ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} gap-4 lg:gap-0 px-2 sm:px-4 md:px-8 pt-16 sm:pt-20`}
        >
          {/* Sidebar: stacks on top on mobile, left on desktop */}
          <div
            className="w-full lg:w-auto flex-shrink-0"
            style={{ zIndex: 50 }}
          >
            <WallSidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              TABS={TABS}
              tabContent={tabContent}
              inputWidth={inputWidth}
              inputHeight={inputHeight}
              setInputWidth={setInputWidth}
              setInputHeight={setInputHeight}
              handleSetWallSize={handleSetWallSize}
              MIN_SIZE={MIN_SIZE}
              MAX_SIZE={MAX_SIZE}
              selectedIdx={selectedIdx}
              isViewOnly={isViewOnly}
              className="animate-slide-in-left delay-200 w-full lg:w-80 bg-slate-800/90 border-t-2 border-orange-500/50 shadow-2xl rounded-t-3xl backdrop-blur-md p-2 sm:p-4 lg:fixed lg:left-4 lg:top-24 lg:bottom-4 lg:rounded-2xl lg:p-6 lg:flex-col lg:gap-6 lg:bg-none lg:border-none lg:shadow-none lg:rounded-none"
            />
          </div>

          {/* Main content for desktop, below sidebar for mobile */}
          <div className="flex-1 flex flex-col w-full min-w-0 pb-4 lg:pb-0">
            {/* Canvas Area - Full Screen */}
            <WallCanvas
              wallRef={wallRef}
              wallColor={wallColor}
              wallWidth={wallWidth}
              wallHeight={wallHeight}
              wallImage={wallImage}
              images={images}
              imageStates={imageStates}
              selectedIdx={selectedIdx}
              setSelectedIdx={setSelectedIdx}
              setActiveTab={setActiveTab}
              setImageStates={setImageStates}
              isViewOnly={isViewOnly}
              className="animate-slide-in-right delay-400"
            />
          </div>
        </main>

        {/* View-Only Notification Banner */}
        {isViewOnly && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slide-in-down">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-full shadow-lg backdrop-blur-sm border border-amber-300/30">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-4 4a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-semibold text-sm">
                  You're viewing this design in read-only mode
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced WallModals with Animation */}
        <WallModals
          showSaveModal={showSaveModal}
          setShowSaveModal={setShowSaveModal}
          showShareModal={showShareModal}
          setShowShareModal={setShowShareModal}
          wallRef={wallRef}
          draftId={draftId}
          registeredUser={registeredUser}
          wallData={{
            wallColor,
            wallWidth,
            wallHeight,
            wallImage,
            images,
            imageStates
          }}
          draftName={draftName}
          onDraftCreated={(newDraftId) => {
            if (newDraftId && !draftId) {
              let url = `/wall?draftId=${newDraftId}`;
              if (shareToken) url += `&shared=true&token=${shareToken}`;
              window.history.replaceState(null, '', url);
            }
          }}
          className="animate-modal-fade-in"
        />

        {/* Floating Action Buttons (modular) */}
        <FloatingActionButtons
          onSave={() => setShowSaveModal(true)}
          onShare={() => setShowShareModal(true)}
          wallRef={wallRef}
          canExport={canExport}
        />

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

export default WallEditor;
