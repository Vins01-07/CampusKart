import React, { useState, useEffect } from "react";
import "./calculator.css"; // Create a separate CSS file for styling

const Calculator = () => {
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

  // Calculators Data (New and Used)
  const newCalculators = [
    { id: 1, name: "Scientific Calculator", img: "https://example.com/scientific-calculator.jpg", price: "$20" },
    { id: 2, name: "Graphing Calculator", img: "https://example.com/graphing-calculator.jpg", price: "$40" },
    { id: 3, name: "Scientific Solar Calculator", img: "https://example.com/scientific-solar-calculator.jpg", price: "$25" },
    { id: 4, name: "Casio FX-82", img: "https://example.com/casio-fx82.jpg", price: "$30" },
    { id: 5, name: "Sharp EL-W516X", img: "https://example.com/sharp-calculator.jpg", price: "$45" },
  ];

  const usedCalculators = [
    { id: 6, name: "Used Scientific Calculator", img: "https://example.com/used-scientific-calculator.jpg", price: "$12" },
    { id: 7, name: "Old Graphing Calculator", img: "https://example.com/old-graphing-calculator.jpg", price: "$15" },
    { id: 8, name: "Vintage Scientific Calculator", img: "https://example.com/vintage-scientific-calculator.jpg", price: "$10" },
  ];

  // Determine which products to display based on active tab
  const displayedItems = activeTab === "new" ? newCalculators : usedCalculators;

  return (
    <div className="calculator-page">
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
          🧮 New Calculators
        </button>
        <button
          className={`tab-btn ${activeTab === "old" ? "active" : ""}`}
          onClick={() => setActiveTab("old")}
        >
          🧮 Used Calculators
        </button>
      </div>

      {/* Calculators Grid */}
      <div className="calculator-container">
        {displayedItems.map((item) => (
          <div className="calculator-card" key={item.id}>
            <img src={item.img} alt={item.name} className="calculator-image" />
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

export default Calculator;
