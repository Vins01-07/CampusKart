import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);  // State for toggling the menu

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);  // Toggle menu visibility
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'open' : ''}`}>
      <h2 onClick={() => navigate('/')} className="logo">
        CAMPUSKart
      </h2>
      <div className="nav-links">
        <Link to="/home">Home</Link>
        <Link to="/about">About</Link>

        {!isLoggedIn ? (
          <>
            <Link to="/login" className="login-btn">Login</Link>
            <Link to="/register" className="register-btn">Register</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/sell">Sell</Link>
          </>
        ) : (
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        )}
      </div>

      {/* Four square dots menu icon */}

    </nav>
  );
};

export default Navbar;
