import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-orange-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold font-poppins mb-4">MIALTAR</h3>
            <p className="text-white/80 font-inter mb-4">
              Create beautiful, professional wall layouts with ease. Your creativity, our tools.
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors duration-300 cursor-pointer">
                <span className="text-sm">f</span>
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors duration-300 cursor-pointer">
                <span className="text-sm">t</span>
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors duration-300 cursor-pointer">
                <span className="text-sm">in</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-white/80">
              <li><Link to="#about" className="hover:text-orange-200 transition-colors duration-300">About Us</Link></li>
              <li><Link to="#features" className="hover:text-orange-200 transition-colors duration-300">Features</Link></li>
              <li><Link to="#pricing" className="hover:text-orange-200 transition-colors duration-300">Pricing</Link></li>
              <li><Link to="#support" className="hover:text-orange-200 transition-colors duration-300">Support</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-white/80">
              <li>help@walldesigner.com</li>
              <li>1-800-WALL-ART</li>
              <li>Mon-Fri 9am-6pm EST</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
          <p>&copy; 2025 MIALTAR. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
