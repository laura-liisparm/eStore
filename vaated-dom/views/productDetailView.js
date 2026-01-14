import { cartConstructor } from "../constructors/cart.js";
import { customerConstructor } from "../constructors/customer.js";

export const displayProductDetailView = (product) => {
  const container = document.getElementById("main-container");
  container.innerHTML = "";

  const isFavorite = customerConstructor.isFavorite(product);

  const productCard = document.createElement("div");
  productCard.classList.add("product-detail");

  productCard.innerHTML = `
    <div class="product-detail-card">

      <!-- ❤️ Favorite -->
      <svg class="heart ${isFavorite ? "active" : ""}" 
           xmlns="http://www.w3.org/2000/svg"
           width="28" height="28" viewBox="0 0 24 24">
        <path d="M12 21s-6.7-4.35-9.33-7.02A5.5 5.5 0 0 1 12 6.5a5.5 5.5 0 0 1 9.33 7.48C18.7 16.65 12 21 12 21z"/>
      </svg>

      <img 
        src="${product.image}" 
        alt="${product.title}" 
        class="product-detail-image"
      />

      <h2>${product.title}</h2>
      <p class="category">${product.category}</p>
      <p class="price">€${product.price.toFixed(2)}</p>

      <!-- 🛒 Cart -->
      <button class="add-to-cart">Lisa ostukorvi</button>
    </div>
  `;

  const heart = productCard.querySelector(".heart");
  heart.addEventListener("click", () => {
    customerConstructor.toggleFavorites(product);
    heart.classList.toggle("active", customerConstructor.isFavorite(product));
  });

  const addToCartBtn = productCard.querySelector(".add-to-cart");
  addToCartBtn.addEventListener("click", () => {
    cartConstructor.addProduct(product);
    addToCartBtn.textContent = "Lisatud ✔";
  });

  container.appendChild(productCard);
};
