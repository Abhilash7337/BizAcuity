import React from 'react';
import { Settings, Ruler, Maximize2 } from 'lucide-react';

const WallSizePanel = ({ inputWidth, inputHeight, setInputWidth, setInputHeight, handleSetWallSize, MIN_SIZE, MAX_SIZE }) => (
  <div className="group">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-gradient-to-r from-primary/20 to-primary-dark/20 rounded-xl">
        <Maximize2 className="w-5 h-5 text-primary-dark" />
      </div>
      <h3 className="text-primary-dark font-bold text-lg">Canvas Size</h3>
    </div>
    
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-primary-dark/80">Width</label>
          <div className="relative">
            <input
              type="number"
              min={MIN_SIZE}
              max={MAX_SIZE}
              value={inputWidth}
              onChange={e => setInputWidth(e.target.value)}
              className="w-full bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl px-4 py-3 text-primary-dark font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
              placeholder="Width"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-primary-dark/60 font-medium">px</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-primary-dark/80">Height</label>
          <div className="relative">
            <input
              type="number"
              min={MIN_SIZE}
              max={MAX_SIZE}
              value={inputHeight}
              onChange={e => setInputHeight(e.target.value)}
              className="w-full bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl px-4 py-3 text-primary-dark font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
              placeholder="Height"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-primary-dark/60 font-medium">px</span>
          </div>
        </div>
      </div>
      
      <button
        className="w-full bg-gradient-to-r from-primary-dark to-primary text-white rounded-xl px-6 py-3 font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2 group"
        onClick={handleSetWallSize}
      >
        <Settings className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
        Apply Size
      </button>
      
      <div className="text-xs text-primary-dark/60 text-center">
        Size range: {MIN_SIZE}px - {MAX_SIZE}px
      </div>
    </div>
  </div>
);

export default WallSizePanel; 