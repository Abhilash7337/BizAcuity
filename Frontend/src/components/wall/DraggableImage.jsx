import { Rnd } from 'react-rnd'
import { useEffect, useState } from 'react'

function DraggableImage({
  src,
  idx,
  imageState,
  setImageStates,
  wallWidth,
  wallHeight,
  isSelected,
  setSelectedIdx,
  isViewOnly = false
}) {
  const [imageLoadError, setImageLoadError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  if (!imageState) return null;

  // Debug logging for image source
  useEffect(() => {
    console.log(`🖼️ DraggableImage ${idx}: src="${src}", loading=${imageLoading}, error=${imageLoadError}`);
  }, [src, imageLoading, imageLoadError, idx]);

  const updateImageState = (updates) => {
    setImageStates(prevStates => {
      const newStates = [...prevStates];
      newStates[idx] = {
        ...newStates[idx],
        ...updates,
        shape: newStates[idx].shape,
        frame: newStates[idx].frame,
        isDecor: newStates[idx].isDecor,
        zIndex: isSelected ? 100 : (newStates[idx].zIndex || idx + 1)
      };
      return newStates;
    });
  };

  useEffect(() => {
    if (!imageState) return;

    const x = Math.min(Math.max(0, imageState.x), wallWidth - imageState.width);
    const y = Math.min(Math.max(0, imageState.y), wallHeight - imageState.height);
    
    if (x !== imageState.x || y !== imageState.y) {
      updateImageState({ x, y });
    }
  }, [wallWidth, wallHeight, imageState?.width, imageState?.height]);

  // Only apply shape and frame styles if it's not a decor item
  let styleOverrides = {};
  let wrapperStyle = {};

  if (!imageState.isDecor) {
    let borderRadius = '0';
    if (imageState.shape === 'circle') {
      borderRadius = '50%';
    } else if (imageState.shape === 'rounded') {
      borderRadius = '20px';
    } else if (imageState.shape === 'oval') {
      borderRadius = '50% / 30%';
    }

    // Apply frame to regular images only
    if (imageState.frame && imageState.frame !== 'none') {
      if (imageState.frame === 'gold') {
        wrapperStyle = {
          border: '8px solid #FFD700',
          borderRadius: borderRadius,
          boxSizing: 'border-box',
          boxShadow: '0 0 10px rgba(255, 215, 0, 0.5), inset 0 0 10px rgba(255, 215, 0, 0.3)',
        };
      } else if (imageState.frame === 'wood') {
        wrapperStyle = {
          border: '8px solid #8B4513',
          borderRadius: borderRadius,
          boxSizing: 'border-box',
          background: 'linear-gradient(45deg, #8B4513, #A0522D, #8B4513)',
          boxShadow: '0 0 8px rgba(139, 69, 19, 0.4)',
        };
      } else if (imageState.frame === 'metal') {
        wrapperStyle = {
          border: '8px solid #C0C0C0',
          borderRadius: borderRadius,
          boxSizing: 'border-box',
          background: 'linear-gradient(45deg, #C0C0C0, #E5E5E5, #C0C0C0)',
          boxShadow: '0 0 8px rgba(192, 192, 192, 0.4)',
        };
      }

      wrapperStyle = {
        ...wrapperStyle,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
      };
    }

    styleOverrides = {
      borderRadius,
    };
  }

  return (
    <Rnd
      size={{
        width: imageState.width,
        height: imageState.height,
      }}
      position={{ x: imageState.x, y: imageState.y }}
      bounds="parent"
      minWidth={50}
      minHeight={50}
      maxWidth={wallWidth}
      maxHeight={wallHeight}
      enableResizing={!isViewOnly && {
        bottomRight: true,
        bottom: false,
        right: false,
        top: false,
        left: false,
        topLeft: false,
        topRight: false,
        bottomLeft: false,
      }}
      disableDragging={isViewOnly}
      resizeHandleComponent={
        isSelected && !isViewOnly
          ? {
              bottomRight: (
                <div
                  className="absolute bottom-[-8px] right-[-8px] w-4 h-4 bg-gradient-to-br from-primary to-primary-dark border-2 border-white rounded-full cursor-nw-resize z-20 shadow-md transition-all"
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.2)';
                    e.target.style.boxShadow = '0 10px 15px -3px rgb(85 88 121 / 0.10), 0 4px 6px -4px rgb(85 88 121 / 0.10)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 4px 6px -1px rgb(85 88 121 / 0.08), 0 2px 4px -2px rgb(85 88 121 / 0.08)';
                  }}
                />
              ),
            }
          : undefined
      }
      onDragStart={() => !isViewOnly && setSelectedIdx(idx)}
      onDragStop={(e, d) => {
        if (isViewOnly) return;
        let x = d.x;
        let y = d.y;
        // Clamp so the image stays fully within the wall
        if (x < 0) x = 0;
        if (y < 0) y = 0;
        if (x + imageState.width > wallWidth) x = wallWidth - imageState.width;
        if (y + imageState.height > wallHeight) y = wallHeight - imageState.height;
        updateImageState({ x, y });
      }}
      onResizeStart={() => !isViewOnly && setSelectedIdx(idx)}
      onResizeStop={(e, direction, ref, delta, position) => {
        if (isViewOnly) return;
        let width = parseInt(ref.style.width, 10);
        let height = parseInt(ref.style.height, 10);
        let x = position.x;
        let y = position.y;
        // Clamp width/height so image stays within wall
        if (width > wallWidth) width = wallWidth;
        if (height > wallHeight) height = wallHeight;
        // If resizing causes overflow, adjust position so image is flush with wall edge
        if (x < 0) x = 0;
        if (y < 0) y = 0;
        if (x + width > wallWidth) x = wallWidth - width;
        if (y + height > wallHeight) y = wallHeight - height;
        updateImageState({
          width,
          height,
          x,
          y
        });
      }}
      style={{
        border: isSelected && !isViewOnly ? '2px dotted #1976d2' : 'none',
        background: 'transparent',
        zIndex: isSelected ? 100 : (imageState.zIndex || idx + 1),
        overflow: 'visible',
        cursor: isViewOnly ? 'default' : 'move',
        position: 'absolute',
        ...styleOverrides,
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (!isViewOnly) {
          setSelectedIdx(idx);
        }
      }}
    >
      {Object.keys(wrapperStyle).length > 0 ? (
        <div style={wrapperStyle}>
          <img
            src={src}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              objectFit: 'cover',
              transform: `rotate(${imageState.rotation || 0}deg)`,
              transition: 'transform 0.2s ease-in-out',
            }}
            draggable={false}
          />
        </div>
      ) : (
        <div className="relative">
          <img
            src={src}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              objectFit: 'cover',
              transform: `rotate(${imageState.rotation || 0}deg)`,
              transition: 'transform 0.2s ease-in-out',
              ...styleOverrides,
            }}
            draggable={false}
            onLoad={() => {
              console.log(`✅ Image ${idx} loaded successfully: ${src}`);
              setImageLoading(false);
              setImageLoadError(false);
            }}
            onError={(e) => {
              console.error(`❌ Image ${idx} failed to load: ${src}`, e);
              setImageLoading(false);
              setImageLoadError(true);
            }}
          />
          {imageLoadError && (
            <div className="absolute inset-0 bg-red-100 border-2 border-red-300 rounded flex items-center justify-center text-red-600 text-xs p-2">
              <div className="text-center">
                <div>❌ Failed to load</div>
                <div className="mt-1 break-all">{src}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </Rnd>
  );
}

export default DraggableImage;