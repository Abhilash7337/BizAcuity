import React from 'react';
import ImagePropertiesPanel from './ImagePropertiesPanel';
import { Image } from 'lucide-react';

export default function TabContentEditor({ selectedIdx, imageStates, handleShapeChange, handleFrameChange, handleDelete, handleSizeChange, handleRotationChange, handleOpacityChange, handleResetSize, handleFitToWall }) {
  if (selectedIdx !== null && imageStates[selectedIdx]) {
    return imageStates[selectedIdx].isDecor ? (
      <div className="bg-surface rounded-xl shadow-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Decor Item</h3>
        <button
          onClick={handleDelete}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Remove Decor
        </button>
      </div>
    ) : (
      <ImagePropertiesPanel
        imageState={imageStates[selectedIdx]}
        onShapeChange={handleShapeChange}
        onFrameChange={handleFrameChange}
        onDelete={handleDelete}
        onSizeChange={handleSizeChange}
        onRotationChange={handleRotationChange}
        onOpacityChange={handleOpacityChange}
        onResetSize={handleResetSize}
        onFitToWall={handleFitToWall}
      />
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-gray-200/50 to-gray-300/50 rounded-xl">
          <Image className="w-5 h-5 text-primary-dark" />
        </div>
        <h3 className="text-primary-dark font-bold text-lg">Image Editor</h3>
      </div>
      <div className="bg-gradient-to-r from-gray-100/50 to-gray-200/50 border-2 border-dashed border-gray-300/50 rounded-xl px-6 py-12 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
            <Image className="w-8 h-8 text-gray-500" />
          </div>
          <div className="space-y-2">
            <h4 className="text-primary-dark font-semibold">No Image Selected</h4>
            <p className="text-primary-dark/60 text-sm">Click on any image in your wall to edit its properties</p>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mt-6">
            <p className="text-blue-700 text-sm font-medium">💡 Tip: You can change shapes, frames, and adjust image properties once an image is selected.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
