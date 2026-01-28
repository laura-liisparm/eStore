import { cartConstructor } from "../constructors/cart.js";
import { customerConstructor } from "../constructors/customer.js";
import { getProductsDataByCategory } from "../api.js";

export const displayAllProductsView = async (category) => {
  await customerConstructor.getAllFavorites();

  const products = await getProductsDataByCategory(category);

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
    <p class="price">€${product.price.toFixed(2)}</p>
    <div class="actions">

      <button class="add-to-cart">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 40 40" fill="none">
          <path d="M17 30C17.5523 30 18 29.5523 18 29C18 28.4477 17.5523 28 17 28C16.4477 28 16 28.4477 16 29C16 29.5523 16.4477 30 17 30Z" stroke="#0A0A0A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M28 30C28.5523 30 29 29.5523 29 29C29 28.4477 28.5523 28 28 28C27.4477 28 27 28.4477 27 29C27 29.5523 27.4477 30 28 30Z" stroke="#0A0A0A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M9 9H13L15.68 22.39C15.7714 22.8504 16.0219 23.264 16.3875 23.5583C16.7532 23.8526 17.2107 24.009 17.68 24H27.4C27.8693 24.009 28.3268 23.8526 28.6925 23.5583C29.0581 23.264 29.3086 22.8504 29.4 22.39L31 14H14" stroke="#0A0A0A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <button class="favorite">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 40 40" fill="none">
          <path d="M28.84 12.61C28.3292 12.099 27.7228 11.6936 27.0554 11.4171C26.3879 11.1405 25.6725 10.9982 24.95 10.9982C24.2275 10.9982 23.5121 11.1405 22.8446 11.4171C22.1772 11.6936 21.5708 12.099 21.06 12.61L20 13.67L18.94 12.61C17.9083 11.5783 16.509 10.9987 15.05 10.9987C13.591 10.9987 12.1917 11.5783 11.16 12.61C10.1283 13.6417 9.54871 15.041 9.54871 16.5C9.54871 17.959 10.1283 19.3583 11.16 20.39L12.22 21.45L20 29.23L27.78 21.45L28.84 20.39C29.351 19.8792 29.7563 19.2728 30.0329 18.6053C30.3095 17.9379 30.4518 17.2225 30.4518 16.5C30.4518 15.7775 30.3095 15.0621 30.0329 14.3946C29.7563 13.7272 29.351 13.1208 28.84 12.61Z" stroke="#0A0A0A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

    </div>
  `;

    const favBtn = card.querySelector(".favorite");

    // 🔁 Initial state (important for reload/navigation)
    if (customerConstructor.isFavorite(product.id)) {
      favBtn.classList.add("inFavorites");
    }

    favBtn.addEventListener("click", async (e) => {
      e.stopPropagation();

      // Prevent double clicks
      favBtn.disabled = true;

      const isFav = customerConstructor.isFavorite(product.id);

      try {
        if (!isFav) {
          // ❤️ add to favorites
          await customerConstructor.toggleFavorites(product.id);
          favBtn.classList.add("inFavorites");
        } else {
          // 💔 remove from favorites
          await customerConstructor.toggleFavorites(product.id);
          favBtn.classList.remove("inFavorites");
        }
      } catch (err) {
        console.error("Failed to update favorites", err);
      } finally {
        favBtn.disabled = false;
      }
    });

    const cartBtn = card.querySelector(".add-to-cart");
    cartBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      cartConstructor.addProduct(product);
    });

    card.addEventListener("click", () => {
      navigate("productDetail", product.id);
    });

    container.appendChild(card);
  });
};
