import React from 'react';

const ToggleSwitch = ({ 
  isOn, 
  onToggle, 
  label, 
  description, 
  disabled = false 
}) => {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        {description && (
          <p className="text-sm text-gray-500">
            {description}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:ring-offset-2
          ${isOn 
            ? 'bg-primary-dark' 
            : 'bg-gray-200'
          }
          ${disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'cursor-pointer hover:bg-opacity-80'
          }
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out shadow-md
            ${isOn ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
};

export default ToggleSwitch; 