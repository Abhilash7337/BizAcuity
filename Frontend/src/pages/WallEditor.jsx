import React, { useState, useEffect, useRef, useContext } from 'react';
import html2canvas from 'html2canvas';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../App';
import { authFetch, fetchUserProfile, getToken } from '../utils/auth';
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
import { 
  BackgroundPanel, 
  UploadImagesPanel, 
  DecorsPanel 
} from '../components/sidebar';

import ExportButton from '../components/shared/ExportButton';

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
  const [images, setImages] = useState([]); // All images (user uploads + decors)
  const [imageStates, setImageStates] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [imageUploadLimit, setImageUploadLimit] = useState(null);
  const [imageUploadPlan, setImageUploadPlan] = useState('');

  // Derived: Only user-uploaded images (not decors)
  const userUploadedImages = images.filter((_, idx) => !imageStates[idx]?.isDecor);
  const userUploadedImageStates = imageStates.filter((img) => !img.isDecor);

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
  const [canExport, setCanExport] = useState(true); // default true for backward compatibility

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
  const shareToken = searchParams.get('token');
  const sharedParam = searchParams.get('shared');

  // Fetch image upload limits
  useEffect(() => {
    const fetchImageUploadLimits = async () => {
      try {
        if (!registeredUser?.isLoggedIn) {
          setImageUploadLimit(1); // Guest users get 1 image for testing
          setImageUploadPlan('Guest');
          return;
        }

        const response = await authFetch('http://localhost:5001/drafts/image-upload-status');
        
        if (!response.ok) {
          console.warn('Could not fetch image upload limits. Status:', response.status);
          const errorText = await response.text();
          console.warn('Error response:', errorText);
          setImageUploadLimit(1); // Default fallback
          setImageUploadPlan('Unknown');
          return;
        }

        const data = await response.json();
        setImageUploadLimit(data.allowedLimit);
        setImageUploadPlan(data.planName || 'Current Plan');
        console.log('Image upload limits loaded:', data);
      } catch (error) {
        console.error('Error fetching image upload limits:', error);
        setImageUploadLimit(1); // Default fallback
        setImageUploadPlan('Unknown');
      }
    };

    fetchImageUploadLimits();
  }, [registeredUser]);

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
        setErrorMsg('');
        const sharedParam = searchParams.get('shared');
        const isShared = sharedParam === 'true';
        const token = searchParams.get('token');
        
        // Use different endpoint based on whether it's a shared draft
        const endpoint = isShared 
          ? `http://localhost:5001/drafts/shared/${draftId}${token ? `?token=${token}` : ''}`
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
        setErrorMsg('Error loading draft or you do not have access.');
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

  // Fetch exportDrafts permission from backend
  useEffect(() => {
    const fetchExportPermission = async () => {
      if (!registeredUser?.isLoggedIn) {
        setCanExport(false);
        return;
      }
      try {
        // Fetch user profile (should include plan name)
        const profileRes = await authFetch('http://localhost:5001/user/profile');
        if (!profileRes.ok) throw new Error('Failed to fetch user profile');
        const profile = await profileRes.json();
        if (!profile.plan) {
          setCanExport(false);
          return;
        }
        // Fetch plan details
        const plansRes = await fetch('http://localhost:5001/api/plans');
        const plansData = await plansRes.json();
        let plans = plansData.plans || plansData;
        const userPlan = plans.find(p => p.name.toLowerCase() === profile.plan.toLowerCase());
        setCanExport(userPlan?.exportDrafts === true);
      } catch (err) {
        setCanExport(false);
      }
    };
    fetchExportPermission();
  }, [registeredUser]);

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

  // Check image upload limits
  const checkImageUploadLimits = async (newImagesCount) => {
    try {
      if (!registeredUser?.isLoggedIn) {
        // For non-logged in users, allow up to 1 image (guest limit)
        const currentCount = userUploadedImages.length;
        const totalAfterUpload = currentCount + newImagesCount;
        if (totalAfterUpload > 1) {
          throw new Error(`Guest users can only upload up to 1 image per design. You currently have ${currentCount} images and are trying to add ${newImagesCount} more.`);
        }
        return true;
      }

      console.log('Checking image upload limits...');
      const response = await authFetch('http://localhost:5001/drafts/image-upload-status');
      
      if (!response.ok) {
        console.warn('Could not check image upload limits, allowing upload');
        return true; // Allow upload if we can't check limits
      }

      const data = await response.json();
      console.log('Image upload status:', data);

      const { allowedLimit, currentUsage } = data;
      const currentCount = userUploadedImages.length;
      const totalAfterUpload = currentCount + newImagesCount;

      // Check if unlimited (-1)
      if (allowedLimit === -1) {
        console.log('Unlimited image uploads allowed');
        return true;
      }

      // Check if within limit
      if (totalAfterUpload > allowedLimit) {
        const planName = data.planName || 'Current plan';
        throw new Error(
          `${planName} allows only ${allowedLimit} image${allowedLimit !== 1 ? 's' : ''} per design. ` +
          `You currently have ${currentCount} image${currentCount !== 1 ? 's' : ''} and are trying to add ${newImagesCount} more. ` +
          `Please upgrade your plan or remove some existing images.`
        );
      }

      console.log(`Image upload allowed: ${totalAfterUpload}/${allowedLimit} images`);
      return true;

    } catch (error) {
      console.error('Image upload limit check failed:', error);
      throw error;
    }
  };

  const handleImageChange = async (e) => {
    console.log('handleImageChange called', e.target.files);
    const files = Array.from(e.target.files);
    console.log('Images selected:', files);
    try {
      // Check image upload limits before proceeding
      await checkImageUploadLimits(files.length);
      
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
        console.log('Generated URL:', data.url);
        console.log('URL type:', typeof data.url);
        console.log('URL length:', data.url?.length);
        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      console.log('All images uploaded:', uploadedUrls);
      console.log('Sample URL test:', uploadedUrls[0]);
      
      // Test if URLs are accessible
      for (let i = 0; i < uploadedUrls.length; i++) {
        const url = uploadedUrls[i];
        try {
          console.log(`Testing URL ${i}: ${url}`);
          const testResponse = await fetch(url, { method: 'HEAD' });
          console.log(`URL ${i} status: ${testResponse.status}`);
        } catch (error) {
          console.error(`URL ${i} test failed:`, error);
        }
      }
      
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
      
      console.log('🎯 Final images array:', [...images, ...uploadedUrls]);
      console.log('🎯 Final imageStates array:', [...imageStates, ...newStates]);
    } catch (error) {
      console.error('Error uploading images:', error);
      
      // Show specific error message for limit errors
      if (error.message && (error.message.includes('allows only') || error.message.includes('Guest users'))) {
        alert(error.message);
      } else {
        alert('Failed to upload one or more images. Please try again.');
      }
    }
  };

  const handleRemoveWallImage = () => setWallImage(null);
  
  // Remove only user-uploaded images (not decors)
  const handleRemoveImage = (userIdx) => {
    // Find the index in the full images/imageStates arrays
    let count = -1;
    const removeIdx = imageStates.findIndex((img) => {
      if (!img.isDecor) count++;
      return !img.isDecor && count === userIdx;
    });
    if (removeIdx === -1) return;

    const preservedStates = imageStates
      .filter((_, i) => i !== removeIdx)
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

    const preservedImages = images.filter((_, i) => i !== removeIdx);

    setImages(preservedImages);
    setImageStates(preservedStates);

    if (selectedIdx === removeIdx) {
      setSelectedIdx(null);
    } else if (selectedIdx > removeIdx) {
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
        images={userUploadedImages}
        handleRemoveImage={handleRemoveImage}
        imageUploadLimit={imageUploadLimit}
        imageUploadPlan={imageUploadPlan}
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
      <DecorsPanel
        onAddDecor={handleAddDecor}
        userDecors={userDecors}
        onRemoveUserDecor={handleRemoveDecor}
        onSelectUserDecor={handleSelectUserDecor}
      />
    );
  }

  return (
    <>
      {/* Animation Keyframes for Wall Editor */}
      <style>{`
        @keyframes cloudDrift {
          0% { 
            transform: translateX(-100px) translateY(0px) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          50% { 
            transform: translateX(50vw) translateY(-20px) scale(1.1);
            opacity: 0.6;
          }
          90% {
            opacity: 0.3;
          }
          100% { 
            transform: translateX(calc(100vw + 100px)) translateY(0px) scale(1);
            opacity: 0;
          }
        }

        @keyframes abstractMorph {
          0%, 100% { 
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
            transform: rotate(0deg) scale(1);
          }
          25% { 
            border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
            transform: rotate(90deg) scale(1.1);
          }
          50% { 
            border-radius: 50% 30% 60% 40% / 30% 70% 40% 70%;
            transform: rotate(180deg) scale(0.9);
          }
          75% { 
            border-radius: 40% 70% 30% 60% / 70% 40% 60% 30%;
            transform: rotate(270deg) scale(1.05);
          }
        }

        @keyframes backgroundFlow {
          0%, 100% { 
            transform: translateX(0px) translateY(0px) scale(1); 
            opacity: 0.6;
          }
          25% { 
            transform: translateX(20px) translateY(-10px) scale(1.05); 
            opacity: 0.8;
          }
          50% { 
            transform: translateX(-15px) translateY(15px) scale(0.95); 
            opacity: 0.7;
          }
          75% { 
            transform: translateX(10px) translateY(-5px) scale(1.02); 
            opacity: 0.9;
          }
        }

        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-8px) translateX(5px); }
          66% { transform: translateY(5px) translateX(-3px); }
        }

        @keyframes drift {
          0% { transform: translateX(0px) translateY(0px); }
          25% { transform: translateX(10px) translateY(-5px); }
          50% { transform: translateX(0px) translateY(-10px); }
          75% { transform: translateX(-10px) translateY(-5px); }
          100% { transform: translateX(0px) translateY(0px); }
        }

        @keyframes slowRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes gradientShift {
          0%, 100% { 
            background: linear-gradient(45deg, rgba(251, 146, 60, 0.1), rgba(249, 115, 22, 0.1), rgba(234, 88, 12, 0.1));
          }
          33% { 
            background: linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(234, 88, 12, 0.1), rgba(194, 65, 12, 0.1));
          }
          66% { 
            background: linear-gradient(225deg, rgba(234, 88, 12, 0.1), rgba(194, 65, 12, 0.1), rgba(251, 146, 60, 0.1));
          }
        }

        @keyframes mesh-move {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          25% { transform: translate(20px, -15px) rotate(1deg); }
          50% { transform: translate(-15px, 25px) rotate(-1deg); }
          75% { transform: translate(10px, -20px) rotate(0.5deg); }
        }
      `}</style>

      {/* Error Message UI */}
      {errorMsg && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-up">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold">{errorMsg}</span>
          </div>
        </div>
      )}

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
        
        {/* Enhanced Background Animation Layer */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {/* Main background container */}
          <div className="absolute top-0 left-0 w-full h-full">
            {/* Abstract morphing shapes for editor */}
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
            
            {/* Enhanced Flowing lines effect with SVG */}
            <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path 
                d="M0,50 Q25,25 50,50 T100,50" 
                stroke="url(#editorFlowGradient)" 
                strokeWidth="0.5" 
                fill="none"
                style={{animation: 'backgroundFlow 40s ease-in-out infinite'}}
              />
              <path 
                d="M0,30 Q25,5 50,30 T100,30" 
                stroke="url(#editorFlowGradient)" 
                strokeWidth="0.3" 
                fill="none"
                style={{animation: 'backgroundFlow 50s ease-in-out infinite reverse', animationDelay: '-10s'}}
              />
              <path 
                d="M0,70 Q25,95 50,70 T100,70" 
                stroke="url(#editorFlowGradient)" 
                strokeWidth="0.4" 
                fill="none"
                style={{animation: 'backgroundFlow 35s ease-in-out infinite', animationDelay: '-25s'}}
              />
              <defs>
                <linearGradient id="editorFlowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(249, 115, 22, 0.6)" />
                  <stop offset="50%" stopColor="rgba(251, 146, 60, 0.8)" />
                  <stop offset="100%" stopColor="rgba(234, 88, 12, 0.6)" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Additional gradient overlay animation */}
            <div 
              className="absolute inset-0 w-full h-full"
              style={{animation: 'gradientShift 80s ease-in-out infinite'}}
            ></div>
          </div>
        </div>

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
          
          {/* Floating Action Buttons */}
          <div className="fixed bottom-8 right-8 z-30 flex flex-col gap-4">
            <button 
              onClick={() => setShowSaveModal(true)}
              className="w-14 h-14 bg-orange-600 hover:bg-orange-700 text-white rounded-full shadow-lg transition-all duration-300 animate-bounce-subtle transform hover:scale-110"
              title="Save Design"
            >
              <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </button>
            <button 
              onClick={() => setShowShareModal(true)}
              className="w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg transition-all duration-300 animate-bounce-subtle delay-100 transform hover:scale-110"
              title="Share Design"
            >
              <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
            {/* Export Button - new floating action button */}
            <div className="w-14 h-14">
              <ExportButton wallRef={wallRef} canExport={canExport} />
            </div>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-12 h-12 bg-white/90 hover:bg-white text-orange-600 rounded-full shadow-lg transition-all duration-300 animate-pulse transform hover:scale-110"
              title="Back to Top"
            >
              <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

export default WallEditor;