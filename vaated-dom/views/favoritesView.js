import { customerConstructor } from "../constructors/customer.js";
import { navigate } from "../project/router.js"; // if you want detail view on click

export const displayFavoritesView = () => {
  const favorites = customerConstructor.getAllFavorites();

  const container = document.getElementById("main-container");
  container.innerHTML = "<h2>Lemmikud</h2>";

  if (!favorites.length) {
    container.innerHTML += "<p>Lemmikuid pole</p>";
    return;
  }

  const favoritesContainer = document.createElement("div");
  favoritesContainer.classList.add("products-container"); // SAME GRID

  favorites.forEach((item) => {
    const product = item.product;

    const favoriteCard = document.createElement("div");
    favoriteCard.classList.add("product-card"); // SAME CARD STYLE

    favoriteCard.innerHTML = `
      <img 
        src="${product.image}" 
        alt="${product.title}" 
        class="product-image"
      />

      <h3>${product.title}</h3>
      <p>Kategooria: ${product.category}</p>
      <p>Hind: €${product.price.toFixed(2)}</p>

      <!-- ❤️ Remove from favorites -->
      <button class="remove-favorite">❌ Eemalda</button>
    `;

    // Remove from favorites
    const removeBtn = favoriteCard.querySelector(".remove-favorite");
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      customerConstructor.toggleFavorites(product);
      displayFavoritesView(); // re-render
    });

    // Optional: click card → detail view
    favoriteCard.addEventListener("click", () => {
      navigate("productDetail", product);
    });

    favoritesContainer.appendChild(favoriteCard);
  });

  container.appendChild(favoritesContainer);
};
