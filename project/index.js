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
import { Product } from "./constructors/product.js";
import { displayAllProductsView } from "./views/allProductsView.js";
import { displayCartView } from "./views/cartView.js";
import { displayFavoritesView } from "./views/favoritesView.js";
import { displayProductDetailView } from "./views/productDetailView.js";
import { navigate } from "./router.js";

// API functions
import {
  getProductsDataByCategory,
  getAllCategory,
  getProductById,
  getFavoritesProductByuserID,
  addFavoriteProductById,
  deleteFavoriteProductById,
} from "./api.js";

const USER_ID = "user1"; // example user id

const initApp = async () => {
  // Buttons
  const favoritesButton = document.getElementById("favorites-button");
  favoritesButton.onclick = async () => {
    const favorites = await getFavoritesProductByuserID(USER_ID);
    displayFavoritesView(favorites);
  };

  const cartButton = document.getElementById("cart-button");
  cartButton.onclick = () => {
    displayCartView(cartConstructor.getProducts());
  };

  const homeButton = document.getElementById("home-button");
  homeButton.onclick = async () => {
    const products = await getProductsDataByCategory();
    displayAllProductsView(products);
  };

  console.log("Loading products from API...");
  // Load all products initially

  displayAllProductsView();

  // Load categories for filtering (if you have a filter dropdown)
  const categories = await getAllCategory();
  const categorySelect = document.getElementById("category-select");
  if (categorySelect) {
    categories.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categorySelect.appendChild(option);
    });

    categorySelect.onchange = async (e) => {
      navigate("allProducts", e.target.value);
    };
  }
};

document.addEventListener("DOMContentLoaded", initApp);
