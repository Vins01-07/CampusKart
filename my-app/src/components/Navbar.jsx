import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); 
  const [user, setUser] = useState(null);

  // Check if user is logged in initially
  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Listen for login events to update navbar immediately
  useEffect(() => {
    const handleLoginEvent = () => {
      const storedUser = localStorage.getItem('userData');
      if (storedUser) setUser(JSON.parse(storedUser));
    };

    window.addEventListener('login', handleLoginEvent);
    return () => window.removeEventListener('login', handleLoginEvent);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('cart');
    setUser(null);
    navigate('/login');
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'open' : ''}`}>
      <h2 onClick={() => navigate('/')} className="logo">CAMPUSKart</h2>

      <div className="nav-links">
        {/* Only show restricted links if user is logged in */}
        {user ? (
          <>
            <Link to="/home">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/sell">Sell</Link>
          </>
        ) : null}

        {/* Show Login/Register if not logged in */}
        {!user ? (
          <>
            <Link to="/login" className="login-btn">Login</Link>
            <Link to="/register" className="register-btn">Register</Link>
          </>
        ) : (
          <>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
