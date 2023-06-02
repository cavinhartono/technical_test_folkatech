const express = require("express");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "folkatech",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

const secretKey = "46958fe7-54a9-44a1-bc38-103aa35baeb1";

app.post("/register", (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username)
    return res.status(400).json({ error: "Email dan password harus diisi" });

  db.query("SELECT * FROM users WHERE email = ?", [email], (error, results) => {
    if (error) {
      console.error("Error executing MySQL query:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (results.length > 0)
      return res.status(400).json({ error: "Email sudah tersedia!" });

    const hashedPassword = bcrypt.hashSync(password, 10);

    db.query(
      "INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
      [email, hashedPassword, username],
      (error) => {
        if (error) {
          console.error("Error executing MySQL query:", error);
          return res.status(500).json({ error: "Internal server error" });
        }
        return res
          .status(201)
          .json({ message: "User registered successfully" });
      }
    );
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (error, results) => {
    if (error) {
      console.error("Error executing MySQL query:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length === 0)
      return res.status(401).json({ error: "Invalid credentials" });

    const user = results[0];

    if (!bcrypt.compareSync(password, user.password))
      return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, email: user.email }, secretKey);
    return res.status(200).json({ message: "Sukses", token });
  });
});

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    req.userId = decoded.id;
    next();
  });
};

app.get("/products", verifyToken, (req, res) => {
  db.query("SELECT * FROM products", (error, results) => {
    if (error) {
      console.error("Error executing MySQL query:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.status(200).json(results);
  });
});

app.get("/products/:id", verifyToken, (req, res) => {
  const productId = req.params.id;
  db.query(
    "SELECT * FROM products WHERE id = ?",
    [productId],
    (error, results) => {
      if (error) {
        console.error("Error executing MySQL query:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
      return res.status(200).json(results[0]);
    }
  );
});

app.listen(3000, () => console.log("Server running on port 3000"));
