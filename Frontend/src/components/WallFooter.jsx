import React from 'react';

const WallFooter = () => {
  return (
    <footer className="bg-secondary text-primary-dark text-center py-5 text-lg rounded-t-xl shadow-md col-span-2" style={{ gridArea: 'footer' }}>
      <div className="flex items-center justify-center gap-2">
        &copy; {new Date().getFullYear()} Picture Wall Designer
      </div>
    </footer>
  );
};

export default WallFooter; 