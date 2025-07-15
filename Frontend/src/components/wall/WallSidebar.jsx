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
               rgba(249, 250, 251, 0.95) 100%)`,
             backdropFilter: 'blur(20px)',
             border: '1px solid rgba(255, 255, 255, 0.3)',
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
          backgroundImage: `linear-gradient(45deg, rgba(99, 102, 241, 0.1) 25%, transparent 25%),
                           linear-gradient(-45deg, rgba(99, 102, 241, 0.1) 25%, transparent 25%),
                           linear-gradient(45deg, transparent 75%, rgba(99, 102, 241, 0.1) 75%),
                           linear-gradient(-45deg, transparent 75%, rgba(99, 102, 241, 0.1) 75%)`,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        }}></div>
      </div>
      {/* Wall Size Panel - Always visible */}
      <div className="animate-fade-in-up">
        <WallSizePanel
          inputWidth={inputWidth}
          inputHeight={inputHeight}
          setInputWidth={setInputWidth}
          setInputHeight={setInputHeight}
          handleSetWallSize={handleSetWallSize}
          MIN_SIZE={MIN_SIZE}
          MAX_SIZE={MAX_SIZE}
        />
      </div>

      {/* Modern Tab Navigation */}
      <div className="animate-fade-in-up delay-100">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/40">
          <div className="grid grid-cols-2 gap-1">
            {TABS.map((tab, index) => (
              <button
                key={tab.key}
                className={`relative px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 transform ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-primary-dark to-primary text-white shadow-lg scale-105'
                    : 'text-primary-dark/70 hover:text-primary-dark hover:bg-white/50'
                } ${tab.key === 'editor' && selectedIdx === null ? 'opacity-50 cursor-not-allowed' : 'hover:scale-102'}`}
                onClick={() => setActiveTab(tab.key)}
                disabled={tab.key === 'editor' && selectedIdx === null}
              >
                <span className="relative z-10">{tab.label}</span>
                {activeTab === tab.key && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary-dark/20 rounded-xl blur-sm"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content with Animation */}
      <div className="flex-1 animate-slide-in-up delay-200" style={{ minHeight: '400px' }}>
        <div className="h-full overflow-auto">
          {tabContent}
        </div>
      </div>
    </aside>
  );
};

export default WallSidebar; 