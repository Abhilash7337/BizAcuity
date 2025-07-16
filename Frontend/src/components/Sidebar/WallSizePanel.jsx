import React from 'react';
import { Settings, Ruler, Maximize2 } from 'lucide-react';

const WallSizePanel = ({ inputWidth, inputHeight, setInputWidth, setInputHeight, handleSetWallSize, MIN_SIZE, MAX_SIZE, isViewOnly = false }) => (
  <div className="group">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-gradient-to-r from-orange-400/20 to-orange-600/20 rounded-xl">
        <Maximize2 className="w-5 h-5 text-orange-700" />
      </div>
      <h3 className="text-orange-800 font-bold text-lg">Canvas Size</h3>
    </div>
    
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-orange-700">Width</label>
          <div className="relative">
            <input
              type="number"
              min={MIN_SIZE}
              max={MAX_SIZE}
              value={inputWidth}
              onChange={e => !isViewOnly && setInputWidth(e.target.value)}
              readOnly={isViewOnly}
              className={`w-full backdrop-blur-sm border rounded-xl px-4 py-3 text-orange-800 font-medium transition-all duration-300 ${
                isViewOnly 
                  ? 'bg-orange-100/60 border-orange-300/40 cursor-not-allowed' 
                  : 'bg-white/60 border-orange-200/40 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-500'
              }`}
              placeholder="Width"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-orange-600 font-medium">px</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-orange-700">Height</label>
          <div className="relative">
            <input
              type="number"
              min={MIN_SIZE}
              max={MAX_SIZE}
              value={inputHeight}
              onChange={e => !isViewOnly && setInputHeight(e.target.value)}
              readOnly={isViewOnly}
              className={`w-full backdrop-blur-sm border rounded-xl px-4 py-3 text-orange-800 font-medium transition-all duration-300 ${
                isViewOnly 
                  ? 'bg-orange-100/60 border-orange-300/40 cursor-not-allowed' 
                  : 'bg-white/60 border-orange-200/40 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-500'
              }`}
              placeholder="Height"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-orange-600 font-medium">px</span>
          </div>
        </div>
      </div>
      
      {!isViewOnly && (
        <button
          className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white rounded-xl px-6 py-3 font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2 group"
          onClick={handleSetWallSize}
        >
          <Settings className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          Apply Size
        </button>
      )}
      
      <div className="text-xs text-orange-600 text-center">
        {isViewOnly ? 'Current canvas size' : `Size range: ${MIN_SIZE}px - ${MAX_SIZE}px`}
      </div>
    </div>
  </div>
);

export default WallSizePanel; 