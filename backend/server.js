import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin123",
  database: "ck",
});

db.connect((err) => {
  if (err) {
    console.log("❌ MySQL Connection Error:", err);
  } else {
    console.log("✅ Connected to MySQL Database");
  }
});

// ✅ Test API
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// ✅ Register route
app.post("/api/register", (req, res) => {
  const { full_name, mail_id, pass, college_name } = req.body;

  if (!full_name || !mail_id || !pass || !college_name) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql =
    "INSERT INTO Register (full_name, mail_id, pass, college_name) VALUES (?, ?, ?, ?)";
  db.query(sql, [full_name, mail_id, pass, college_name], (err, result) => {
    if (err) {
      console.error("MySQL Insert Error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.json({ message: "Registration successful", userId: result.insertId });
  });
});

// ✅ Login route
app.post("/api/login", (req, res) => {
  const { mail_id, pass, college_name } = req.body;

  if (!mail_id || !pass || !college_name) {
    return res
      .status(400)
      .json({ message: "Email, password, and college are required" });
  }

  const sql =
    "SELECT * FROM Register WHERE mail_id = ? AND pass = ? AND college_name = ?";
  db.query(sql, [mail_id, pass, college_name], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length > 0) {
      const { pass, ...userWithoutPassword } = results[0];
      res.json({ message: "Login successful", user: userWithoutPassword });
    } else {
      res.status(401).json({ message: "Invalid credentials or college" });
    }
  });
});

// 🛒 CART ROUTES

// Add or update cart item
app.post("/api/cart/add", (req, res) => {
  const { user_email, item_id, item_name, item_price, item_image, quantity } = req.body;

  // ✅ Validate inputs
  if (!user_email || !item_id || !item_name || !item_price || !item_image) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (typeof item_id !== "number") {
    return res.status(400).json({ message: "item_id must be a number" });
  }

  const qty = quantity && Number(quantity) > 0 ? Number(quantity) : 1;

  console.log("Adding to cart:", { user_email, item_id, item_name, item_price, item_image, qty });

  const checkSql = "SELECT * FROM cart WHERE user_email = ? AND item_id = ?";
  db.query(checkSql, [user_email, item_id], (err, results) => {
    if (err) {
      console.error("DB error (check cart):", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length > 0) {
      // Update quantity if already exists
      const updateSql = "UPDATE cart SET quantity = quantity + ? WHERE user_email = ? AND item_id = ?";
      db.query(updateSql, [qty, user_email, item_id], (err) => {
        if (err) {
          console.error("DB error (update cart):", err);
          return res.status(500).json({ message: "Database error", error: err });
        }
        res.json({ message: "Item quantity updated successfully" });
      });
    } else {
      // Insert new item
      const insertSql = "INSERT INTO cart (user_email, item_id, item_name, item_price, item_image, quantity) VALUES (?, ?, ?, ?, ?, ?)";
      db.query(insertSql, [user_email, item_id, item_name, item_price, item_image, qty], (err, result) => {
        if (err) {
          console.error("DB error (insert cart):", err);
          return res.status(500).json({ message: "Database error", error: err });
        }
        res.json({
          message: "Item added to cart successfully",
          cartId: result.insertId,
        });
      });
    }
  });
});

// Get all cart items for a user
app.get("/api/cart/:user_email", (req, res) => {
  const { user_email } = req.params;

  const sql = "SELECT * FROM cart WHERE user_email = ?";
  db.query(sql, [user_email], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json(results);
  });
});

// Remove a specific item from cart
app.delete("/api/cart/delete/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM cart WHERE id = ?";
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json({ message: "Item removed from cart successfully" });
  });
});

// Clear entire cart for a user
app.delete("/api/cart/clear/:user_email", (req, res) => {
  const { user_email } = req.params;

  const sql = "DELETE FROM cart WHERE user_email = ?";
  db.query(sql, [user_email], (err) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json({ message: "Cart cleared successfully" });
  });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Start server
app.listen(8081, () => {
  console.log("🚀 Server running on port 8081");
});