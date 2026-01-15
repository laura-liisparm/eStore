import { getProductsDataByCategory } from "../api.js";

export const displayAllProductsView = async (category) => {
  const products = await getProductsDataByCategory(category);
  // Defensive check: ensure products is an array
  if (!Array.isArray(products)) products = [];

  const container = document.getElementById("products-container");
  container.innerHTML = ""; // clear existing

  if (products.length === 0) {
    container.innerHTML = "<p>No products found.</p>";
    return;
  }

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}" class="product-img" />
      <h3>${product.title}</h3>
      <p>${product.category}</p>
      <p>$${product.price.toFixed(2)}</p>
      <button class="view-detail">View</button>
    `;

    // Example: view product detail
    card.querySelector(".view-detail").onclick = () => {
      if (window.router) {
        window.router.navigate("productDetail", product);
      }
    };

    container.appendChild(card);
  });
};
