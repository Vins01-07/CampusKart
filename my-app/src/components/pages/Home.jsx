import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./home.css";

const Home = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("userData");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [cart, setCart] = useState([]);
  const [cartMessage, setCartMessage] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (user && user.mail_id) fetchCartFromDB(user.mail_id);
  }, [user]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchCartFromDB = async (email) => {
    try {
      const res = await axios.get(`http://localhost:8081/api/cart/${email}`);
      setCart(res.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const addToCart = async (item) => {
    if (!user) {
      alert("Please log in to add items to your cart!");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8081/api/cart/add", {
        user_email: user.mail_id,
        item_id: item.id,
        item_name: item.title || item.name,
        item_price: item.price,
        item_image: item.image,
        quantity: 1,
      });

      const existingItem = cart.find((c) => c.item_id === item.id);
      const updatedCart = existingItem
        ? cart.map((c) =>
            c.item_id === item.id ? { ...c, quantity: c.quantity + 1 } : c
          )
        : [
            ...cart,
            {
              id: res.data.cartId,
              item_id: item.id,
              item_name: item.title || item.name,
              item_price: item.price,
              item_image: item.image,
              quantity: 1,
            },
          ];

      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));

      setCartMessage(`${item.title || item.name} added to your cart!`);
      setTimeout(() => setCartMessage(""), 3000);
    } catch (err) {
      console.error("Error adding to cart:", err);
      setCartMessage("Failed to add item. Try again later.");
    }
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome, {user?.full_name || "Student"} 🎓</h1>
          <p>Your one-stop shop for student essentials – books, calculators, lab coats & more!</p>
          <Link to="/books">
            <button className="btn-primary">Shop Now</button>
          </Link>
        </div>
      </section>

      <section className="section categories">
        <h2 className="section-title">Shop by Category</h2>
        <div className="grid category-grid">
          {[
            { id: 1, name: "Books", img: "https://img.icons8.com/color/96/books.png", link: "/books" },
            { id: 2, name: "Calculators", img: "https://img.icons8.com/color/96/calculator.png", link: "/calculator" },
            { id: 3, name: "Lab Coats", img: "https://i5.walmartimages.com/asr/9f19dc11-83a7-4035-a68c-a73e1791b632_1.22fec432b3f6dd1325b2c83cceea31d3.jpeg", link: "/labcoat" },
            { id: 4, name: "EG Kit", img: "https://img.icons8.com/color/96/engineering.png", link: "/EGKIT" },
          ].map((cat) => (
            <div className="card category-card" key={cat.id}>
              <img src={cat.img} alt={cat.name} />
              <h3>{cat.name}</h3>
              <Link to={cat.link} className="btn-link">
                Browse
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Recently Listed by Students</h2>
        <div className="grid product-grid">
          {products.length === 0 ? (
            <p>No products listed yet. Be the first to sell something!</p>
          ) : (
            products.map((item) => (
              <div className="card product-card" key={item.id}>
                <img src={item.image} alt={item.title || item.name} />
                <h3>{item.title || item.name}</h3>
                <p className="price">₹{Number(item.price).toFixed(2)}</p>
                <p className="condition">Condition: {item.item_condition || "N/A"}</p>
                <p className="location">📍 {item.location || "Unknown"}</p>
                <button className="btn-secondary" onClick={() => addToCart(item)}>
                  Add to Cart
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Campus Best Sellers</h2>
        <div className="grid product-grid">
          {[
            { id: 101, name: "Scientific Calculator", price: 25, img: "https://bestcalculators.net/wp-content/uploads/2018/04/Helect-H1002-1.jpg" },
            { id: 102, name: "Engineering Drawing", price: 15, img: "https://dukaan.b-cdn.net/700x700/webp/media/54ff9df0-f9ae-41a2-a125-30876fa956da.jpg" },
            { id: 103, name: "White Lab Coat", price: 30, img: "https://i5.walmartimages.com/asr/9f19dc11-83a7-4035-a68c-a73e1791b632_1.22fec432b3f6dd1325b2c83cceea31d3.jpeg" },
          ].map((item) => (
            <div className="card product-card" key={item.id}>
              <img src={item.img} alt={item.name} />
              <h3>{item.name}</h3>
              <p className="price">₹{item.price.toFixed(2)}</p>
              <button className="btn-secondary" onClick={() => addToCart(item)}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>

      {cartMessage && <div className="cart-message">{cartMessage}</div>}

      <footer className="footer">
        <p>📚 Campus Store © 2025 | All Rights Reserved</p>
        <p>Need help? <Link to="/Contact">Contact Us</Link></p>
      </footer>
    </div>
  );
};

export default Home;
