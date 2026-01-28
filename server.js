const express = require("express");
const fs = require("fs/promises");
const fsSync = require("fs");
const axios = require("axios");
const path = require("path");

const app = express();

const filePath = path.join(__dirname, "data", "products.json");
const favoritesFilePath = path.join(__dirname, "data", "favorites.json");

// Serve static frontend
app.use(express.static(path.join(__dirname, "project")));

// --- Fetch products from FakeStoreAPI if products.json is empty ---
const fetchAndSaveProducts = async () => {
  try {
    const response = await axios.get("https://fakestoreapi.com/products");
    const products = response.data;
    await fs.writeFile(filePath, JSON.stringify(products, null, 2));
    console.log("Products loaded from FakeStoreAPI");
  } catch (error) {
    console.error("Failed to fetch products from FakeStoreAPI:", error);
  }
};

const initProducts = async () => {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    if (!raw.trim() || JSON.parse(raw).length === 0) {
      await fetchAndSaveProducts();
    }
  } catch (err) {
    console.error("Failed to read products.json:", err);
    await fetchAndSaveProducts();
  }
};
initProducts();

// --- API ROUTES ---

// Get all products (optionally by category)
app.get("/api/products", async (req, res) => {
  try {
    const rawData = await fs.readFile(filePath, "utf-8");
    const products = JSON.parse(rawData || "[]");

    const category = req.query.category;
    const result = category
      ? products.filter((p) => p.category === category)
      : products;

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read products" });
  }
});

// Get categories
app.get("/api/products/categories", async (req, res) => {
  try {
    const rawData = await fs.readFile(filePath, "utf-8");
    const products = JSON.parse(rawData || "[]");
    const categories = [...new Set(products.map((p) => p.category))];
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read categories" });
  }
});

// Get product by ID
app.get("/api/products/:id", async (req, res) => {
  try {
    const products = JSON.parse(await fs.readFile(filePath, "utf-8"));
    const product = products.find((p) => p.id === Number(req.params.id));
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read product" });
  }
});

// --- Favorites API ---

// Get favorites for a user
app.get("/api/favorites/:userID", async (req, res) => {
  try {
    const favoritesData = JSON.parse(
      await fs.readFile(favoritesFilePath, "utf-8"),
    );
    const favoriteIds = favoritesData[req.params.userID] || [];
    const products = JSON.parse(await fs.readFile(filePath, "utf-8"));
    const favorites = products.filter((p) => favoriteIds.includes(p.id));
    res.json(favorites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read favorites" });
  }
});

// Add favorite
app.post("/api/favorites/:userID/:productId", async (req, res) => {
  try {
    const favoritesData = JSON.parse(
      await fs.readFile(favoritesFilePath, "utf-8"),
    );
    const { userID, productId } = req.params;
    const pid = Number(productId);
    favoritesData[userID] = [
      ...new Set([...(favoritesData[userID] || []), pid]),
    ];
    await fs.writeFile(
      favoritesFilePath,
      JSON.stringify(favoritesData, null, 2),
    );
    res.json(favoritesData[userID]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add favorite" });
  }
});

// Delete favorite
app.delete("/api/favorites/:userID/:productId", async (req, res) => {
  try {
    const favoritesData = JSON.parse(
      await fs.readFile(favoritesFilePath, "utf-8"),
    );
    const { userID, productId } = req.params;
    const pid = Number(productId);
    favoritesData[userID] = (favoritesData[userID] || []).filter(
      (id) => id !== pid,
    );
    await fs.writeFile(
      favoritesFilePath,
      JSON.stringify(favoritesData, null, 2),
    );
    res.json(favoritesData[userID]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete favorite" });
  }
});

// Serve frontend
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "project", "index.html"));
});

app.listen(8000, () => {
  console.log("Server running on http://localhost:8000");
});
