import express from "express";
import mysql from "mysql2";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

// Ensure uploads folder exists
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin123",
  database: "ck",
});

db.connect((err) => {
  if (err) console.log("❌ MySQL Connection Error:", err);
  else console.log("✅ Connected to MySQL Database");
});

// ---------- TEST API ----------
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// ---------- REGISTER ----------
app.post("/api/register", (req, res) => {
  const { full_name, mail_id, pass, college_name } = req.body;
  if (!full_name || !mail_id || !pass || !college_name)
    return res.status(400).json({ message: "All fields are required" });

  const sql =
    "INSERT INTO Register (full_name, mail_id, pass, college_name) VALUES (?, ?, ?, ?)";
  db.query(sql, [full_name, mail_id, pass, college_name], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json({ message: "Registration successful", userId: result.insertId });
  });
});

// ---------- LOGIN ----------
app.post("/api/login", (req, res) => {
  const { mail_id, pass, college_name } = req.body;
  if (!mail_id || !pass || !college_name)
    return res.status(400).json({ message: "Email, password, and college are required" });

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

// ---------- CART ROUTES ----------
app.post("/api/cart/add", (req, res) => {
  const { user_email, item_id, item_name, item_price, item_image, quantity } = req.body;
  if (!user_email || !item_id || !item_name || !item_price || !item_image)
    return res.status(400).json({ message: "All fields are required" });

  const qty = quantity && Number(quantity) > 0 ? Number(quantity) : 1;

  const checkSql = "SELECT * FROM cart WHERE user_email = ? AND item_id = ?";
  db.query(checkSql, [user_email, item_id], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    if (results.length > 0) {
      const updateSql =
        "UPDATE cart SET quantity = quantity + ? WHERE user_email = ? AND item_id = ?";
      db.query(updateSql, [qty, user_email, item_id], (err) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
        res.json({ message: "Item quantity updated successfully" });
      });
    } else {
      const insertSql =
        "INSERT INTO cart (user_email, item_id, item_name, item_price, item_image, quantity) VALUES (?, ?, ?, ?, ?, ?)";
      db.query(insertSql, [user_email, item_id, item_name, item_price, item_image, qty], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
        res.json({ message: "Item added to cart successfully", cartId: result.insertId });
      });
    }
  });
});

app.get("/api/cart/:user_email", (req, res) => {
  const { user_email } = req.params;
  const sql = "SELECT * FROM cart WHERE user_email = ?";
  db.query(sql, [user_email], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    // ✅ Convert image paths to full URLs if needed
    const updatedResults = results.map((item) => {
      if (item.item_image && item.item_image.startsWith("/uploads")) {
        item.item_image = `http://localhost:8081${item.item_image}`;
      }
      return item;
    });

    res.json(updatedResults);
  });
});

app.delete("/api/cart/delete/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM cart WHERE id = ?";
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json({ message: "Item removed from cart successfully" });
  });
});

app.delete("/api/cart/clear/:user_email", (req, res) => {
  const { user_email } = req.params;
  const sql = "DELETE FROM cart WHERE user_email = ?";
  db.query(sql, [user_email], (err) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json({ message: "Cart cleared successfully" });
  });
});

// ---------- SELL PRODUCT ----------
app.post("/api/sell/add", upload.single("image"), (req, res) => {
  const { title, category, description, price, condition, location, contactInfo } = req.body;

  if (!title || !category || !description || !price || !req.file)
    return res.status(400).json({ message: "All required fields must be provided" });

  const imagePath = `/uploads/${req.file.filename}`;

  const sql = `
    INSERT INTO products
    (title, category, description, price, item_condition, location, contact_info, image_path)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [title, category, description, price, condition, location, contactInfo, imagePath], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json({ message: "Product added successfully", image_path: `http://localhost:8081${imagePath}`, productId: result.insertId });
  });
});

// ---------- GET PRODUCTS ----------
app.get("/api/products", (req, res) => {
  const { category } = req.query;
  const sql = category
    ? "SELECT * FROM products WHERE category = ? ORDER BY created_at DESC"
    : "SELECT * FROM products ORDER BY created_at DESC";

  db.query(sql, category ? [category] : [], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    // ✅ Convert image paths to full URLs
    const updatedResults = results.map((item) => {
      if (item.image_path && item.image_path.startsWith("/uploads")) {
        item.image = `http://localhost:8081${item.image_path}`;
      } else {
        item.image = item.image_path; // fallback if already a URL or base64
      }
      return item;
    });

    res.json(updatedResults);
  });
});

// ---------- 404 ----------
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ---------- START SERVER ----------
app.listen(8081, () => {
  console.log("🚀 Server running on port 8081");
});
