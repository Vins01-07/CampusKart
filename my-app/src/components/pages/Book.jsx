import React, { useState, useEffect } from "react";
import "./book.css";

const Book = () => {
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
   alert(`${item.name} has been added to your cart!`);
  };

  // Remove item from cart
  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Books Data (New and Old)
  const newBooks = [
    { id: 1, name: "Data Structures & Algorithms", img: "https://m.media-amazon.com/images/I/41fqKVuMHLL._SY445_SX342_.jpg", price: "$40" },
    { id: 2, name: "Artificial Intelligence Basics", img: "https://m.media-amazon.com/images/I/71g2ednj0JL._AC_UF1000,1000_QL80_.jpg", price: "$35" },
    { id: 3, name: "Cloud Computing Concepts", img: "https://d3i3lzopayriz.cloudfront.net/v3/book-files/9788119232895/front_img_cover.jpg", price: "$50" },
    { id: 4, name: "Machine Learning with Python", img: "https://m.media-amazon.com/images/I/81wgcld4wxL._AC_UF1000,1000_QL80_.jpg", price: "$45" },
    { id: 5, name: "Operating System Concepts", img: "https://m.media-amazon.com/images/I/71aFt4+OTOL._AC_UF1000,1000_QL80_.jpg", price: "$55" },
    { id: 6, name: "Computer Networks Security", img: "https://m.media-amazon.com/images/I/71KilybDOoL._AC_UF1000,1000_QL80_.jpg", price: "$48" },
    { id: 7, name: "Database System Concepts", img: "https://www.cengage.com/covers/imageServlet?image_type=LRGFC&catalog=cengage&epi=14494545953044442581643757572249316733", price: "$52" },
    { id: 8, name: "Web Development with React", img: "https://bpbonline.com/cdn/shop/products/9789389423594_800x.jpg?v=1672308883", price: "$38" },
    { id: 9, name: "CyberSecurity Essentials Risks", img: "https://he.kendallhunt.com/sites/default/files/product_images_original/Belshaw_Website.jpg", price: "$42" },
  ];

  const oldBooks = [
    { id: 10, name: "Old Engineering Mechanics", img: "https://m.media-amazon.com/images/I/71xLmdLOQ0L._AC_UF1000,1000_QL80_.jpg", price: "$15" },
    { id: 11, name: "Old Thermodynamics", img: "https://m.media-amazon.com/images/I/81QpkIctqPL._AC_UF1000,1000_QL80_.jpg", price: "$10" },
    { id: 12, name: "Old Circuit Theory", img: "https://m.media-amazon.com/images/I/71r5pZrNNFL._AC_UF1000,1000_QL80_.jpg", price: "$12" },
    { id: 13, name: "Old Strength of Materials", img: "https://m.media-amazon.com/images/I/71aGRwZ9lYL._AC_UF1000,1000_QL80_.jpg", price: "$8" },
    { id: 14, name: "Old Fluid Mechanics", img: "https://m.media-amazon.com/images/I/71B2oxLJ7HL._AC_UF1000,1000_QL80_.jpg", price: "$9" },
    { id: 15, name: "Old Signals & Systems", img: "https://m.media-amazon.com/images/I/81vpsIs58WL._AC_UF1000,1000_QL80_.jpg", price: "$11" },
    { id: 16, name: "Old Microprocessors", img: "https://m.media-amazon.com/images/I/71m8k7i-QQL._AC_UF1000,1000_QL80_.jpg", price: "$14" },
    { id: 17, name: "Old Digital Logic Design", img: "https://m.media-amazon.com/images/I/71N4oeWwYlL._AC_UF1000,1000_QL80_.jpg", price: "$13" },
    { id: 18, name: "Old Control Systems", img: "https://m.media-amazon.com/images/I/71KzC4+fCjL._AC_UF1000,1000_QL80_.jpg", price: "$12" },
  ];

  const displayedBooks = activeTab === "new" ? newBooks : oldBooks;

  return (
    <div className="books-page">
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
          📚 New Books
        </button>
        <button
          className={`tab-btn ${activeTab === "old" ? "active" : ""}`}
          onClick={() => setActiveTab("old")}
        >
          📖 Old Books
        </button>
      </div>

      {/* Books Grid */}
      <div className="book-container">
        {displayedBooks.map((book) => (
          <div className="book-card" key={book.id}>
            <img src={book.img} alt={book.name} className="book-image" />
            <h3>{book.name}</h3>
            <p className="price">${parseFloat(book.price.replace("$", "")).toFixed(2)}</p>
            <button
              className="add-btn"
              onClick={() => addToCart(book)} // Add book to cart
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

export default Book;
