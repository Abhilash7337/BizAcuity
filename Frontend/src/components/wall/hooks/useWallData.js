
import { useState, useRef, useEffect, useContext } from 'react';
import { UserContext } from '../../../App';
import { authFetch } from '../../../utils/auth';

// Helper to resolve image URLs for display
function resolveImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/uploads/')) {
    return `${import.meta.env.VITE_API_BASE_URL}${url}`;
  }
  return url;
}

export default function useWallData() {
  const [wallImage, setWallImage] = useState(null);
  const [wallColor, setWallColor] = useState('#ffffff');
  const [inputWidth, setInputWidth] = useState(800);
  const [inputHeight, setInputHeight] = useState(600);
  const [wallWidth, setWallWidth] = useState(800);
  const [wallHeight, setWallHeight] = useState(600);
  const [images, setImages] = useState([]);
  const [imageStates, setImageStates] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [draftName, setDraftName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const wallRef = useRef(null);
  const wallImageInputRef = useRef(null);
  const imagesInputRef = useRef(null);
  const { registeredUser } = useContext(UserContext);

  // Derived: Only user-uploaded images (not decors)
  const userUploadedImages = images.filter((_, idx) => !imageStates[idx]?.isDecor);
  const userUploadedImageStates = imageStates.filter((img) => !img.isDecor);

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

  // Animation/visibility
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    const initTimer = setTimeout(() => setIsInitialized(true), 800);
    return () => {
      clearTimeout(timer);
      clearTimeout(initTimer);
    };
  }, []);

  // Handlers
  // Unified handler for uploading wall background image
  const handleWallImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('type', 'background');
        const response = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/upload`, {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) throw new Error('Failed to upload image');
        const data = await response.json();
        if (data.image && data.image.data && data.image.contentType) {
          setWallImage(data.image);
        } else {
          setErrorMsg('Failed to upload the image. Invalid response.');
        }
      } catch (error) {
        setErrorMsg('Failed to upload the image. Please try again.');
      }
    }
  };

  const handleRemoveWallImage = () => setWallImage(null);

  const handleRemoveImage = (userIdx) => {
    let count = -1;
    const removeIdx = imageStates.findIndex((img) => {
      if (!img.isDecor) count++;
      return !img.isDecor && count === userIdx;
    });
    if (removeIdx === -1) return;
    const preservedStates = imageStates.filter((_, i) => i !== removeIdx);
    const preservedImages = images.filter((_, i) => i !== removeIdx);
    setImages(preservedImages);
    setImageStates(preservedStates);
    if (selectedIdx === removeIdx) setSelectedIdx(null);
    else if (selectedIdx > removeIdx) setSelectedIdx(selectedIdx - 1);
  };

  const handleColorChange = (e) => setWallColor(e.target.value);

  const handleSetWallSize = () => {
    const width = Number(inputWidth);
    const height = Number(inputHeight);
    if (width < 200 || width > 2000 || height < 200 || height > 2000) {
      setErrorMsg('Wall size must be between 200px and 2000px');
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
    const preservedStates = imageStates.filter((_, idx) => idx !== selectedIdx);
    const preservedImages = images.filter((_, idx) => idx !== selectedIdx);
    setImages(preservedImages);
    setImageStates(preservedStates);
    setSelectedIdx(null);
  };

  const handleAddDecor = async (decorImage) => {
    try {
      const newIndex = images.length;
      // For decors, src is now a static URL
      setImages(prevImages => [
        ...prevImages,
        { src: decorImage.src }
      ]);
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
    } catch (error) {
      setErrorMsg('Failed to add decor item. Please try again.');
    }
  };

  // Handler for uploading user images (not wall background)
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    try {
      const uploadedImages = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('type', 'gallery');
        const response = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/upload`, {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) throw new Error('Failed to upload image');
        const data = await response.json();
        if (data.image && data.image.data && data.image.contentType) {
          uploadedImages.push(data.image);
        }
      }
      setImages(prev => [...prev, ...uploadedImages]);
      setImageStates(prev => [
        ...prev,
        ...uploadedImages.map(() => ({
          x: 100,
          y: 100,
          width: 150,
          height: 150,
          shape: 'square',
          isDecor: false,
          frame: 'none',
          zIndex: Date.now() + Math.random()
        }))
      ]);
    } catch (error) {
      setErrorMsg('Failed to upload one or more images. Please try again.');
    }
  };

  return {
    wallImage, setWallImage,
    wallColor, setWallColor,
    inputWidth, setInputWidth,
    inputHeight, setInputHeight,
    wallWidth, setWallWidth,
    wallHeight, setWallHeight,
    images, setImages,
    imageStates, setImageStates,
    selectedIdx, setSelectedIdx,
    draftName, setDraftName,
    loading, setLoading,
    errorMsg, setErrorMsg,
    isInitialized, setIsInitialized,
    isVisible, setIsVisible,
    wallRef, wallImageInputRef, imagesInputRef,
    userUploadedImages, userUploadedImageStates,
    handleWallImageChange,
    handleImageChange,
    handleRemoveWallImage,
    handleRemoveImage,
    handleColorChange,
    handleSetWallSize,
    handleShapeChange,
    handleFrameChange,
    handleSizeChange,
    handleRotationChange,
    handleOpacityChange,
    handleResetSize,
    handleFitToWall,
    handleDelete,
    handleAddDecor,
    registeredUser,
    resolveImageUrl // Export helper for use in components
  };
}
