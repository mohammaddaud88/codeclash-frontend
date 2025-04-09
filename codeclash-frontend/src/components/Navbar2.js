import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './navbar.css';

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    // Clear user authentication (e.g., remove token)
    setIsAuthenticated(false);
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login'); // Redirect to login page
  };

  return (
    <div>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'nav-scrolled' : ''} ${isOpen ? 'nav-open' : ''}`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-purple-400 flex items-center">
              <span className="mr-2">⚡</span> CodeClash
            </h1>

            {/* Hamburger Menu */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden focus:outline-none transition-transform duration-300 transform hover:scale-110"
            >
              <div className={`hamburger ${isOpen ? 'open' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>

            {/* Navigation Links */}
            <div className={`lg:flex items-center space-x-1 ${isOpen ? 'mobile-menu-open' : 'mobile-menu-closed'}`}>
              <Link to="/" className="nav-link">Challenge</Link>
              <Link to="/" className="nav-link">Leaderboard</Link>
              <Link to="/joinroom" className="nav-button bg-purple-500 hover:bg-purple-600">
                Join Room
              </Link>
              <Link to="/profile" className="nav-button bg-purple-500 hover:bg-purple-600">
                Profile
              </Link>
              <Link to="/createroom" className="nav-button bg-purple-600 hover:bg-purple-700">
                Create Room
              </Link>

              {isAuthenticated ? (
                <button 
                  onClick={handleLogout} 
                  className="nav-button bg-red-500 hover:bg-red-600">
                  Logout
                </button>
              ) : (
                <Link to="/register" className="nav-button bg-purple-500 hover:bg-purple-600">
                  Register
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div className="h-20"></div>
    </div>
  );
}

export default Navbar;