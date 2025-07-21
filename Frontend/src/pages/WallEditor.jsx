import React, { useState, useEffect, useContext } from 'react';
import { authFetch } from '../utils/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../App';
import { Image } from 'lucide-react';

// Components
import { Header, Footer } from '../components/layout';
import { 
  WallHeader, 
  WallSidebar, 
  WallCanvas, 
  WallModals, 
  ImagePropertiesPanel 
} from '../components/wall';

// Sidebar Components for Tab Content

import { DecorsPanel } from '../components/sidebar';
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
  useEffect(() => {
    async function fetchAllowedDecors() {
      if (!registeredUser?.isLoggedIn) {
        console.log('[WallEditor] Not logged in, skipping allowed decors fetch.');
        return;
      }
      try {
        const profileRes = await authFetch('http://localhost:5001/user/profile');
        if (!profileRes.ok) {
          console.log('[WallEditor] /user/profile not ok:', profileRes.status);
          return;
        }
        const profile = await profileRes.json();
        console.log('[WallEditor] profile:', profile);
        if (!profile.plan) {
          console.log('[WallEditor] No plan in profile.');
          return;
        }
        const plansRes = await fetch('http://localhost:5001/plans');
        const plansData = await plansRes.json();
        let plans = plansData.plans || plansData;
        console.log('[WallEditor] plans:', plans);
        const userPlan = plans.find(p => p.name.toLowerCase() === profile.plan.toLowerCase());
        console.log('[WallEditor] userPlan:', userPlan);
        if (userPlan && Array.isArray(userPlan.decors)) {
          console.log('[WallEditor] Setting allowed decors:', userPlan.decors);
          setUserPlanAllowedDecors(userPlan.decors);
        } else {
          console.log('[WallEditor] No decors array in userPlan, setting null.');
          setUserPlanAllowedDecors(null);
        }
      } catch (e) {
        console.log('[WallEditor] Error fetching allowed decors:', e);
        setUserPlanAllowedDecors(null);
      }
    }
    fetchAllowedDecors();
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
    console.log('WallEditor: registeredUser:', registeredUser);
    if (registeredUser && registeredUser.isLoggedIn) {
      // TODO: Implement wall API endpoint when needed
      // For now, use default values
      console.log('User is logged in, ready to load wall data');
    } else {
      console.log('User is not logged in, uploads may not work without authentication');
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
      console.log('✅ File upload refs are ready');
    }
  }, [isInitialized]);

  // Save wall data (disabled until backend endpoint is implemented)
  useEffect(() => {
    if (registeredUser && registeredUser.isLoggedIn) {
      // TODO: Implement wall API endpoint on backend
      // For now, we'll save locally or skip this step
      // Only log occasionally to avoid spam
      if (Math.random() < 0.1) {
        console.log('Wall data updated locally (backend endpoint not implemented yet)');
      }
      
      // const wall = { wallColor, wallWidth, wallHeight, wallImage, images, imageStates };
      // authFetch('http://localhost:5001/wall', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ wall }),
      // });
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

      authFetch(`http://localhost:5001/drafts/${draftId}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallData }),
      }).catch(error => {
        console.error('Error updating shared wall:', error);
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
      .map((src, idx) => ({ src, state: imageStates[idx], idx }))
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
        className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400"
        onClick={(e) => {
          // Unselect when clicking on background (but not on sidebar, buttons, or inputs)
          const clickedElement = e.target;
          
          // Check if click is on interactive elements
          const isClickOnButton = clickedElement.tagName === 'BUTTON' || 
                                  clickedElement.closest('button') ||
                                  clickedElement.closest('[role="button"]');
          const isClickOnInput = clickedElement.tagName === 'INPUT' || 
                                clickedElement.closest('input');
          const isClickOnSidebar = clickedElement.closest('.sidebar-container') || 
                                   clickedElement.closest('[class*="sidebar"]') ||
                                   clickedElement.closest('.wall-sidebar');
          const isClickOnCanvas = clickedElement.closest('.canvas-area');
          const isClickOnModal = clickedElement.closest('[class*="modal"]') || 
                                clickedElement.closest('[role="dialog"]');
          const isClickOnInteractive = clickedElement.closest('a') || 
                                      clickedElement.closest('[onclick]') ||
                                      clickedElement.closest('label');
          
          // Only unselect if clicking on the main background area
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
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, rgba(249, 115, 22, 0.1) 0%, transparent 40%),
                             radial-gradient(circle at 80% 20%, rgba(251, 146, 60, 0.08) 0%, transparent 50%),
                             radial-gradient(circle at 40% 70%, rgba(234, 88, 12, 0.06) 0%, transparent 60%),
                             radial-gradient(circle at 90% 80%, rgba(249, 115, 22, 0.1) 0%, transparent 45%)`
          }}></div>
          
          {/* Floating Picture Frame Elements */}
          <div className="absolute top-20 left-10 w-32 h-24 bg-white border-4 border-orange-600 rounded-lg shadow-md transform rotate-12 hover:scale-110 transition-all duration-500" style={{animation: 'gentleFloat 20s ease-in-out infinite'}}>
            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
          </div>
          <div className="absolute top-32 left-32 w-20 h-28 bg-white border-4 border-orange-600 rounded-lg shadow-md transform -rotate-6 hover:rotate-0 transition-all duration-700" style={{animation: 'drift 25s ease-in-out infinite, slowRotate 40s linear infinite'}}>
            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
          </div>
          
          {/* Right side floating frames */}
          <div className="absolute top-40 right-20 w-28 h-20 bg-white border-4 border-orange-600 rounded-lg shadow-md transform rotate-6 hover:-rotate-3 transition-all duration-500" style={{animation: 'float 18s ease-in-out infinite reverse'}}>
            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
          </div>
          <div className="absolute top-16 right-40 w-24 h-32 bg-white border-4 border-orange-600 rounded-lg shadow-md transform -rotate-12 hover:rotate-6 transition-all duration-700" style={{animation: 'gentleFloat 22s ease-in-out infinite, slowRotate 35s linear infinite reverse'}}>
            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
          </div>
          
          {/* Bottom floating frames */}
          <div className="absolute bottom-40 left-20 w-36 h-24 bg-white border-4 border-orange-600 rounded-lg shadow-md transform rotate-3 hover:scale-105 transition-all duration-500" style={{animation: 'drift 30s ease-in-out infinite reverse'}}>
            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
          </div>
          <div className="absolute bottom-20 right-16 w-24 h-32 bg-white border-4 border-orange-600 rounded-lg shadow-md transform -rotate-8 hover:rotate-4 transition-all duration-700" style={{animation: 'float 16s ease-in-out infinite, slowRotate 45s linear infinite'}}>
            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
          </div>
          
          {/* Center floating frame */}
          <div className="absolute top-1/3 right-1/4 w-40 h-28 bg-white border-4 border-orange-600 rounded-lg shadow-lg rotate-3 hover:scale-110 hover:rotate-0 transition-all duration-700" style={{animation: 'gentleFloat 24s ease-in-out infinite reverse, slowRotate 50s linear infinite'}}>
            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded"></div>
          </div>
          

          
          {/* Modern Floating Elements */}
          <div className="absolute top-20 left-1/4 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-orange-300/30 rounded-full blur-xl animate-pulse backdrop-blur-sm"></div>
          <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-gradient-to-br from-orange-400/20 to-orange-600/25 rounded-full blur-2xl animate-pulse delay-1000 backdrop-blur-sm"></div>
          <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-gradient-to-br from-orange-700/15 to-orange-500/20 rounded-full blur-xl animate-pulse delay-2000 backdrop-blur-sm"></div>
          <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-gradient-to-br from-secondary/30 to-accent/20 rounded-full blur-lg animate-pulse delay-3000 backdrop-blur-sm"></div>
          
          {/* Animated Mesh Grid */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `linear-gradient(rgba(152, 161, 188, 0.3) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(152, 161, 188, 0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
            animation: 'mesh-move 20s ease-in-out infinite'
          }}></div>
          
          {/* Gradient Overlay for Depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-dark/5 to-primary-dark/10"></div>
        </div>
        
        <Header />
        
        {/* Welcome Animation Overlay (modular) */}
        <WelcomeOverlay isInitialized={isInitialized} />
        
        {/* Modern Full-Screen Layout */}
        <main className={`full-width-layout relative z-10 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Header Section */}
          <WallHeader
            isSharedView={isSharedView}
            isCollaborating={isCollaborating}
            setShowSaveModal={setShowSaveModal}
            setShowShareModal={setShowShareModal}
            wallRef={wallRef}
            isViewOnly={isViewOnly}
            className="relative z-20 animate-fade-in-up"
          />

          {/* Floating Sidebar */}
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
            className="animate-slide-in-left delay-200"
          />

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
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

export default WallEditor;