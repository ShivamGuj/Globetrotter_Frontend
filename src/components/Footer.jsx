import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h3 className="text-xl font-bold mb-2">Globetrotter</h3>
            <p className="text-gray-300 text-sm">Test your knowledge of destinations around the world</p>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} Globetrotter. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
