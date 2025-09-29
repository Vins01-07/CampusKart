import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import About from './components/pages/About';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Contact from './components/pages/Contact';
import Sell from './components/Sell';
import Cart from './components/pages/cart';
import Home from './components/pages/Home';
import Chat from './components/Chat';
import Book from './components/pages/Book';
import Labcoat from './components/pages/Labcoat';
import Calculator from './components/pages/Calculator';
import Drafter from './components/pages/Drafter';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      {/* Main layout route using App */}
      <Route path="/" element={<App />}>
        {/* Default page when visiting root ("/") */}
        <Route index element={<Login />} />

        {/* Other pages as nested routes */}
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="sell" element={<Sell />} />
        <Route path="contact" element={<Contact />} />
        
        {/* Cart and Home pages */}
        <Route path="cart" element={<Cart />} />
        <Route path="home" element={<Home />} />

        {/* Chat section */}
        <Route path="cht-section" element={<Chat />} />
        
        {/* Product pages */}
        <Route path="books" element={<Book />} />
        <Route path="labcoat" element={<Labcoat />} />
        <Route path="calculator" element={<Calculator />} />
        <Route path="drafter" element={<Drafter />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
