import React from 'react';
import { Upload, X, Image, Plus } from 'lucide-react';

const UploadImagesPanel = ({ imagesInputRef, images, handleRemoveImage }) => (
  <div className="space-y-6">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-gradient-to-r from-orange-300/50 to-orange-400/50 rounded-xl">
        <Image className="w-5 h-5 text-orange-700" />
      </div>
      <h3 className="text-orange-800 font-bold text-lg">Your Images</h3>
    </div>

    {/* Upload Button */}
    <div className="relative">
      {/* Direct file input overlay */}
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          console.log('📁 Direct images file input triggered');
          if (e.target.files?.length > 0 && imagesInputRef?.current) {
            // Copy files to the hidden input to maintain existing workflow
            const dt = new DataTransfer();
            Array.from(e.target.files).forEach(file => dt.items.add(file));
            imagesInputRef.current.files = dt.files;
            
            // Trigger the existing change handler
            const changeEvent = new Event('change', { bubbles: true });
            imagesInputRef.current.dispatchEvent(changeEvent);
            console.log('� Files forwarded to main handler');
          }
        }}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        title="Upload Images"
      />
      
      {/* Visual button underneath */}
      <div className="w-full bg-gradient-to-r from-orange-400/10 to-orange-500/10 border-2 border-dashed border-orange-300/50 rounded-xl px-6 py-8 transition-all duration-300 hover:border-orange-400 hover:bg-gradient-to-r hover:from-orange-400/20 hover:to-orange-500/20 group">
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-white/60 rounded-full group-hover:scale-110 transition-transform duration-300">
            <Plus className="w-6 h-6 text-orange-700" />
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-orange-800">Add Images</div>
            <div className="text-xs text-orange-600 mt-1">Upload multiple images at once</div>
          </div>
        </div>
      </div>
    </div>

    {/* Image Gallery */}
    {images.length > 0 && (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          <span className="text-sm font-semibold text-orange-700">
            {images.length} image{images.length !== 1 ? 's' : ''} added
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {images.map((src, idx) => (
            <div 
              key={idx} 
              className="relative group rounded-xl overflow-hidden border-2 border-white/40 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <img 
                src={src} 
                alt={`preview ${idx + 1}`} 
                className="w-full h-24 object-cover transition-transform duration-300 group-hover:scale-110" 
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button
                  type="button"
                  className="bg-red-500 text-white rounded-full p-2 transition-all duration-300 transform hover:scale-110 hover:bg-red-600"
                  onClick={() => handleRemoveImage(idx)}
                  aria-label={`Remove image ${idx + 1}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Image index */}
              <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm rounded-full w-6 h-6 flex items-center justify-center">
                <span className="text-xs font-bold text-orange-700">{idx + 1}</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-2">
          <button
            type="button"
            className="flex-1 bg-white/60 backdrop-blur-sm border border-orange-200/40 rounded-lg px-3 py-2 text-xs font-semibold text-orange-700 transition-all duration-300 hover:bg-white/80"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Add More button clicked');
              console.log('imagesInputRef.current:', imagesInputRef.current);
              if (imagesInputRef && imagesInputRef.current) {
                console.log('Triggering file input click');
                imagesInputRef.current.click();
              } else {
                console.error('imagesInputRef is null or undefined');
              }
            }}
          >
            <Upload className="w-3 h-3 inline mr-1" />
            Add More
          </button>
        </div>
      </div>
    )}

    {/* Empty state message */}
    {images.length === 0 && (
      <div className="text-center py-8">
        <div className="text-orange-600 text-sm">
          No images added yet
        </div>
        <div className="text-orange-500 text-xs mt-1">
          Upload images to start designing your wall
        </div>
      </div>
    )}
  </div>
);

export default UploadImagesPanel; 