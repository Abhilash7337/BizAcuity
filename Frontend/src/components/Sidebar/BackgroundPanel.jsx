import React from 'react';
import { Upload, Palette, Image as LucideImage, X, Brush } from 'lucide-react';

const BackgroundPanel = ({ wallImageInputRef, wallImage, handleRemoveWallImage, wallColor, handleColorChange }) => (
  <div className="space-y-6">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-gradient-to-r from-orange-300/50 to-orange-400/50 rounded-xl">
        <Brush className="w-5 h-5 text-orange-700" />
      </div>
      <h3 className="text-orange-800 font-bold text-lg">Background</h3>
    </div>

    {/* Background Image Section */}
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <LucideImage className="w-4 h-4 text-orange-600" />
        <label className="text-sm font-semibold text-orange-700">Background Image</label>
      </div>
      
      <div className="relative">
        {/* Direct file input overlay */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            console.log('� Direct background file input triggered');
            if (e.target.files?.[0] && wallImageInputRef?.current) {
              // Copy files to the hidden input to maintain existing workflow
              const dt = new DataTransfer();
              dt.items.add(e.target.files[0]);
              wallImageInputRef.current.files = dt.files;
              
              // Trigger the existing change handler
              const changeEvent = new Event('change', { bubbles: true });
              wallImageInputRef.current.dispatchEvent(changeEvent);
              console.log('� File forwarded to main handler');
            }
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          title="Upload Background Image"
        />
        
        {/* Visual button underneath */}
        <div className="w-full bg-gradient-to-r from-orange-400/10 to-orange-500/10 border-2 border-dashed border-orange-300/50 rounded-xl px-6 py-8 transition-all duration-300 hover:border-orange-400 hover:bg-gradient-to-r hover:from-orange-400/20 hover:to-orange-500/20 group">
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-white/60 rounded-full group-hover:scale-110 transition-transform duration-300">
              <Upload className="w-6 h-6 text-orange-700" />
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-orange-800">Upload Background</div>
              <div className="text-xs text-orange-600 mt-1">Click to browse files</div>
            </div>
          </div>
        </div>
      </div>
      
      {wallImage && (
        <div className="relative group rounded-xl overflow-hidden border-2 border-white/40 shadow-lg animate-fade-in-up">
          {(() => {
            const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
            const safeSrc = wallImage && wallImage.startsWith('http') ? wallImage : `${API_BASE}${wallImage && wallImage.startsWith('/') ? wallImage : `/${wallImage}`}`;
            return (
              <img src={safeSrc} alt="background preview" className="w-full h-32 object-cover" />
            );
          })()}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              type="button"
              className="bg-red-500 text-white rounded-full p-2 transition-all duration-300 transform hover:scale-110 hover:bg-red-600"
              onClick={handleRemoveWallImage}
              aria-label="Remove background"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>

    {/* Separator */}
    <div className="flex items-center gap-4 my-6">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-600/30 to-transparent"></div>
      <span className="text-sm font-semibold text-orange-600 bg-white/60 px-3 py-1 rounded-full">OR</span>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-600/30 to-transparent"></div>
    </div>

    {/* Background Color Section */}
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Palette className="w-4 h-4 text-orange-600" />
        <label className="text-sm font-semibold text-orange-700">Background Color</label>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="color"
            value={wallColor}
            onChange={handleColorChange}
            className="w-16 h-16 rounded-xl border-2 border-orange-300/40 cursor-pointer shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
            title="Choose background color"
          />
          <div className="absolute inset-0 rounded-xl border-2 border-orange-200/60 pointer-events-none"></div>
        </div>
        
        <div className="flex-1">
          <input
            type="text"
            value={wallColor}
            onChange={handleColorChange}
            className="w-full bg-white/60 backdrop-blur-sm border border-orange-200/40 rounded-xl px-4 py-3 text-orange-800 font-medium focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-500 transition-all duration-300"
            placeholder="#FFFFFF"
          />
        </div>
      </div>
      
      {/* Quick Color Presets */}
      <div className="grid grid-cols-6 gap-2 mt-4">
        {['#FFFFFF', '#FED7AA', '#FDBA74', '#FB923C', '#F97316', '#EA580C'].map((color) => (
          <button
            key={color}
            className="w-8 h-8 rounded-lg border-2 border-orange-200/40 transition-all duration-300 hover:scale-110 hover:shadow-lg"
            style={{ backgroundColor: color }}
            onClick={() => handleColorChange({ target: { value: color } })}
            title={color}
          />
        ))}
      </div>
    </div>
  </div>
);

export default BackgroundPanel; 