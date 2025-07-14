import React from 'react';
import DraggableImage from './DraggableImage';

const WallCanvas = ({
  wallRef,
  wallColor,
  wallWidth,
  wallHeight,
  wallImage,
  images,
  imageStates,
  selectedIdx,
  setSelectedIdx,
  setActiveTab,
  setImageStates
}) => {
  return (
    <main className="bg-primary rounded-xl shadow-lg border-2 border-surface flex items-center justify-center min-h-[70vh] transition-all p-8" style={{ gridArea: 'main' }}>
      <div
        ref={wallRef}
        className="relative border-4 border-border bg-cover bg-center bg-no-repeat overflow-hidden rounded-xl shadow-xl transition-all"
        style={{
          backgroundColor: wallColor,
          width: wallWidth,
          height: wallHeight,
          backgroundImage: wallImage ? `url(${wallImage})` : undefined,
          position: 'relative',
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setSelectedIdx(null);
            setActiveTab('uploads');
          }
        }}
      >
        {images.map((src, idx) => (
          <DraggableImage
            key={`${idx}-${src.substring(0, 20)}`}
            src={src}
            idx={idx}
            imageState={imageStates[idx]}
            setImageStates={setImageStates}
            wallWidth={wallWidth}
            wallHeight={wallHeight}
            isSelected={selectedIdx === idx}
            setSelectedIdx={(index) => {
              setSelectedIdx(index);
              setActiveTab('editor');
            }}
          />
        ))}
      </div>
    </main>
  );
};

export default WallCanvas; 