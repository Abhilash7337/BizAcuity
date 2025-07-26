import React from 'react';
import WallSizePanel from './sidebar/WallSizePanel';

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
  selectedIdx
}) => {
  return (
    <aside className="bg-secondary p-8 rounded-xl shadow-lg flex flex-col gap-4 min-w-[260px] max-w-[340px]" style={{ gridArea: 'sidebar' }}>
      <WallSizePanel
        inputWidth={inputWidth}
        inputHeight={inputHeight}
        setInputWidth={setInputWidth}
        setInputHeight={setInputHeight}
        handleSetWallSize={handleSetWallSize}
        MIN_SIZE={MIN_SIZE}
        MAX_SIZE={MAX_SIZE}
      />
      {/* Tab bar */}
      <div className="flex mb-2 border-b border-border">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`flex-1 py-2 px-2 text-sm font-semibold transition-colors border-b-2 ${activeTab === tab.key ? 'border-primary-dark text-primary-dark bg-surface' : 'border-transparent text-gray-400 hover:text-primary-dark'}`}
            onClick={() => setActiveTab(tab.key)}
            disabled={tab.key === 'editor' && selectedIdx === null}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Tab content */}
      <div className="flex-1">{tabContent}</div>
    </aside>
  );
};

export default WallSidebar; 