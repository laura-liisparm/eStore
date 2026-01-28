const express = require("express");
const fs = require("fs/promises");
const fsSync = require("fs");
const axios = require("axios");
const path = require("path");

const app = express();

const productsJsonFilePath = path.join(__dirname, "data", "products.json");
const favoritesJsonFilePath = path.join(__dirname, "data", "favorites.json");

// Serve static frontend
app.use(express.static(path.join(__dirname, "project")));

// --- Fetch products from FakeStoreAPI if products.json is empty ---
const fetchAndSaveProducts = async () => {
  try {
    const response = await axios.get("https://fakestoreapi.com/products");
    const products = response.data;
    await fs.writeFile(productsJsonFilePath, JSON.stringify(products, null, 2));
    console.log("Products loaded from FakeStoreAPI");
  } catch (error) {
    console.error("Failed to fetch products from FakeStoreAPI:", error);
  }
};

const initProducts = async () => {
  try {
    const raw = await fs.readFile(productsJsonFilePath, "utf-8");
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
  console.log("GET products");
  try {
    const rawData = await fs.readFile(productsJsonFilePath, "utf-8");
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
    const rawData = await fs.readFile(productsJsonFilePath, "utf-8");
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
    const products = JSON.parse(await fs.readFile(productsJsonFilePath, "utf-8"));
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
  console.log("GET favorites");
  try {
    const allFavoritesJson = JSON.parse(
      await fs.readFile(favoritesJsonFilePath, "utf-8"),
    );
    let userID = req.params.userID;
    console.log(`Fetching favorites for userId = ${userID}`);
    const userFavoriteProductIds = Array.from(allFavoritesJson[userID] || []);
    console.log(`Users favorite product Ids: ${JSON.stringify(userFavoriteProductIds)}`)
    const products = Array.from(JSON.parse(await fs.readFile(productsJsonFilePath, "utf-8")));
    const favoriteProductsForUser = products.filter((product) => {
      productId = product["id"]
      let isInFavorites = userFavoriteProductIds.includes(productId.toString());
      if (isInFavorites) {
        console.log(`Found favorite product with ID: ${product["id"]} `);
      }
      return isInFavorites

    });
    res.json(favoriteProductsForUser);
    console.log(`Responding with: ${JSON.stringify(favoriteProductsForUser)}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read favorites" });
  }
});

// Add favorite
app.post("/api/favorites/:userID/:productId", async (req, res) => {
  console.log("POST favorite");
  try {
    const allFavoritesJson = JSON.parse(
      await fs.readFile(favoritesJsonFilePath, "utf-8"),
    );

    const { userID, productId } = req.params;
    console.log(`userId= ${userID} productId=${productId}`);
    console.log(`All favorites in favorites.json : ${JSON.stringify(allFavoritesJson)}`);

    const productIds = Array.from(allFavoritesJson[userID] || []);
    console.log(`Favorite product IDs for userId=${userID}  productIds=${JSON.stringify(productIds)}`);
    if (!productIds.includes(productId)) {
      productIds.push(productId);
    }
    allFavoritesJson[userID] = productIds;

    console.log(`Writing favorites back to favorites.json file. All favorites: ${JSON.stringify(allFavoritesJson)}`);
    await fs.writeFile(
      favoritesJsonFilePath,
      JSON.stringify(allFavoritesJson, null, 2),
    );
    res.json(productIds);
    console.log(`Responding with: ${JSON.stringify(productIds)}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add favorite" });
  }
});

// Delete favorite
app.delete("/api/favorites/:userID/:productId", async (req, res) => {
  console.log("DELETE favorite")
  try {
    const allFavoritesJson = JSON.parse(
      await fs.readFile(favoritesJsonFilePath, "utf-8"),
    );
    const { userID, productId } = req.params;
    const productIds = Array.from(allFavoritesJson[userID] || []);
    const elementIndexInArray = productIds.indexOf(productId)
    if (elementIndexInArray > -1) {
      productIds.splice(elementIndexInArray, 1)
    }
    allFavoritesJson[userID] = productIds
    console.log(`after deleting favorite: ${JSON.stringify(allFavoritesJson)}`)
    await fs.writeFile(
      favoritesJsonFilePath,
      JSON.stringify(allFavoritesJson, null, 2),
    );
    res.json(allFavoritesJson[userID]);
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
