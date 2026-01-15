import { cartConstructor } from "../../constructors/cart.js";

export const displayCartView = () => {
  const container = document.getElementById("main-container");
  container.innerHTML = "<h2>Ostukorv</h2>";

  const cartItems = cartConstructor.getAllProducts();

  if (!cartItems.length) {
    const emptyMessage = document.createElement("p");
    emptyMessage.innerText = "Ostukorv on tühi";
    container.appendChild(emptyMessage);
    return;
  }

  const itemsContainer = document.createElement("div");
  itemsContainer.classList.add("cart-items-container");

  cartItems.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("cart-item");

    cartItemElement.innerHTML = `
  <div class="cart-product-card">
    <img 
      src="${item.product.image}" 
      alt="${item.product.title}" 
      class="product-image"
    />

    <h3>${item.product.title}</h3>
    <p class="category">${item.product.category}</p>

    <p class="price">
      €${item.product.price.toFixed(2)} × ${item.quantity}
    </p>

    <p class="subtotal">
      Kokku: €${(item.product.price * item.quantity).toFixed(2)}
    </p>
  </div>
`;

    const removeButton = document.createElement("button");
    removeButton.textContent = "Eemalda";
    removeButton.addEventListener("click", () => {
      cartConstructor.removeProduct(item.product.id);
      displayCartView(); // Re-render cart view after removal
    });

    cartItemElement.appendChild(removeButton);
    itemsContainer.appendChild(cartItemElement);
  });

  container.appendChild(itemsContainer);

  const totalPrice = document.createElement("p");
  totalPrice.classList.add("cart-total");
  totalPrice.innerHTML = `<strong>Kokku: $${cartConstructor.calculateTotal()}</strong>`;
  container.appendChild(totalPrice);
};
