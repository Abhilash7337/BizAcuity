import React, { useState } from 'react';
import { Flower2 } from 'lucide-react';
import { authFetch } from '../../utils/auth';

const decorCategories = {
  clocks: {
    name: "Clocks",
    items: [
      {
        id: 'vintage-clock',
        name: 'Vintage Clock',
        src: '/decors/Vintage_Clock.png',
        size: { width: 150, height: 150 }
      }
    ]
  },
  tables: {
    name: "Tables",
    items: [
      {
        id: 'black-table',
        name: 'Black Table',
        src: '/decors/Black.png',
        size: { width: 200, height: 150 }
      },
      {
        id: 'black-table-2',
        name: 'Black Table 2',
        src: '/decors/Blackt.png',
        size: { width: 200, height: 150 }
      },
      {
        id: 'white-table',
        name: 'White Table',
        src: '/decors/White.png',
        size: { width: 200, height: 150 }
      },
      {
        id: 'table-4',
        name: 'Table 4',
        src: '/decors/table4.png',
        size: { width: 350, height: 200 }
      }
    ]
  },
  plants: {
    name: "Plants",
    items: [
      {
        id: 'indoor-plant-1',
        name: 'Indoor Plant 1',
        src: '/decors/Flowerplant.png',
        size: { width: 150, height: 200 }
      },
      {
        id: 'indoor-plant-2',
        name: 'Indoor Plant 2',
        src: '/decors/Flowerpot2.png',
        size: { width: 150, height: 200 }
      }
    ]
  },
  fruits: {
    name: "Fruits",
    items: [
      {
        id: 'fruit',
        name: 'Fruit',
        src: '/decors/Fruit.png',
        size: { width: 150, height: 150 }
      }
    ]
  },
  garlands: {
    name: "Garlands",
    items: [
      {
        id: 'flower-garland',
        name: 'Flower Garland',
        src: '/decors/Garland1.png',
        size: { width: 200, height: 200 }
      }
    ]
  }
};

const DecorsPanel = ({ onAddDecor }) => {
  const [loadError, setLoadError] = useState({});
  const [activeCategory, setActiveCategory] = useState('clocks');

  const handleDecorClick = async (decor) => {
    if (loadError[decor.id]) return;

    try {
      // Create a blob from the image URL
      const response = await fetch(decor.src);
      const blob = await response.blob();
      
      // Upload the blob
      const formData = new FormData();
      formData.append('image', blob, `decor-${decor.id}${decor.src.substring(decor.src.lastIndexOf('.'))}`);
      
      const uploadResponse = await authFetch('http://localhost:5001/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload decor image');
      }

      const data = await uploadResponse.json();
      
      onAddDecor({
        src: data.url,
        size: decor.size
      });
    } catch (error) {
      console.error(`Failed to process decor image for ${decor.id}:`, error);
      setLoadError(prev => ({ ...prev, [decor.id]: true }));
    }
  };

  const handleImageError = (decorId) => {
    setLoadError(prev => ({ ...prev, [decorId]: true }));
    console.error(`Failed to load decor image for ${decorId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-orange-300/50 to-orange-400/50 rounded-xl">
          <Flower2 className="w-5 h-5 text-orange-700" />
        </div>
        <h3 className="text-orange-800 font-bold text-lg">Decorations</h3>
      </div>

      {/* Category Navigation */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Categories</div>
        <div className="grid grid-cols-1 gap-2">
          {Object.entries(decorCategories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 text-left ${
                activeCategory === key
                  ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg transform scale-105'
                  : 'bg-white/60 backdrop-blur-sm text-orange-700 hover:bg-white/80 hover:scale-102'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{category.name}</span>
                <span className="text-xs opacity-70">
                  {category.items.length} item{category.items.length !== 1 ? 's' : ''}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Active Category Items */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          <span className="text-sm font-semibold text-orange-700">
            {decorCategories[activeCategory].name} Collection
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {decorCategories[activeCategory].items.map((decor, index) => (
            <div
              key={decor.id}
              onClick={() => !loadError[decor.id] && handleDecorClick(decor)}
              className={`group relative rounded-xl overflow-hidden border-2 border-white/40 shadow-lg transition-all duration-300 cursor-pointer animate-fade-in-up ${
                loadError[decor.id] 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:scale-105 hover:shadow-xl hover:border-orange-400/50'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={decor.src}
                  alt={decor.name}
                  onError={() => handleImageError(decor.id)}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                
                {/* Overlay */}
                {!loadError[decor.id] && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-2 left-2 right-2 text-white text-xs font-medium">
                      Click to add to wall
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-3 bg-white/80 backdrop-blur-sm">
                <p className="text-sm font-semibold text-orange-800 text-center">
                  {decor.name}
                </p>
                {loadError[decor.id] && (
                  <p className="text-xs text-red-500 text-center mt-1">Image not available</p>
                )}
              </div>
              
              {/* Size indicator */}
              {!loadError[decor.id] && (
                <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1">
                  <span className="text-xs font-medium text-orange-700">
                    {decor.size.width}×{decor.size.height}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DecorsPanel; 