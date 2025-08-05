import React from 'react';
import BackgroundPanel from '../sidebar/BackgroundPanel';

export default function TabContentBackground({ wallImageInputRef, wallImage, handleRemoveWallImage, wallColor, handleColorChange }) {
  return (
    <BackgroundPanel
      wallImageInputRef={wallImageInputRef}
      wallImage={wallImage}
      handleRemoveWallImage={handleRemoveWallImage}
      wallColor={wallColor}
      handleColorChange={handleColorChange}
    />
  );
}
