const express = require("express");
const mysql = require("mysql2");
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

app.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (error, results) => {
      if (error) {
        console.error("Error executing MySQL query:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
      if (results.length > 0) {
        return res.status(400).json({ error: "Username already exists" });
      }

      db.query(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, password],
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
    }
  );
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.query(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (error, results) => {
      if (error) {
        console.error("Error executing MySQL query:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      return res.status(200).json({ message: "Login successful" });
    }
  );
});

app.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (error, results) => {
    if (error) {
      console.error("Error executing MySQL query:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.status(200).json(results);
  });
});

app.get("/products/:id", (req, res) => {
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

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
