import React from 'react';
import UploadImagesPanel from '../sidebar/UploadImagesPanel';

export default function TabContentUploads({ imagesInputRef, images, handleRemoveImage, imageUploadLimit, imageUploadPlan }) {
  return (
    <UploadImagesPanel
      imagesInputRef={imagesInputRef}
      images={images}
      handleRemoveImage={handleRemoveImage}
      imageUploadLimit={imageUploadLimit}
      imageUploadPlan={imageUploadPlan}
    />
  );
}
