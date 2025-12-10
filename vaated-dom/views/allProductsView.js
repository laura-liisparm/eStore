export const displayAllProductsView = (products) => {
  const container = document.getElementById("main-container");

  container.innerHTML = "<h2>Tooted</h2>";

  const productsContainer = document.createElement("div");
  productsContainer.classList.add("products-container");

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product");
    productCard.innerHTML = `
        <h3>${product.name}</h3>
        <p>Kategooria: ${product.category}</p>
        <p>Hind: $${product.price}</p>
        <button id="favorites">Lisa lemmikutesse</button>
      `;

    //NB!! Kaks viis nuppude lisamiseks
    //1. lisan nupu innerHtml'i ja kasutan addEventListener'i, mis on all pool
    //2. Ostukorvi nupu lisamine createElement'iga, kus saab sündumse külge panna
    const cartButton = document.createElement("button");
    cartButton.textContent = "Lisa ostukorvi";

    //ostukorvi nupu lisamine productCardile
    productCard.appendChild(cartButton);

    //ühe toote kaardi lisan toodete konteinerisse
    productsContainer.append(productCard);
  });

  // Tooted lisan main kontainersisse
  container.append(productsContainer);
};
