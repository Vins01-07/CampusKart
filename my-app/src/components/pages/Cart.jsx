import React, { useState, useEffect } from "react";
import axios from "axios";
import "./cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [user, setUser] = useState(null);

  // ✅ Get logged-in user info from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchCartFromDB(parsedUser.mail_id);
    } else {
      console.warn("⚠️ No user logged in. Redirect or handle as needed.");
    }
  }, []);

  // ✅ Fetch cart items from backend for this user
  const fetchCartFromDB = async (email) => {
    try {
      const res = await axios.get(`http://localhost:8081/api/cart/${email}`);
      setCartItems(res.data);
      calculateTotal(res.data);
    } catch (error) {
      console.error("❌ Error fetching cart:", error);
    }
  };

  // ✅ Calculate total
  const calculateTotal = (items) => {
    const total = items.reduce(
      (acc, item) => acc + Number(item.item_price) * item.quantity,
      0
    );
    setTotalPrice(total);
  };

  // ✅ Remove item from cart
  const removeItem = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/api/cart/delete/${id}`);
      const updatedCart = cartItems.filter((item) => item.id !== id);
      setCartItems(updatedCart);
      calculateTotal(updatedCart);
    } catch (err) {
      console.error("❌ Error removing item:", err);
    }
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>

      {!user ? (
        <p>Please log in to view your cart.</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <div className="cart-item" key={item.id}>
                  {item.item_image && <img src={item.item_image} alt={item.item_name} />}
                  <h3>{item.item_name}</h3>
                  <p>
                    ₹{Number(item.item_price).toFixed(2)} × {item.quantity}
                  </p>
                  <button onClick={() => removeItem(item.id)}>Remove</button>
                </div>
              ))
            )}
          </div>

          <div className="cart-summary">
            <div id="total-price">
              Total Price: ₹{totalPrice.toFixed(2)}
            </div>
            <button>Proceed to Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
