import React, { useState, useEffect } from 'react';
import { Flower2 } from 'lucide-react';
import { authFetch } from '../../utils/auth';

const DecorsPanel = ({ onAddDecor, userDecors = [], onRemoveUserDecor, onSelectUserDecor, userPlanAllowedDecors = null }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [decors, setDecors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState({});

  // Debug: check authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    console.log('[DecorsPanel] Authentication check - Token exists:', !!token);
    console.log('[DecorsPanel] Authentication check - User exists:', !!user);
    if (user) {
      console.log('[DecorsPanel] User data:', JSON.parse(user));
    }
  }, []);

  // Debug: log incoming allowed decors
  console.log('[DecorsPanel] userPlanAllowedDecors:', userPlanAllowedDecors);
  // Fetch decors from API
  const fetchDecors = async () => {
    try {
      setLoading(true);
      console.log('[DecorsPanel] Fetching decors from API...');
      const response = await authFetch('/decors');
      console.log('[DecorsPanel] Response status:', response.status);
      console.log('[DecorsPanel] Response headers:', response.headers);
      
      const data = await response.json();
      console.log('[DecorsPanel] Response data length:', data.length);
      console.log('[DecorsPanel] First decor sample:', data[0]);
      
      // Check if first decor has image data
      if (data[0]) {
        console.log('[DecorsPanel] First decor image check:');
        console.log('[DecorsPanel] - Has image property:', !!data[0].image);
        console.log('[DecorsPanel] - Image data length:', data[0].image?.data?.length || 0);
        console.log('[DecorsPanel] - Content type:', data[0].image?.contentType || 'none');
        console.log('[DecorsPanel] - Image data preview:', data[0].image?.data?.substring(0, 100) || 'none');
      }
      
      console.log('[DecorsPanel] All decors data:', data);
      
      if (response.ok) {
        // Transform API data to match the component's expected format
        let transformedDecors = data.map(decor => {
          // Debug: log each decor id and image data
          console.log('[DecorsPanel] decor._id:', decor._id);
          console.log('[DecorsPanel] decor.image:', decor.image);
          console.log('[DecorsPanel] decor.image.data exists:', !!decor.image?.data);
          console.log('[DecorsPanel] decor.image.contentType exists:', !!decor.image?.contentType);
          if (decor.image?.contentType) {
            console.log('[DecorsPanel] decor.image.contentType:', decor.image.contentType);
          }
          
          // Set appropriate sizes based on category
          let size = { width: 150, height: 150 }; // Default size
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
          
          const src = decor.image && decor.image.data && decor.image.contentType
            ? `data:${decor.image.contentType};base64,${decor.image.data}`
            : '';
            
          console.log('[DecorsPanel] Generated src for decor', decor._id, ':', src ? 'has data' : 'no data');
          
          // Test if we can create a valid image source
          if (decor.image && decor.image.data && decor.image.contentType) {
            console.log('[DecorsPanel] Testing image source creation for decor', decor._id);
            console.log('[DecorsPanel] - Content type:', decor.image.contentType);
            console.log('[DecorsPanel] - Data length:', decor.image.data.length);
            console.log('[DecorsPanel] - Data starts with:', decor.image.data.substring(0, 50));
            console.log('[DecorsPanel] - Generated src starts with:', src.substring(0, 100));
            
            // Test base64 validation
            const isValid = testBase64Image(decor.image.data, decor.image.contentType);
            console.log('[DecorsPanel] Base64 validation result for decor', decor._id, ':', isValid);
          }
          if (src) {
            console.log('[DecorsPanel] Src starts with:', src.substring(0, 50));
            console.log('[DecorsPanel] Src length:', src.length);
            
            // Validate base64 data
            try {
              const base64Data = decor.image.data;
              if (base64Data && base64Data.length > 0) {
                // Check if it's valid base64
                const testDecode = atob(base64Data.substring(0, 100));
                console.log('[DecorsPanel] Base64 validation passed for decor', decor._id);
                
                // Check image size
                if (base64Data.length > 5000000) { // ~3.7MB in base64
                  console.warn('[DecorsPanel] Large image detected for decor', decor._id, 'size:', base64Data.length, 'characters');
                }
              }
            } catch (error) {
              console.error('[DecorsPanel] Base64 validation failed for decor', decor._id, ':', error.message);
            }
          }
          
          return {
            id: decor._id,
            name: decor.name,
            src: src,
            category: decor.category,
            description: decor.description,
            size: size
          };
        });
        
        // Add a test decor to verify image rendering works
        const testDecor = {
          id: 'test-decor',
          name: 'Test Image',
          src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2ZmOTgwMCIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlRlc3Q8L3RleHQ+PC9zdmc+',
          category: 'test',
          description: 'Test decor to verify image rendering',
          size: { width: 100, height: 100 }
        };
        
        console.log('[DecorsPanel] Added test decor with known working image');
        console.log('[DecorsPanel] Test decor src:', testDecor.src);
        
        // Do not filter decors here; show all decors, lock those not allowed in UI
        setDecors([...transformedDecors, testDecor]);
      } else {
        console.error('Failed to fetch decors:', data.error);
        console.error('Response status:', response.status);
        console.error('Response data:', data);
      }
    } catch (error) {
      console.error('Error fetching decors:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
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
    console.log('[DecorsPanel] Image error for decor:', decorId);
    setLoadError(prev => ({ ...prev, [decorId]: true }));
  };

  const handleImageLoad = (decorId) => {
    console.log('[DecorsPanel] Image loaded successfully for decor:', decorId);
    setLoadError(prev => ({ ...prev, [decorId]: false }));
  };

  const handleImageTimeout = (decorId) => {
    console.log('[DecorsPanel] Image timeout for decor:', decorId);
    setLoadError(prev => ({ ...prev, [decorId]: true }));
  };

  // Test function to validate base64 data
  const testBase64Image = (base64Data, contentType) => {
    try {
      if (!base64Data || !contentType) {
        console.log('[DecorsPanel] Missing base64 data or content type');
        return false;
      }
      
      // Check if it's valid base64
      const decoded = atob(base64Data);
      console.log('[DecorsPanel] Base64 decoded successfully, length:', decoded.length);
      
      // Check if it starts with expected image header
      const header = new Uint8Array(decoded.slice(0, 4));
      console.log('[DecorsPanel] Image header bytes:', Array.from(header));
      
      return true;
    } catch (error) {
      console.error('[DecorsPanel] Base64 validation failed:', error.message);
      return false;
    }
  };

  const [upgradeMsg, setUpgradeMsg] = useState('');
  const handleDecorClick = (decor) => {
    // If userPlanAllowedDecors is provided, restrict access
    if (userPlanAllowedDecors && !userPlanAllowedDecors.includes(decor.id)) {
      setUpgradeMsg('This decor is not available in your current plan. Upgrade to access more decors.');
      setTimeout(() => setUpgradeMsg(''), 2500);
      return;
    }
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
                  // Debug: log src for each decor
                  console.log('[DecorsPanel] Render decor:', decor.id, decor.name, decor.src);
                  return (
                    <div
                      key={decor.id}
                      onClick={() => handleDecorClick(decor)}
                      className={`relative group cursor-pointer bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 hover:border-orange-300 transition-all duration-300 hover:shadow-lg hover:scale-105 overflow-hidden ${isLocked ? 'opacity-85 pointer-events-auto' : ''}`}
                    >
                      <div className="aspect-square p-2 flex items-center justify-center bg-gradient-to-br from-white/50 to-orange-50/30">
                        <img
                          src={decor.src || 'https://via.placeholder.com/150?text=No+Image'}
                          alt={decor.name}
                          className="max-w-full max-h-full object-contain filter drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300"
                          onError={(e) => {
                            console.log('[DecorsPanel] Image error event:', e);
                            console.log('[DecorsPanel] Failed src:', decor.src);
                            console.log('[DecorsPanel] Error target:', e.target);
                            console.log('[DecorsPanel] Error details:', e.target.error);
                            handleImageError(decor.id);
                          }}
                          onLoad={(e) => {
                            console.log('[DecorsPanel] Image load event:', e);
                            console.log('[DecorsPanel] Successful src:', decor.src);
                            console.log('[DecorsPanel] Loaded image dimensions:', e.target.naturalWidth, 'x', e.target.naturalHeight);
                            handleImageLoad(decor.id);
                          }}
                          onAbort={(e) => {
                            console.log('[DecorsPanel] Image abort event:', e);
                            handleImageError(decor.id);
                          }}
                          style={{ display: loadError[decor.id] ? 'none' : 'block' }}
                          loading="lazy"
                          crossOrigin="anonymous"
                        />
                        {loadError[decor.id] && (
                          <div className="flex flex-col items-center justify-center text-orange-400">
                            <Flower2 className="w-8 h-8 mb-2" />
                            <span className="text-xs">No image</span>
                            <span className="text-xs break-all">{decor.src && decor.src.length > 40 ? decor.src.substring(0, 40) + '...' : decor.src}</span>
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