export const displayAllProductsView = (products) => {
  const container = document.getElementById("main-container");

  container.innerHTML = "<h2>Tooted</h2>";

  const productsContainer = document.createElement("div");
  productsContainer.classList.add("products-container");

  products.forEach((product) => {
    const productCard = document.createElement("div");

    productCard.innerHTML = `
    <h3>${product.name}</h3>
    <p>Kategooria: ${product.category}</p>
    <p>Hind: €${product.price}</p>
    <button class="favorites-btn">Lisa lemmikutesse</button>
  `;

    const favoritesButton = productCard.querySelector(".favorites-btn");

    favoritesButton.addEventListener("click", (e) => {
      e.stopPropagation();
      customerConstructor.toggleFavorites(product);
      favoritesButton.textContent = customerConstructor.isFavorite(product)
        ? "Lisatud lemmikutesse"
        : "Lisa lemmikutesse";
    });

    const cartButton = document.createElement("button");
    cartButton.textContent = "Lisa ostukorvi";
    cartButton.id = `cartButton${product.id}`;

    cartButton.addEventListener("click", (e) => {
      e.stopPropagation();
      cartConstructor.addProduct(product);
    });

    productCard.appendChild(cartButton);

    productCard.addEventListener("click", () => {
      navigate("productDetail", product);
    });

    productsContainer.append(productCard);
  });

  container.append(productsContainer);
};
