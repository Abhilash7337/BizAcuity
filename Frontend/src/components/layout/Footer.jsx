import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white py-12 border-t border-orange-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold font-poppins mb-4 text-orange-400">MIALTAR</h3>
            <p className="text-slate-300 font-inter mb-4">
              Create beautiful, professional wall layouts with ease. Your creativity, our tools.
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-slate-800/50 border border-orange-500/30 rounded-full flex items-center justify-center hover:bg-orange-500 hover:border-orange-400 transition-all duration-300 cursor-pointer">
                <span className="text-sm">f</span>
              </div>
              <div className="w-8 h-8 bg-slate-800/50 border border-orange-500/30 rounded-full flex items-center justify-center hover:bg-orange-500 hover:border-orange-400 transition-all duration-300 cursor-pointer">
                <span className="text-sm">t</span>
              </div>
              <div className="w-8 h-8 bg-slate-800/50 border border-orange-500/30 rounded-full flex items-center justify-center hover:bg-orange-500 hover:border-orange-400 transition-all duration-300 cursor-pointer">
                <span className="text-sm">in</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="#about" className="hover:text-orange-400 transition-colors duration-300">About Us</Link></li>
              <li><Link to="#features" className="hover:text-orange-400 transition-colors duration-300">Features</Link></li>
              <li><Link to="#pricing" className="hover:text-orange-400 transition-colors duration-300">Pricing</Link></li>
              <li><Link to="#support" className="hover:text-orange-400 transition-colors duration-300">Support</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contact</h4>
            <ul className="space-y-2 text-slate-400">
              <li className="hover:text-orange-400 transition-colors duration-300">help@walldesigner.com</li>
              <li className="hover:text-orange-400 transition-colors duration-300">1-800-WALL-ART</li>
              <li className="hover:text-orange-400 transition-colors duration-300">Mon-Fri 9am-6pm EST</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-orange-500/20 mt-8 pt-8 text-center text-slate-500">
          <p>&copy; 2025 <span className="text-orange-400">MIALTAR</span>. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
