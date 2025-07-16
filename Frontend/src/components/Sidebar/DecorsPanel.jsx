import React, { useState, useEffect } from 'react';
import { Flower2 } from 'lucide-react';
import { authFetch } from '../../utils/auth';

const DecorsPanel = ({ onAddDecor }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [decors, setDecors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState({});

  // Fetch decors from API
  const fetchDecors = async () => {
    try {
      setLoading(true);
      const response = await authFetch('/decors');
      const data = await response.json();
      
      if (response.ok) {
        // Transform API data to match the component's expected format
        const transformedDecors = data.map(decor => {
          // Set appropriate sizes based on category
          let size = { width: 150, height: 150 }; // Default size
          
          switch(decor.category) {
            case 'tables':
              size = { width: 200, height: 150 };
              break;
            case 'plants':
              size = { width: 150, height: 200 };
              break;
            case 'clocks':
              size = { width: 150, height: 150 };
              break;
            case 'fruits':
              size = { width: 120, height: 120 };
              break;
            case 'garlands':
              size = { width: 250, height: 80 };
              break;
            case 'lamps':
              size = { width: 100, height: 180 };
              break;
            case 'chairs':
              size = { width: 150, height: 160 };
              break;
            case 'flowers':
              size = { width: 130, height: 130 };
              break;
            case 'frames':
              size = { width: 180, height: 240 };
              break;
            default:
              size = { width: 150, height: 150 };
          }
          
          return {
            id: decor._id,
            name: decor.name,
            src: `http://localhost:5001${decor.imageUrl}`,
            category: decor.category,
            description: decor.description,
            size: size
          };
        });
        setDecors(transformedDecors);
      } else {
        console.error('Failed to fetch decors:', data.error);
      }
    } catch (error) {
      console.error('Error fetching decors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecors();
  }, []);

  // Listen for storage events to refresh when admin makes changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'refreshDecors') {
        fetchDecors();
        localStorage.removeItem('refreshDecors'); // Clean up
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events within the same tab
    const handleCustomRefresh = () => {
      fetchDecors();
    };
    
    window.addEventListener('refreshDecors', handleCustomRefresh);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('refreshDecors', handleCustomRefresh);
    };
  }, []);

  // Group decors by category
  const decorCategories = decors.reduce((acc, decor) => {
    if (!acc[decor.category]) {
      acc[decor.category] = {
        name: decor.category.charAt(0).toUpperCase() + decor.category.slice(1),
        items: []
      };
    }
    acc[decor.category].items.push(decor);
    return acc;
  }, {});

  const handleImageError = (decorId) => {
    setLoadError(prev => ({ ...prev, [decorId]: true }));
  };

  const handleImageLoad = (decorId) => {
    setLoadError(prev => ({ ...prev, [decorId]: false }));
  };

  const handleDecorClick = (decor) => {
    if (onAddDecor && !loadError[decor.id]) {
      onAddDecor({
        id: decor.id,
        name: decor.name,
        src: decor.src,
        size: decor.size
      });
    }
  };

  const filteredCategories = selectedCategory === 'all' 
    ? Object.entries(decorCategories) 
    : Object.entries(decorCategories).filter(([key]) => key === selectedCategory);

  if (loading) {
    return (
      <div className="h-full bg-gradient-to-br from-orange-50 to-orange-100 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Flower2 className="w-5 h-5 text-orange-600" />
          <h3 className="font-semibold text-orange-800">Decors</h3>
        </div>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Flower2 className="w-5 h-5 text-orange-600" />
        <h3 className="font-semibold text-orange-800">Decors</h3>
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 border border-orange-200 rounded-lg bg-white/80 backdrop-blur-sm text-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
        >
          <option value="all">All Categories</option>
          {Object.keys(decorCategories).map(category => (
            <option key={category} value={category}>
              {decorCategories[category].name}
            </option>
          ))}
        </select>
      </div>

      {/* Decor Items */}
      <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-8 text-orange-600">
            <p>No decors available</p>
          </div>
        ) : (
          filteredCategories.map(([categoryKey, category]) => (
            <div key={categoryKey}>
              <h4 className="text-sm font-semibold text-orange-700 mb-3 px-1">
                {category.name}
              </h4>
              
              <div className="grid grid-cols-2 gap-3">
                {category.items.map((decor) => (
                  <div
                    key={decor.id}
                    onClick={() => handleDecorClick(decor)}
                    className="relative group cursor-pointer bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 hover:border-orange-300 transition-all duration-300 hover:shadow-lg hover:scale-105 overflow-hidden"
                  >
                    <div className="aspect-square p-2 flex items-center justify-center bg-gradient-to-br from-white/50 to-orange-50/30">
                      <img
                        src={decor.src}
                        alt={decor.name}
                        className="max-w-full max-h-full object-contain filter drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300"
                        onError={() => handleImageError(decor.id)}
                        onLoad={() => handleImageLoad(decor.id)}
                        style={{ display: loadError[decor.id] ? 'none' : 'block' }}
                      />
                      
                      {loadError[decor.id] && (
                        <div className="flex flex-col items-center justify-center text-orange-400">
                          <Flower2 className="w-8 h-8 mb-2" />
                          <span className="text-xs">No image</span>
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
          ))
        )}
      </div>
    </div>
  );
};

export default DecorsPanel;