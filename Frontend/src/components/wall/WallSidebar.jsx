import React from 'react';
import { WallSizePanel } from '../sidebar';

const WallSidebar = ({
  activeTab,
  setActiveTab,
  TABS,
  tabContent,
  inputWidth,
  inputHeight,
  setInputWidth,
  setInputHeight,
  handleSetWallSize,
  MIN_SIZE,
  MAX_SIZE,
  selectedIdx,
  isViewOnly = false,
  className
}) => {
  return (
    <aside className={`wall-sidebar sidebar-container floating-sidebar fixed left-4 top-24 bottom-4 z-40 rounded-2xl p-6 flex flex-col gap-6 ${className || ''}`} 
           style={{ 
             width: '340px',
             minWidth: '340px',
             maxWidth: '340px',
             overflowY: 'auto',
             overflowX: 'hidden',
             background: `linear-gradient(145deg, 
               rgba(255, 255, 255, 0.98) 0%, 
               rgba(254, 243, 199, 0.95) 100%)`,
             backdropFilter: 'blur(20px)',
             border: '1px solid rgba(249, 115, 22, 0.2)',
             boxShadow: `
               0 20px 25px -5px rgba(0, 0, 0, 0.1),
               0 10px 10px -5px rgba(0, 0, 0, 0.04),
               0 0 0 1px rgba(255, 255, 255, 0.05),
               inset 0 1px 0 rgba(255, 255, 255, 0.9)
             `
           }}>
      
      {/* Sidebar Background Pattern */}
      <div className="absolute inset-0 opacity-5 rounded-2xl overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(45deg, rgba(249, 115, 22, 0.1) 25%, transparent 25%),
                           linear-gradient(-45deg, rgba(249, 115, 22, 0.1) 25%, transparent 25%),
                           linear-gradient(45deg, transparent 75%, rgba(249, 115, 22, 0.1) 75%),
                           linear-gradient(-45deg, transparent 75%, rgba(249, 115, 22, 0.1) 75%)`,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        }}></div>
      </div>
      {/* Wall Size Panel - Read-only in view mode */}
      <div className="animate-fade-in-up">
        <WallSizePanel
          inputWidth={inputWidth}
          inputHeight={inputHeight}
          setInputWidth={setInputWidth}
          setInputHeight={setInputHeight}
          handleSetWallSize={handleSetWallSize}
          MIN_SIZE={MIN_SIZE}
          MAX_SIZE={MAX_SIZE}
          isViewOnly={isViewOnly}
        />
      </div>

      {/* Modern Tab Navigation - Hidden in view-only mode */}
      {!isViewOnly && (
        <div className="animate-fade-in-up delay-100">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/40">
            <div className="grid grid-cols-2 gap-1">
              {TABS.map((tab, index) => (
                <button
                  key={tab.key}
                  className={`relative px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 transform ${
                    activeTab === tab.key
                      ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg scale-105'
                      : 'text-orange-700 hover:text-orange-800 hover:bg-orange-50/50'
                  } ${tab.key === 'editor' && selectedIdx === null ? 'opacity-50 cursor-not-allowed' : 'hover:scale-102'}`}
                  onClick={() => setActiveTab(tab.key)}
                  disabled={tab.key === 'editor' && selectedIdx === null}
                >
                  <span className="relative z-10">{tab.label}</span>
                  {activeTab === tab.key && (
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-xl blur-sm"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content with Animation - Hidden in view-only mode */}
      {!isViewOnly && (
        <div className="flex-1 animate-slide-in-up delay-200" style={{ minHeight: '400px' }}>
          <div className="h-full overflow-auto">
            {tabContent}
          </div>
        </div>
      )}

      {/* View-Only Information */}
      {isViewOnly && (
        <div className="animate-fade-in-up delay-100">
          <div className="bg-amber-50/80 rounded-lg p-4 border border-amber-200/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-amber-800">View-Only Mode</h3>
            </div>
            <p className="text-amber-700 text-sm leading-relaxed">
              You're viewing this wall design in read-only mode. 
              You can see all elements but cannot make changes or upload new images.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default WallSidebar; 