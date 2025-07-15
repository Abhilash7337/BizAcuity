import { useState } from 'react'
import ShapeSelector from './ShapeSelector'
import FrameSelector from './FrameSelector'
import { Square, Circle, Image, Trash2, RotateCw, Move, Palette, Sliders, Eye, EyeOff } from 'lucide-react'

function ImagePropertiesPanel({ 
  imageState, 
  onShapeChange, 
  onFrameChange, 
  onDelete, 
  onSizeChange, 
  onRotationChange, 
  onOpacityChange, 
  onResetSize, 
  onFitToWall 
}) {
  if (!imageState) return null;

  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-purple-200/50 to-blue-200/50 rounded-xl">
          <Image className="w-5 h-5 text-primary-dark" />
        </div>
        <h3 className="text-primary-dark font-bold text-lg">Image Editor</h3>
      </div>

      {/* Shape Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <Square className="w-4 h-4 text-primary-dark/70" />
          <label className="text-sm font-semibold text-primary-dark/80">Shape Style</label>
        </div>
        <ShapeSelector
          shape={imageState.shape}
          onChange={onShapeChange}
        />
      </div>

      {/* Separator */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary-dark/30 to-transparent"></div>
        <span className="text-sm font-semibold text-primary-dark/60 bg-white/60 px-3 py-1 rounded-full">AND</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary-dark/30 to-transparent"></div>
      </div>

      {/* Frame Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <Circle className="w-4 h-4 text-primary-dark/70" />
          <label className="text-sm font-semibold text-primary-dark/80">Frame Style</label>
        </div>
        <FrameSelector
          frame={imageState.frame}
          onChange={onFrameChange}
        />
      </div>

      {/* Advanced Controls Toggle */}
      <div className="border-t border-primary-dark/20 pt-6">
        <button
          type="button"
          onClick={() => {
            console.log('Advanced toggle clicked, current state:', showAdvanced);
            setShowAdvanced(!showAdvanced);
          }}
          className="flex items-center gap-2 text-primary-dark hover:text-primary transition-colors duration-200 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 w-full justify-center border border-white/40 hover:border-primary/30"
        >
          <Sliders className="w-4 h-4" />
          <span className="font-medium">Advanced Controls</span>
          {showAdvanced ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {/* Advanced Controls */}
      {showAdvanced && (
        <div className="space-y-6 animate-fade-in-down bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/40">
          <div className="text-center mb-4">
            <h4 className="text-primary-dark font-semibold text-sm">🛠️ Advanced Image Controls</h4>
          </div>
          
          {/* Size Controls */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 font-medium text-primary-dark text-sm">
              <Move className="w-4 h-4" />
              Size & Position
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-primary-dark/70 block font-medium">Width</label>
                <input
                  type="range"
                  min="50"
                  max="300"
                  value={imageState.width || 150}
                  onChange={(e) => {
                    const newValue = Number(e.target.value);
                    console.log('Width changed to:', newValue);
                    onSizeChange && onSizeChange('width', newValue);
                  }}
                  className="w-full h-3 bg-gradient-to-r from-blue-200 to-blue-300 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-primary-dark/60">
                  <span>50px</span>
                  <span className="font-semibold text-primary-dark">{imageState.width || 150}px</span>
                  <span>300px</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-primary-dark/70 block font-medium">Height</label>
                <input
                  type="range"
                  min="50"
                  max="300"
                  value={imageState.height || 150}
                  onChange={(e) => {
                    const newValue = Number(e.target.value);
                    console.log('Height changed to:', newValue);
                    onSizeChange && onSizeChange('height', newValue);
                  }}
                  className="w-full h-3 bg-gradient-to-r from-green-200 to-green-300 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-primary-dark/60">
                  <span>50px</span>
                  <span className="font-semibold text-primary-dark">{imageState.height || 150}px</span>
                  <span>300px</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rotation Control */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 font-medium text-primary-dark text-sm">
              <RotateCw className="w-4 h-4" />
              Rotation
            </label>
            <input
              type="range"
              min="0"
              max="360"
              value={imageState.rotation || 0}
              onChange={(e) => {
                const newValue = Number(e.target.value);
                console.log('Rotation changed to:', newValue, 'for image state:', imageState);
                onRotationChange && onRotationChange(newValue);
              }}
              className="w-full h-3 bg-gradient-to-r from-purple-200 to-purple-300 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-primary-dark/60">
              <span>0°</span>
              <span className="font-semibold text-primary-dark">{imageState.rotation || 0}°</span>
              <span>360°</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="border-t border-primary-dark/20 pt-6 space-y-3">
        <button
          onClick={onDelete}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Remove Image
        </button>
      </div>
    </div>
  )
}

export default ImagePropertiesPanel