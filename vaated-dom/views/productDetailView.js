// Ühe toote detailvaate genereerimine
export const displayProductDetailView = (product) => {
  const container = document.getElementById("main-container");
  container.innerHTML = "";

  const productCard = document.createElement("div");
  productCard.classList.add("product-detail");

  productCard.innerHTML = `
      <h2>${product.title}</h2>
      <p>Kategooria: ${product.category}</p>
      <p>Hind: $${product.price.toFixed(2)}</p>
      <p>ID: ${product.id}</p>
  `;

  container.appendChild(productCard);
};
