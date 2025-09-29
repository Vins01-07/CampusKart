import React, { useState, useEffect } from "react";
import "./drafter.css"; // Create a separate CSS file for styling

const Drafter = () => {
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

  // Drafter Data (New and Used)
  const newDrafters = [
    { id: 1, name: "Professional Drafting Table", img: "https://example.com/professional-drafter.jpg", price: "$200" },
    { id: 2, name: "Adjustable Drafting Table", img: "https://example.com/adjustable-drafter.jpg", price: "$150" },
    { id: 3, name: "Aluminum Drafting Table", img: "https://example.com/aluminum-drafter.jpg", price: "$180" },
    { id: 4, name: "Digital Drafting Machine", img: "https://example.com/digital-drafter.jpg", price: "$350" },
    { id: 5, name: "Portable Drafting Kit", img: "https://example.com/portable-drafter.jpg", price: "$120" },
    { id: 6, name: "Architect Drafting Kit", img: "https://example.com/architect-drafter.jpg", price: "$250" },
    { id: 7, name: "Wooden Drafting Table", img: "https://example.com/wooden-drafter.jpg", price: "$220" },
    { id: 8, name: "Ergonomic Drafting Chair", img: "https://example.com/ergonomic-chair.jpg", price: "$160" },
    { id: 9, name: "Heavy Duty Drafting Table", img: "https://example.com/heavy-duty-drafter.jpg", price: "$280" },
  ];

  const usedDrafters = [
    { id: 10, name: "Used Drafting Table", img: "https://example.com/used-drafter.jpg", price: "$100" },
    { id: 11, name: "Second-hand Drafting Table", img: "https://example.com/secondhand-drafter.jpg", price: "$75" },
    { id: 12, name: "Used Architect Drafting Kit", img: "https://example.com/used-architect-drafter.jpg", price: "$130" },
    { id: 13, name: "Vintage Drafting Table", img: "https://example.com/vintage-drafter.jpg", price: "$80" },
    { id: 14, name: "Old Wooden Drafting Table", img: "https://example.com/old-wooden-drafter.jpg", price: "$90" },
    { id: 15, name: "Pre-loved Drafting Chair", img: "https://example.com/preloved-chair.jpg", price: "$50" },
    { id: 16, name: "Second-hand Aluminum Drafting Table", img: "https://example.com/secondhand-aluminum-drafter.jpg", price: "$110" },
  ];

  // Determine which products to display based on active tab
  const displayedItems = activeTab === "new" ? newDrafters : usedDrafters;

  return (
    <div className="drafter-page">
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
          🖊️ New Drafters
        </button>
        <button
          className={`tab-btn ${activeTab === "old" ? "active" : ""}`}
          onClick={() => setActiveTab("old")}
        >
          🖊️ Used Drafters
        </button>
      </div>

      {/* Drafters Grid */}
      <div className="drafter-container">
        {displayedItems.map((item) => (
          <div className="drafter-card" key={item.id}>
            <img src={item.img} alt={item.name} className="drafter-image" />
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

export default Drafter;
