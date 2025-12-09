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
import { Product } from "../constructors/product.js";
import { Cart } from "../constructors/cart.js";
import { Order } from "../constructors/order.js";
import { Customer } from "../constructors/customer.js";
import { allProductsView } from "../views/allProductsView.js";

const laptop = new Product("Laptop", 999.99, "Electronics");
const phone = new Product("Smartphone", 499.99, "Electronics");

const myCart = new Cart();
myCart.addProduct(laptop, 1);
myCart.addProduct(phone, 2);

console.log(`Total Items: ${myCart.totalItems}`);
console.log(`Total Price: $${myCart.calculateTotal().toFixed(2)}`);

myCart.removeProduct(phone.id);
console.log(`Total Items in Cart after removal: ${myCart.totalItems}`);
console.log(
  `Total Price after removal: $${myCart.calculateTotal().toFixed(2)}`
);

const myOrder = new Order(myCart);
myOrder.printOrder();

const customer1 = new Customer("Alice");
customer1.placeOrder(myCart);
customer1.printOrderHistory();

allProductsView([laptop, phone]);
