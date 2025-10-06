import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';

// ✅ Main application layout component
// This wraps all routes, includes Navbar and error handling
const App = () => {
  return (
    <ErrorBoundary>
      {/* Navbar appears on every page */}
      <Navbar />

      {/* Main page content area */}
      <main
        style={{
          minHeight: '80vh',
          padding: '20px',
          backgroundColor: '#f8f9fa',
        }}
      >
        {/* Outlet loads the child routes dynamically */}
        <Outlet />
      </main>

      {/* Optional footer */}
      <footer
        style={{
          textAlign: 'center',
          padding: '15px',
          backgroundColor: '#222',
          color: 'white',
          marginTop: '20px',
        }}
      >
        <p>© {new Date().getFullYear()} CampusKart — All Rights Reserved</p>
      </footer>
    </ErrorBoundary>
  );
};

export default App;
