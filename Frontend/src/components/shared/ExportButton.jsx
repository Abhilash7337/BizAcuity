import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ExportButton = ({ wallRef }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [exporting, setExporting] = useState(false);
  const dropdownRef = useRef(null);

  const handleExport = async (format) => {
    if (!wallRef.current || exporting) return;

    setExporting(true);
    try {
      // Capture the wall as a canvas
      const wallCanvas = await html2canvas(wallRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#fff',
        scale: 2,
      });

      // Add padding around the wall
      const padding = 40;
      const paddedCanvas = document.createElement('canvas');
      paddedCanvas.width = wallCanvas.width + padding * 2;
      paddedCanvas.height = wallCanvas.height + padding * 2;
      const ctx = paddedCanvas.getContext('2d');

      // Fill background with white
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);

      // Draw the wall canvas onto the padded canvas
      ctx.drawImage(wallCanvas, padding, padding);

      switch (format) {
        case 'png':
          downloadImage(paddedCanvas.toDataURL('image/png'), 'wall-design.png');
          break;

        case 'jpeg':
          downloadImage(paddedCanvas.toDataURL('image/jpeg', 0.9), 'wall-design.jpg');
          break;

        case 'pdf':
          const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [paddedCanvas.width, paddedCanvas.height]
          });

          pdf.addImage(
            paddedCanvas.toDataURL('image/png'),
            'PNG',
            0,
            0,
            paddedCanvas.width,
            paddedCanvas.height
          );
          pdf.save('wall-design.pdf');
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
      setShowDropdown(false);
    }
  };

  const downloadImage = (dataUrl, fileName) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative group">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={exporting}
        className="w-14 h-14 bg-orange-600 hover:bg-orange-700 text-white rounded-full shadow-lg transition-all duration-300 animate-bounce-subtle transform hover:scale-110 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-orange-300/40"
        title="Export Design"
        aria-label="Export Design"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-7 w-7" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" 
            clipRule="evenodd" 
          />
        </svg>
        {/* Tooltip on hover */}
        <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 bg-orange-700 text-white text-xs rounded shadow opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 whitespace-nowrap">
          Export Design
        </span>
      </button>
      {showDropdown && (
        <div 
          ref={dropdownRef}
          className="absolute right-0 mt-3 w-40 rounded-xl shadow-xl bg-white ring-1 ring-orange-200 ring-opacity-50 z-50 animate-fade-in-up"
        >
          <div className="py-2 flex flex-col gap-1" role="menu">
            {['PNG', 'JPEG', 'PDF'].map((format) => (
              <button
                key={format}
                onClick={() => handleExport(format.toLowerCase())}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-50 hover:text-orange-800 rounded-lg transition-all duration-200"
                role="menuitem"
              >
                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                </svg>
                Export as {format}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportButton;