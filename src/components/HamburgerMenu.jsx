import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    // Add event listener when menu is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <div className="md:hidden relative" ref={menuRef}>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white focus:outline-none"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          )}
        </svg>
      </button>


      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-[#1e272e] rounded-lg shadow-xl py-1 z-50 border border-[#2d3748]">
          <div className="px-4 py-2 border-b border-[#2d3748]">
            {user ? (
              <div className="text-sm text-gray-300">
                <p className="font-medium">{user.username || user.email}</p>
                {user.isAdmin && (
                  <span className="text-xs text-yellow-400">Admin</span>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Welcome, Guest</p>
            )}
          </div>

          <div className="py-1">
            <Link
              to="/"
              className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#2d3748] hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/order-history"
              className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#2d3748] hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              My Orders
            </Link>
            {user?.isAdmin && (
              <Link
                to="/admin"
                className="block px-4 py-2 text-sm text-yellow-400 hover:bg-[#2d3748] hover:text-yellow-300"
                onClick={() => setIsOpen(false)}
              >
                Admin Panel
              </Link>
            )}
          </div>

          <div className="py-1 border-t border-[#2d3748]">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#2d3748] hover:text-red-300"
              >
                Sign out
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#2d3748] hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="block px-4 py-2 text-sm text-green-400 hover:bg-[#2d3748] hover:text-green-300"
                  onClick={() => setIsOpen(false)}
                >
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
