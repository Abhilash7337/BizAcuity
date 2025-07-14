import React, { useState, useEffect, useRef, useContext } from 'react';
import html2canvas from 'html2canvas';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../App';
import { authFetch } from '../utils/auth';

// Components
import Header from '../components/Header';
import WallHeader from '../components/WallHeader';
import WallSidebar from '../components/WallSidebar';
import WallCanvas from '../components/WallCanvas';
import WallFooter from '../components/WallFooter';
import WallModals from '../components/WallModals';

// Sidebar Components for Tab Content
import BackgroundPanel from '../components/Sidebar/BackgroundPanel';
import UploadImagesPanel from '../components/Sidebar/UploadImagesPanel';
import ImagePropertiesPanel from '../components/ImagePropertiesPanel';
import DecorsPanel from '../components/Sidebar/DecorsPanel';

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
  const [wallColor, setWallColor] = useState('#fff');
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
    if (registeredUser && registeredUser.isLoggedIn) {
      authFetch(`http://localhost:5001/wall/${registeredUser.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.wall) {
            setWallColor(data.wall.wallColor || '#fff');
            setWallWidth(data.wall.wallWidth || 800);
            setWallHeight(data.wall.wallHeight || 600);
            setWallImage(data.wall.wallImage || null);
            setImages(data.wall.images || []);
            setImageStates(data.wall.imageStates || []);
          }
        });
    }
  }, [registeredUser]);

  // Save wall data
  useEffect(() => {
    if (registeredUser && registeredUser.isLoggedIn) {
      const wall = { wallColor, wallWidth, wallHeight, wallImage, images, imageStates };
      authFetch('http://localhost:5001/wall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wall }),
      });
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
    setIsSharedView(sharedParam === 'true');
    setIsCollaborating(collaborateParam === 'true');
  }, [searchParams]);

  // Load draft and set up real-time updates
  useEffect(() => {
    const loadDraft = async () => {
      if (!draftId) return;

      try {
        setLoading(true);
        const response = await authFetch(`http://localhost:5001/drafts/single/${draftId}`);
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
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await authFetch('http://localhost:5001/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const data = await response.json();
        setWallImage(data.url);
      } catch (error) {
        console.error('Error uploading wall image:', error);
        alert('Failed to upload the image. Please try again.');
      }
    }
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await authFetch('http://localhost:5001/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const data = await response.json();
        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      
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
    setActiveTab('uploads');
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
      setActiveTab('editor');
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
        handleWallImageChange={handleWallImageChange}
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
        handleImageChange={handleImageChange}
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
        />
      )
    ) : (
      <div className="bg-surface rounded-xl shadow-xl border border-border p-6 text-center text-gray-400">
        Select an image to edit
      </div>
    );
  } else if (activeTab === 'decors') {
    tabContent = <DecorsPanel onAddDecor={handleAddDecor} />;
  }

  return (
    <div className="min-h-screen bg-secondary">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-rows-[auto_1fr_auto] grid-cols-[320px_1fr] min-h-screen bg-secondary"
             style={{gridTemplateAreas: '"header header" "sidebar main" "footer footer"'}}>
          
          <WallHeader
            isSharedView={isSharedView}
            isCollaborating={isCollaborating}
            setShowSaveModal={setShowSaveModal}
            setShowShareModal={setShowShareModal}
            wallRef={wallRef}
          />

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
          />

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
          />

          <WallFooter />
        </div>

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
              window.history.replaceState(null, '', `/wall?draftId=${newDraftId}&shared=true&collaborate=true`);
            }
          }}
        />
      </main>
    </div>
  );
}

export default WallEditor; 