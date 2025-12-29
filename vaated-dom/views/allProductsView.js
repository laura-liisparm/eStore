import { cartConstructor } from "../constructors/cart.js";
import { customerConstructor } from "../constructors/customer.js";
import { navigate } from "../project/router.js"; // veendu, et router.js impordib navigate

export const displayAllProductsView = (products) => {
  const container = document.getElementById("main-container");
  container.innerHTML = "<h2>Tooted</h2>";

  const productsContainer = document.createElement("div");
  productsContainer.classList.add("products-container");

  products.forEach((product) => {
    const isFavorite = customerConstructor.isFavorite(product);

    const productCard = document.createElement("div");
    productCard.classList.add("product-card");
    productCard.dataset.id = product.id;

    productCard.innerHTML = `
      <!-- ❤️ FAVORITES -->
      <svg class="heart ${isFavorite ? "active" : ""}" 
           xmlns="http://www.w3.org/2000/svg"
           width="28" height="28" viewBox="0 0 24 24">
        <path d="M12 21s-6.7-4.35-9.33-7.02A5.5 5.5 0 0 1 12 6.5a5.5 5.5 0 0 1 9.33 7.48C18.7 16.65 12 21 12 21z"/>
      </svg>

      <img src="${product.image}" alt="${
      product.title
    }" class="product-image" />

      <h3>${product.title}</h3>
      <p>Kategooria: ${product.category}</p>
      <p>Hind: €${product.price.toFixed(2)}</p>

      <!-- CART -->
      <svg class="cart-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a1 1 0 0 0 .99.81h12.72a1 1 0 0 0 .97-1.24l-1.54-7.73H6.21"></path>
      </svg>
    `;

    const heart = productCard.querySelector(".heart");
    heart.addEventListener("click", (e) => {
      e.stopPropagation();
      customerConstructor.toggleFavorites(product);
      heart.classList.toggle("active", customerConstructor.isFavorite(product));
    });

    const cartIcon = productCard.querySelector(".cart-icon");
    cartIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      cartConstructor.addProduct(product);
      cartIcon.classList.add("added");
    });

    productCard.addEventListener("click", () => {
      navigate("productDetail", product);
    });

    productsContainer.appendChild(productCard);
  });

  container.appendChild(productsContainer);
};
