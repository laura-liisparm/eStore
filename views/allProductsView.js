export function allProductsView(products) {
  for (let i = 0; i < products.length; i++) {
    composeSingleProduct(products[i]);
  }
}

function composeSingleProduct(product) {
  const productDiv = document.createElement("div");

  const productTitle = document.createTextNode(product.title);

  productDiv.appendChild(productTitle);

  document.body.appendChild(productDiv);
}
