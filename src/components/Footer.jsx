// src/components/Footer.jsx
import React from "react";

function Footer() {
  return (
    <footer className="w-full mt-16 py-6 bg-[#181e20] border-t border-[#22282c] text-gray-400 text-sm">
      <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-2 md:mb-0">
          © {new Date().getFullYear()} <span className="font-bold text-green-400">Nyvorr</span>. All rights reserved.
        </div>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-green-400">Home</a>
          <a href="#" className="hover:text-green-400">Products</a>
          <a href="#" className="hover:text-green-400">Contact</a>
        </div>
        <div className="mt-2 md:mt-0">
          <span>Powered by <a href="https://vitejs.dev/" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">Vite + React</a></span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
