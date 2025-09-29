import React, { useState, useEffect } from "react";
import "./labcoat.css"; // Create a separate CSS file for styling

const LabCoat = () => {
  const [activeTab, setActiveTab] = useState("new");
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [cartMessage, setCartMessage] = useState('');  // Feedback message when an item is added

  // Handle cart count
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Add to cart functionality
  const addToCart = (item) => {
    const existingProduct = cart.find((cartItem) => cartItem.id === item.id);
    let updatedCart;

    // Convert price to a number (remove '$' and convert to float)
    const price = parseFloat(item.price.replace("$", ""));

    if (existingProduct) {
      updatedCart = cart.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    } else {
      updatedCart = [...cart, { ...item, price, quantity: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartMessage(`${item.name} has been added to your cart!`);
    setTimeout(() => setCartMessage(''), 3000);  // Clear message after 3 seconds
  };

  // Remove item from cart
  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // LabCoats Data (New and Used)
  const newLabCoats = [
    { id: 1, name: "New White Lab Coat", img: "https://example.com/new-lab-coat.jpg", price: "$25" },
    { id: 2, name: "Premium Lab Coat", img: "https://example.com/premium-lab-coat.jpg", price: "$35" },
    { id: 3, name: "Basic Lab Coat", img: "https://example.com/basic-lab-coat.jpg", price: "$20" },
    { id: 4, name: "Stylish Lab Coat", img: "https://example.com/stylish-lab-coat.jpg", price: "$40" },
    { id: 5, name: "Medical Grade Lab Coat", img: "https://example.com/medical-grade-lab-coat.jpg", price: "$45" },
    { id: 6, name: "Eco-Friendly Lab Coat", img: "https://example.com/eco-friendly-lab-coat.jpg", price: "$50" },
    { id: 7, name: "Waterproof Lab Coat", img: "https://example.com/waterproof-lab-coat.jpg", price: "$55" },
    { id: 8, name: "Anti-Static Lab Coat", img: "https://example.com/anti-static-lab-coat.jpg", price: "$60" },
  ];

  const usedLabCoats = [
    { id: 9, name: "Pre-Loved Lab Coat", img: "https://example.com/used-lab-coat.jpg", price: "$15" },
    { id: 10, name: "Old Lab Coat", img: "https://example.com/old-lab-coat.jpg", price: "$10" },
    { id: 11, name: "Used Medical Lab Coat", img: "https://example.com/used-medical-lab-coat.jpg", price: "$12" },
    { id: 12, name: "Vintage Lab Coat", img: "https://example.com/vintage-lab-coat.jpg", price: "$8" },
    { id: 13, name: "Worn Lab Coat", img: "https://example.com/worn-lab-coat.jpg", price: "$6" },
    { id: 14, name: "Stained Lab Coat", img: "https://example.com/stained-lab-coat.jpg", price: "$5" },
    { id: 15, name: "Discolored Lab Coat", img: "https://example.com/discolored-lab-coat.jpg", price: "$7" },
    { id: 16, name: "Old Fashioned Lab Coat", img: "https://example.com/old-fashioned-lab-coat.jpg", price: "$9" },
  ];

  const displayedItems = activeTab === "new" ? newLabCoats : usedLabCoats;

  return (
    <div className="labcoat-page">
      {/* Cart Icon and Count */}
      <div className="cart-icon">
        <span className="cart-count">{cartCount}</span>
        <img src="cart-icon.png" alt="Cart" />
      </div>

      {/* Tab Buttons */}
      <div className="button-group">
        <button
          className={`tab-btn ${activeTab === "new" ? "active" : ""}`}
          onClick={() => setActiveTab("new")}
        >
          🧑‍🔬 New Lab Coats
        </button>
        <button
          className={`tab-btn ${activeTab === "old" ? "active" : ""}`}
          onClick={() => setActiveTab("old")}
        >
          🧑‍🔬 Used Lab Coats
        </button>
      </div>

      {/* Lab Coats Grid */}
      <div className="labcoat-container">
        {displayedItems.map((item) => (
          <div className="labcoat-card" key={item.id}>
            <img src={item.img} alt={item.name} className="labcoat-image" />
            <h3>{item.name}</h3>
            <p className="price">${parseFloat(item.price.replace("$", "")).toFixed(2)}</p>
            <button
              className="add-btn"
              onClick={() => addToCart(item)} // Add item to cart
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Cart Message */}
      {cartMessage && <div className="cart-message">{cartMessage}</div>}
    </div>
  );
};

export default LabCoat;
