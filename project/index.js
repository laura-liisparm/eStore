/*
class product {
  constructor(titel, price, category) {
    this.id = crypto.randomUUID();
    this.titel = titel;
    this.price = price;
    this.category = category;
  }

  displayProduct() {
    console.log(`
            ID: ${this.id}, 
            Title: ${this.titel}, 
            Price: $${this.price}, 
            Category: ${this.category}`);
  }

  discountedPrice(discountPercent) {
    const discountAmount = (this.price * discountPercent) / 100;
    return this.price - discountAmount;
  }
}

class cart {
  constructor() {
    this.products = [];
  }

  addProduct(product, quantity) {
    this.products.push({ product, quantity });
  }

  removeProduct(productId) {
    this.products = this.products.filter(
      (item) => item.product.id !== productId
    );
  }

  calculateTotal() {
    return this.products.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  get totalItems() {
    return this.products.reduce((count, item) => count + item.quantity, 0);
  }
}

class order {
  constructor(cart) {
    this.orderDate = new Date();
    this.cart = cart;
  }

  printOrder() {
    console.log("=== ORDER DETAILS ===");
    console.log("Order Date:", this.orderDate.toLocaleString());

    console.log("\nProducts:");
    this.cart.products.forEach((item) => {
      console.log(
        `- ${item.product.titel} x ${item.quantity} = $${(
          item.product.price * item.quantity
        ).toFixed(2)}`
      );
    });

    console.log("\nTotal Items:", this.cart.totalItems);
    console.log("Total Price: $" + this.cart.calculateTotal().toFixed(2));
  }
}

class customer {
  constructor(name, orderHistopry) {
    this.name = name;
    this.orderHistopry = orderHistopry || [];
  }
  placeOrder(cart) {
    const newOrder = new order(cart);
    this.orderHistopry.push(newOrder);
    return newOrder;
  }

  printOrderHistory() {
    console.log(`=== ORDER HISTORY FOR ${this.name.toUpperCase()} ===`);
    this.orderHistopry.forEach((ord, index) => {
      console.log(`\n--- Order ${index + 1} ---`);
      ord.printOrder();
    });
    console.log("=====================================\n");
  }
}

// Example Usage

const laptop = new product("Laptop", 999.99, "Electronics");
const phone = new product("Smartphone", 499.99, "Electronics");

const myCart = new cart();
myCart.addProduct(laptop, 1);
myCart.addProduct(phone, 2);

console.log(`Total Items: ${myCart.totalItems}`);
console.log(`Total Price: $${myCart.calculateTotal().toFixed(2)}`);

myCart.removeProduct(phone.id);

console.log(`Total Items in Cart after removal: ${myCart.totalItems}`);
console.log(
  `Total Price after removal: $${myCart.calculateTotal().toFixed(2)}`
);

const myOrder = new order(myCart);
myOrder.printOrder();

const customer1 = new customer("Alice");
const order1 = customer1.placeOrder(myCart);
customer1.printOrderHistory();
*/
import { cartConstructor } from "./constructors/cart.js";
import { customerConstructor } from "./constructors/customer.js";
import { navigate } from "./router.js";
import { getAllCategory } from "./api.js";

const initApp = async () => {
  // 🔥 LOGIN USER FIRST
  await customerConstructor.login("TestUser");

  // 🔥 LOAD FAVORITES ON START
  await customerConstructor.getAllFavorites();

  // Buttons
  document.getElementById("favorites-button").onclick = async () => {
    await navigate("favorites");
  };

  document.getElementById("cart-button").onclick = () => {
    navigate("cart", cartConstructor.getAllProducts());
  };

  document.getElementById("home-button").onclick = () => {
    navigate("allProducts", "all");
  };

  // Categories
  const categories = await getAllCategory();
  const categorySelect = document.getElementById("categories");

  if (categorySelect) {
    categories.forEach((cat) => {
      const btn = document.createElement("button");
      btn.textContent = cat;
      btn.onclick = () => navigate("allProducts", cat);
      categorySelect.appendChild(btn);
    });
  }

  // Routing on reload
  const path = window.location.pathname;

  if (path === "/favorites") {
    await navigate("favorites", null, false);
  } else if (path === "/cart") {
    await navigate("cart", null, false);
  } else if (path.startsWith("/product/")) {
    navigate("productDetail", path.split("/").pop(), false);
  } else if (path.startsWith("/category/")) {
    navigate("allProducts", path.split("/").pop(), false);
  } else {
    await navigate("allProducts", "all", false);
  }
};

document.addEventListener("DOMContentLoaded", initApp);
