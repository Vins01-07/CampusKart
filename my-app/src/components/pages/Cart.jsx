import React, { useState, useEffect } from "react";
import "./cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Sync cartItems with localStorage on initial load or cart change
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCartItems(parsedCart);
      calculateTotal(parsedCart);
    }
  }, []);

  // Function to calculate the total price
  const calculateTotal = (items) => {
    const total = items.reduce(
      (acc, item) => acc + item.price * item.quantity, 0  // Use price as a number
    );
    setTotalPrice(total);
  };

  // Remove or reduce item from cart by matching the id
  const removeItem = (id) => {
    const updatedCart = cartItems
      .map((item) => {
        if (item.id === id) {
          if (item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return null;
          }
        }
        return item;
      })
      .filter((item) => item !== null);

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.img} alt={item.name} />
              <h3>{item.name}</h3>
              <p>
                ${item.price.toFixed(2)} x {item.quantity}  {/* Display price as number */}
              </p>
              <button onClick={() => removeItem(item.id)}>Remove</button>
            </div>
          ))
        )}
      </div>
      <div className="cart-summary">
        <div id="total-price">
          Total Price: ${totalPrice.toFixed(2)}
        </div>
        <button>Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default Cart;
