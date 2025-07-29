import React, { useState, useEffect } from 'react';
import { Flower2 } from 'lucide-react';
import { authFetch } from '../../utils/auth';

const DecorsPanel = ({ onAddDecor, userDecors = [], onRemoveUserDecor, onSelectUserDecor, userPlanAllowedDecors = null }) => {
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
        // Add src property for static file serving
        let transformedDecors = data.map(decor => {
          let size = { width: 150, height: 150 };
          switch(decor.category) {
            case 'tables': size = { width: 200, height: 150 }; break;
            case 'plants': size = { width: 150, height: 200 }; break;
            case 'clocks': size = { width: 150, height: 150 }; break;
            case 'fruits': size = { width: 120, height: 120 }; break;
            case 'garlands': size = { width: 250, height: 80 }; break;
            case 'lamps': size = { width: 100, height: 180 }; break;
            case 'chairs': size = { width: 150, height: 160 }; break;
            case 'flowers': size = { width: 130, height: 130 }; break;
            case 'frames': size = { width: 180, height: 240 }; break;
            default: size = { width: 150, height: 150 };
          }
          // Use imageUrl from backend, fallback to placeholder
          let src = decor.imageUrl
            ? `${process.env.VITE_API_BASE_URL || ''}${decor.imageUrl}`
            : 'https://via.placeholder.com/150?text=No+Image';
          // Debug log for each decor
          return {
            ...decor,
            id: decor._id,
            size,
            src
          };
        });
        setDecors(transformedDecors);
      }
    } catch (error) {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecors();
  }, [userPlanAllowedDecors]);

  // Listen for storage events to refresh when admin makes changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'refreshDecors') {
        fetchDecors();
        localStorage.removeItem('refreshDecors');
      }
    };
    window.addEventListener('storage', handleStorageChange);
    const handleCustomRefresh = () => { fetchDecors(); };
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

  const [upgradeMsg, setUpgradeMsg] = useState('');
  const handleDecorClick = (decor) => {
    if (userPlanAllowedDecors && !userPlanAllowedDecors.includes(decor.id)) {
      setUpgradeMsg('This decor is not available in your current plan. Upgrade to access more decors.');
      setTimeout(() => setUpgradeMsg(''), 2500);
      return;
    }
    if (onAddDecor) {
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
      {upgradeMsg && (
        <div className="mb-3 p-2 bg-red-100 border border-red-300 text-red-700 text-sm rounded text-center animate-pulse">
          {upgradeMsg}
        </div>
      )}
      <div className="flex items-center gap-2 mb-4">
        <Flower2 className="w-5 h-5 text-orange-600" />
        <h3 className="font-semibold text-orange-800">Decors</h3>
      </div>

      {/* User Uploaded Decors Section */}
      {userDecors.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-orange-700 mb-3 px-1">Your Uploaded Decors</h4>
          <div className="grid grid-cols-2 gap-3">
            {userDecors.map(({ src, state, idx }, i) => (
              <div
                key={idx}
                className="relative group bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 hover:border-orange-300 transition-all duration-300 hover:shadow-lg hover:scale-105 overflow-hidden cursor-pointer"
                onClick={() => onSelectUserDecor && onSelectUserDecor(idx)}
              >
                <div className="aspect-square p-2 flex items-center justify-center bg-gradient-to-br from-white/50 to-orange-50/30">
                  <img
                    src={src}
                    alt={`User Decor ${i + 1}`}
                    className="max-w-full max-h-full object-contain filter drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300"
                  />
                </div>
                <div className="p-3 bg-white/80 backdrop-blur-sm flex flex-col items-center">
                  <p className="text-xs font-semibold text-orange-800 text-center mb-2">User Decor</p>
                  <button
                    type="button"
                    className="bg-red-500 text-white rounded-full px-3 py-1 text-xs font-semibold hover:bg-red-600 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveUserDecor && onRemoveUserDecor(idx);
                    }}
                  >
                    Delete
                  </button>
                </div>
                {/* Size indicator */}
                <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1">
                  <span className="text-xs font-medium text-orange-700">
                    {state.width}×{state.height}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
                {category.items.map((decor) => {
                  const isLocked = userPlanAllowedDecors && !userPlanAllowedDecors.includes(decor.id);
                  return (
                    <div
                      key={decor.id}
                      onClick={() => handleDecorClick(decor)}
                      className={`relative group cursor-pointer bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 hover:border-orange-300 transition-all duration-300 hover:shadow-lg hover:scale-105 overflow-hidden ${isLocked ? 'opacity-85 pointer-events-auto' : ''}`}
                    >
                      <div className="aspect-square p-2 flex items-center justify-center bg-gradient-to-br from-white/50 to-orange-50/30">
                        <img
                          src={decor.src}
                          alt={decor.name}
                          className="max-w-full max-h-full object-contain filter drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300"
                          onError={() => handleImageError(decor.id)}
                          onLoad={() => handleImageLoad(decor.id)}
                          style={{ display: loadError[decor.id] ? 'none' : 'block' }}
                          loading="lazy"
                        />
                        {loadError[decor.id] && (
                          <div className="flex flex-col items-center justify-center text-orange-400">
                            <Flower2 className="w-8 h-8 mb-2" />
                            <span className="text-xs">No image</span>
                            <span className="text-xs text-red-500">Image not available</span>
                          </div>
                        )}
                        {isLocked && (
                          <div className="absolute inset-0 bg-white/20 flex items-center justify-center z-10">
                            <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 17v1m-6 4h12a2 2 0 002-2v-7a2 2 0 00-2-2H6a2 2 0 00-2 2v7a2 2 0 002 2zm6-4a2 2 0 11-4 0 2 2 0 014 0zm-2-6V7a4 4 0 118 0v2" /></svg>
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
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DecorsPanel;