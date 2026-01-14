const express = require("express");
const fs = require("fs/promises");
const axios = require("axios");
const path = require("path");

const app = express();

const filePath = path.join(__dirname, "data", "products.json");
const favoritesFilePath = path.join(__dirname, "data", "favorites.json");

app.use(express.static("project"));

const fetchAndSaveProducts = async () => {
  const response = await axios.get("https://fakestoreapi.com/products");
  const products = response.data;
  await fs.writeFile(filePath, JSON.stringify(products, null, 2));
};

const isFileEmpty = async (filePath) => {
  try {
    const rawData = await fs.readFile(filePath, "utf-8");
    return !rawData.trim();
  } catch (error) {
    console.error("Viga faili lugemisel", error);
    return true;
  }
};

app.get("/api/products", async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

    const emptyFile = await isFileEmpty(filePath);

    if (emptyFile) {
      console.log("Fail on tühi. Laadin andmed FakeStore API-st...");
      await fetchAndSaveProducts();
    }

    const rawData = await fs.readFile(filePath, "utf-8");
    const products = JSON.parse(rawData);

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Andmete lugemine ebaõnnestus" });
  }
});

app.get("/api/products/category/:category", async (req, res) => {
  try {
    const rawData = await fs.readFile(filePath, "utf-8");
    const products = JSON.parse(rawData);

    const categoryProducts = products.filter(
      (item) => item.category === req.params.category
    );

    res.status(200).json(categoryProducts);
  } catch (error) {
    res.status(500).json({ error: "Andmete lugemine ebaõnnestus" });
  }
});

app.get("/api/products/categories", async (req, res) => {
  try {
    const data = JSON.parse(await fs.readFile(filePath, "utf-8"));
    const categories = [...new Set(data.map((item) => item.category))];
    res.status(200).json(categories);
  } catch (error) {
    res.status(404).json({ message: "Andmete lugemine ebaõnnestus" });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const data = JSON.parse(await fs.readFile(filePath, "utf-8"));
    const product = data.find((p) => p.id === Number(req.params.id));

    if (!product) {
      return res.status(404).json({ message: "Toodet ei leitud" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: "Andmete lugemine ebaõnnestus" });
  }
});

app.get("/api/favorites/:userID", async (req, res) => {
  try {
    const favoritesData = JSON.parse(
      await fs.readFile(favoritesFilePath, "utf-8")
    );

    const favoritesIds = favoritesData[req.params.userID] || [];
    const products = JSON.parse(await fs.readFile(filePath, "utf-8")).filter(
      (product) => favoritesIds.includes(product.id)
    );

    res.status(200).json(products);
  } catch (error) {
    res.status(404).json({ message: "Andmete lugemine ebaõnnestus" });
  }
});

app.post("/api/favorites/:userID/:productId", async (req, res) => {
  try {
    let favoritesData = {};

    if (!(await isFileEmpty(favoritesFilePath))) {
      favoritesData = JSON.parse(await fs.readFile(favoritesFilePath, "utf-8"));
    }

    const userID = req.params.userID;
    const productId = Number(req.params.productId);

    const favorites = favoritesData[userID] || [];
    favoritesData[userID] = [...new Set([...favorites, productId])];

    await fs.writeFile(
      favoritesFilePath,
      JSON.stringify(favoritesData, null, 2)
    );

    res.status(200).json(favoritesData[userID]);
  } catch (error) {
    res
      .status(404)
      .json({ message: "Andmete kirjutamine lemmikutesse ebaõnnestus" });
  }
});

app.delete("/api/favorites/:userID/:productId", async (req, res) => {
  try {
    const favoritesData = JSON.parse(
      await fs.readFile(favoritesFilePath, "utf-8")
    );

    const userID = req.params.userID;
    const productId = Number(req.params.productId);

    favoritesData[userID] = (favoritesData[userID] || []).filter(
      (id) => id !== productId
    );

    await fs.writeFile(
      favoritesFilePath,
      JSON.stringify(favoritesData, null, 2)
    );

    res.status(200).json(favoritesData[userID]);
  } catch (error) {
    res.status(404).json({ message: "Andmete kirjutamine ebaõnnestus" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "vaated-dom", "project", "index.html"));
});

app.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});
