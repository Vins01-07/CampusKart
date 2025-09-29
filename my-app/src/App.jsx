import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';

const App = () => {
  return (
    <ErrorBoundary>
      <Navbar />
      <main style={{ minHeight: '80vh', padding: '20px' }}>
        <Outlet /> {/* This is where child routes will load */}
      </main>
    </ErrorBoundary>
  );
};

export default App;
