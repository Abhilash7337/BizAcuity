import React, { useState, useEffect, useRef, useContext } from 'react';
import html2canvas from 'html2canvas';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../App';
import { authFetch, fetchUserProfile, getToken } from '../utils/auth';
import { Image } from 'lucide-react';

// Components
import { Header } from '../components/layout';
import { 
  WallHeader, 
  WallSidebar, 
  WallCanvas, 
  WallModals, 
  ImagePropertiesPanel 
} from '../components/wall';

// Sidebar Components for Tab Content
import { 
  BackgroundPanel, 
  UploadImagesPanel, 
  DecorsPanel 
} from '../components/sidebar';

const MIN_SIZE = 200;
const MAX_SIZE = 2000;

const TABS = [
  { key: 'background', label: 'Background' },
  { key: 'uploads', label: ' Uploads' },
  { key: 'editor', label: ' Editor' },
  { key: 'decors', label: 'Decors' },
];

function WallEditor() {
  // Wall State
  const [wallImage, setWallImage] = useState(null);
  const [wallColor, setWallColor] = useState('#ffffff');
  const [inputWidth, setInputWidth] = useState(800);
  const [inputHeight, setInputHeight] = useState(600);
  const [wallWidth, setWallWidth] = useState(800);
  const [wallHeight, setWallHeight] = useState(600);

  // Image State
  const [images, setImages] = useState([]);
  const [imageStates, setImageStates] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(null);

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

  // Refs
  const wallRef = useRef(null);
  const wallImageInputRef = useRef(null);
  const imagesInputRef = useRef(null);

  // Router and Context
  const { registeredUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const draftId = searchParams.get('draftId');

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

  // Load draft and set up real-time updates
  useEffect(() => {
    const loadDraft = async () => {
      if (!draftId) return;

      try {
        setLoading(true);
        const sharedParam = searchParams.get('shared');
        const isShared = sharedParam === 'true';
        
        // Use different endpoint based on whether it's a shared draft
        const endpoint = isShared 
          ? `http://localhost:5001/drafts/shared/${draftId}`
          : `http://localhost:5001/drafts/single/${draftId}`;
          
        const response = isShared 
          ? await fetch(endpoint) // No auth for shared drafts
          : await authFetch(endpoint); // Auth for private drafts
          
        if (!response.ok) throw new Error('Failed to load draft');
        
        const draft = await response.json();
        setDraftName(draft.name);
        
        const { wallData } = draft;
        if (wallData) {
          setWallColor(wallData.wallColor || '#FFFFFF');
          setWallWidth(wallData.wallWidth || 800);
          setWallHeight(wallData.wallHeight || 600);
          setWallImage(wallData.wallImage);
          setImages(wallData.images || []);
          setImageStates(wallData.imageStates || []);
        }

        if (isCollaborating) {
          const ws = new WebSocket(`ws://localhost:5001/drafts/${draftId}/collaborate`);
          
          ws.onmessage = (event) => {
            const update = JSON.parse(event.data);
            if (update.type === 'wall_update') {
              const { wallData } = update;
              setWallColor(wallData.wallColor);
              setWallWidth(wallData.wallWidth);
              setWallHeight(wallData.wallHeight);
              setWallImage(wallData.wallImage);
              setImages(wallData.images);
              setImageStates(wallData.imageStates);
            }
          };

          return () => ws.close();
        }
      } catch (error) {
        console.error('Load draft error:', error);
        alert('Failed to load draft. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadDraft();
  }, [draftId, isCollaborating]);

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

  // Image Handling Functions
  const handleWallImageChange = async (e) => {
    console.log('handleWallImageChange called', e.target.files);
    const file = e.target.files[0];
    if (file) {
      console.log('Wall image file selected:', file);
      try {
        const formData = new FormData();
        formData.append('image', file);

        console.log('Uploading wall image to server...');
        
        const response = await authFetch('http://localhost:5001/upload', {
          method: 'POST',
          body: formData,
        });

        console.log('Upload response status:', response.status);
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Upload error response:', errorText);
          throw new Error(`Failed to upload image: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Wall image upload successful:', data);
        setWallImage(data.url);
      } catch (error) {
        console.error('Error uploading wall image:', error);
        alert('Failed to upload the image. Please try again.');
      }
    }
  };

  const handleImageChange = async (e) => {
    console.log('handleImageChange called', e.target.files);
    const files = Array.from(e.target.files);
    console.log('Images selected:', files);
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        console.log('Uploading image to server:', file.name);
        
        const response = await authFetch('http://localhost:5001/upload', {
          method: 'POST',
          body: formData,
        });

        console.log('Upload response status:', response.status);
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Upload error response:', errorText);
          throw new Error(`Failed to upload image: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Image upload successful:', data);
        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      console.log('All images uploaded:', uploadedUrls);
      
      const newStates = uploadedUrls.map((_, index) => {
        const baseX = 100;
        const baseY = 100;
        const offset = 20;
        
        return {
          x: baseX + (offset * index),
          y: baseY + (offset * index),
          width: 150,
          height: 150,
          shape: 'square',
          frame: 'none',
          isDecor: false,
          zIndex: Date.now() + index
        };
      });

      setImages(prevImages => [...prevImages, ...uploadedUrls]);
      setImageStates(prevStates => [...prevStates, ...newStates]);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload one or more images. Please try again.');
    }
  };

  const handleRemoveWallImage = () => setWallImage(null);
  
  const handleRemoveImage = (idx) => {
    const preservedStates = imageStates
      .filter((_, i) => i !== idx)
      .map(state => ({
        ...state,
        x: state.x,
        y: state.y,
        width: state.width,
        height: state.height,
        shape: state.shape,
        frame: state.frame,
        isDecor: state.isDecor,
        zIndex: state.zIndex
      }));

    const preservedImages = images.filter((_, i) => i !== idx);

    setImages(preservedImages);
    setImageStates(preservedStates);

    if (selectedIdx === idx) {
      setSelectedIdx(null);
    } else if (selectedIdx > idx) {
      setSelectedIdx(selectedIdx - 1);
    }
  };

  const handleColorChange = (e) => setWallColor(e.target.value);

  const handleSetWallSize = () => {
    const width = Number(inputWidth);
    const height = Number(inputHeight);
    if (
      width < MIN_SIZE ||
      width > MAX_SIZE ||
      height < MIN_SIZE ||
      height > MAX_SIZE
    ) {
      alert(
        `Wall size must be between ${MIN_SIZE}px and ${MAX_SIZE}px`
      );
      return;
    }
    setWallWidth(width);
    setWallHeight(height);
  };

  const handleShapeChange = newShape => {
    setImageStates(states =>
      states.map((img, i) =>
        i === selectedIdx ? { ...img, shape: newShape } : img
      )
    );
  };

  const handleFrameChange = newFrame => {
    setImageStates(states =>
      states.map((img, i) =>
        i === selectedIdx ? { ...img, frame: newFrame } : img
      )
    );
  };

  const handleSizeChange = (property, value) => {
    setImageStates(states =>
      states.map((img, i) =>
        i === selectedIdx ? { ...img, [property]: value } : img
      )
    );
  };

  const handleRotationChange = (rotation) => {
    setImageStates(states =>
      states.map((img, i) =>
        i === selectedIdx ? { ...img, rotation: rotation } : img
      )
    );
  };

  const handleOpacityChange = (opacity) => {
    setImageStates(states =>
      states.map((img, i) =>
        i === selectedIdx ? { ...img, opacity: opacity / 100 } : img
      )
    );
  };

  const handleResetSize = () => {
    setImageStates(states =>
      states.map((img, i) =>
        i === selectedIdx ? { ...img, width: 150, height: 150 } : img
      )
    );
  };

  const handleFitToWall = () => {
    const maxSize = Math.min(wallWidth * 0.8, wallHeight * 0.8);
    setImageStates(states =>
      states.map((img, i) =>
        i === selectedIdx ? { ...img, width: maxSize, height: maxSize } : img
      )
    );
  };

  const handleDelete = () => {
    if (selectedIdx === null) return;

    const preservedStates = imageStates
      .filter((_, idx) => idx !== selectedIdx)
      .map(state => ({
        ...state,
        x: state.x,
        y: state.y,
        width: state.width,
        height: state.height,
        shape: state.shape,
        frame: state.frame,
        isDecor: state.isDecor,
        zIndex: state.zIndex
      }));

    const preservedImages = images.filter((_, idx) => idx !== selectedIdx);

    setImages(preservedImages);
    setImageStates(preservedStates);
    setSelectedIdx(null);
    // Removed automatic tab switching to prevent rendering issues
  };

  const handleAddDecor = async (decorImage) => {
    try {
      const newIndex = images.length;
      
      setImages(prevImages => [...prevImages, decorImage.src]);
      setImageStates(prevStates => [
        ...prevStates,
        {
          x: Math.random() * (wallWidth - decorImage.size.width),
          y: Math.random() * (wallHeight - decorImage.size.height),
          width: decorImage.size.width,
          height: decorImage.size.height,
          shape: 'square',
          frame: 'none',
          isDecor: true,
          zIndex: Date.now() + newIndex
        }
      ]);

      setSelectedIdx(newIndex);
      // Removed automatic tab switching to prevent rendering issues
    } catch (error) {
      console.error('Error adding decor:', error);
      alert('Failed to add decor item. Please try again.');
    }
  };

  // Generate tab content based on active tab
  let tabContent = null;
  if (activeTab === 'background') {
    tabContent = (
      <BackgroundPanel
        wallImageInputRef={wallImageInputRef}
        wallImage={wallImage}
        handleRemoveWallImage={handleRemoveWallImage}
        wallColor={wallColor}
        handleColorChange={handleColorChange}
      />
    );
  } else if (activeTab === 'uploads') {
    tabContent = (
      <UploadImagesPanel
        imagesInputRef={imagesInputRef}
        images={images}
        handleRemoveImage={handleRemoveImage}
      />
    );
  } else if (activeTab === 'editor') {
    tabContent = selectedIdx !== null && imageStates[selectedIdx] ? (
      imageStates[selectedIdx].isDecor ? (
        <div className="bg-surface rounded-xl shadow-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Decor Item</h3>
          <button
            onClick={handleDelete}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Remove Decor
          </button>
        </div>
      ) : (
        <ImagePropertiesPanel
          imageState={imageStates[selectedIdx]}
          onShapeChange={handleShapeChange}
          onFrameChange={handleFrameChange}
          onDelete={handleDelete}
          onSizeChange={handleSizeChange}
          onRotationChange={handleRotationChange}
          onOpacityChange={handleOpacityChange}
          onResetSize={handleResetSize}
          onFitToWall={handleFitToWall}
        />
      )
    ) : (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-gray-200/50 to-gray-300/50 rounded-xl">
            <Image className="w-5 h-5 text-primary-dark" />
          </div>
          <h3 className="text-primary-dark font-bold text-lg">Image Editor</h3>
        </div>
        
        <div className="bg-gradient-to-r from-gray-100/50 to-gray-200/50 border-2 border-dashed border-gray-300/50 rounded-xl px-6 py-12 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
              <Image className="w-8 h-8 text-gray-500" />
            </div>
            <div className="space-y-2">
              <h4 className="text-primary-dark font-semibold">No Image Selected</h4>
              <p className="text-primary-dark/60 text-sm">Click on any image in your wall to edit its properties</p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mt-6">
              <p className="text-blue-700 text-sm font-medium">💡 Tip: You can change shapes, frames, and adjust image properties once an image is selected.</p>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (activeTab === 'decors') {
    tabContent = <DecorsPanel onAddDecor={handleAddDecor} />;
  }

  return (
    <div 
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-primary-light via-secondary to-accent"
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
      
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(152, 161, 188, 0.1) 0%, transparent 40%),
                           radial-gradient(circle at 80% 20%, rgba(152, 161, 188, 0.08) 0%, transparent 50%),
                           radial-gradient(circle at 40% 70%, rgba(222, 211, 196, 0.06) 0%, transparent 60%),
                           radial-gradient(circle at 90% 80%, rgba(152, 161, 188, 0.1) 0%, transparent 45%)`
        }}></div>
        
        {/* Modern Floating Elements */}
        <div className="absolute top-20 left-1/4 w-32 h-32 bg-gradient-to-br from-primary/20 to-primary-light/30 rounded-full blur-xl animate-pulse backdrop-blur-sm"></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-gradient-to-br from-secondary/20 to-accent/25 rounded-full blur-2xl animate-pulse delay-1000 backdrop-blur-sm"></div>
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-gradient-to-br from-primary-dark/15 to-text-primary/20 rounded-full blur-xl animate-pulse delay-2000 backdrop-blur-sm"></div>
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
      
      {/* Welcome Animation Overlay */}
      {!isInitialized && (
        <div className="fixed inset-0 bg-gradient-to-br from-primary-light via-secondary to-primary-light z-50 flex items-center justify-center animate-fade-in-up">
          <div className="text-center text-primary-dark">
            <div className="w-20 h-20 border-4 border-primary-dark border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold font-poppins mb-2 animate-pulse">Loading Wall Designer</h2>
            <p className="text-gray-600 font-inter animate-pulse delay-200">Preparing your creative workspace...</p>
          </div>
        </div>
      )}
      
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
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
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
              // Update URL with new draft ID for sharing (without collaborate flag unless specifically needed)
              window.history.replaceState(null, '', `/wall?draftId=${newDraftId}&shared=true`);
            }
          }}
          className="animate-modal-fade-in"
        />
        
        {/* Floating Action Buttons */}
        <div className="fixed bottom-8 right-8 z-30 flex flex-col gap-4">
          <button 
            onClick={() => setShowSaveModal(true)}
            className="w-14 h-14 bg-primary-dark text-white rounded-full shadow-lg transition-all duration-300 animate-bounce-subtle"
            title="Save Design"
          >
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </button>
          
          <button 
            onClick={() => setShowShareModal(true)}
            className="w-14 h-14 bg-accent text-primary-dark rounded-full shadow-lg transition-all duration-300 animate-bounce-subtle delay-100"
            title="Share Design"
          >
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
          
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-12 h-12 bg-white/80 text-primary-dark rounded-full shadow-lg transition-all duration-300 animate-pulse"
            title="Back to Top"
          >
            <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      </main>
    </div>
  );
}

export default WallEditor;