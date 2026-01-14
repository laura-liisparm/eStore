import { customerConstructor } from "../constructors/customer.js";
import { navigate } from "../project/router.js";

export const displayFavoritesView = () => {
  const favorites = customerConstructor.getAllFavorites();

  const container = document.getElementById("main-container");
  container.innerHTML = "<h2>Lemmikud</h2>";

  if (!favorites.length) {
    container.innerHTML += "<p>Lemmikuid pole</p>";
    return;
  }

  const favoritesContainer = document.createElement("div");
  favoritesContainer.classList.add("products-container");

  favorites.forEach((item) => {
    const product = item.product;

    const favoriteCard = document.createElement("div");
    favoriteCard.classList.add("product-card");

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

    const removeBtn = favoriteCard.querySelector(".remove-favorite");
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      customerConstructor.toggleFavorites(product);
      displayFavoritesView();
    });

    favoriteCard.addEventListener("click", () => {
      navigate("productDetail", product);
    });

    favoritesContainer.appendChild(favoriteCard);
  });

  container.appendChild(favoritesContainer);
};
