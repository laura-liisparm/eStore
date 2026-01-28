import { Order } from "./order.js";
import {
  addFavoriteProductById,
  deleteFavoriteProductById,
  getFavoritesProductByuserID,
} from "../api.js";

export class Customer {
  constructor() {
    this._userName = null;
    this._userID = sessionStorage.getItem("userID") || null;
    this.orderHistory = [];
    this.favorites = [];
  }

  get userID() {
    return this._userID;
  }

  set userID(id) {
    this._userID = id;
    sessionStorage.setItem("userID", id);
  }

  get userName() {
    return this._userName;
  }

  set userName(name) {
    this._userName = name;
  }

  getClientData() {
    return { name: this._userName, id: this._userID };
  }

  placeOrder(cart) {
    const order = new Order(cart);
    this.orderHistory.push(order);
    order.printOrder();
  }

  printOrderHistory() {
    console.log(`${this._userName} tellimuste ajalugu:`);
    this.orderHistory.forEach((order, index) => {
      console.log(
        `Tellimus ${
          index + 1
        } - Kuupäev: ${order.orderDate.toDateString()}, Kogusumma: €${order.cart.calculateTotal()}`,
      );
    });
  }

  async toggleFavorites(productId) {
    const existingItem = this.favorites.find((item) => item.id === productId);

    if (existingItem) {
      await deleteFavoriteProductById(this._userID, productId);
    } else {
      await addFavoriteProductById(this._userID, productId);
    }

    await this.getAllFavorites(); // 🔥 MUST await
  }

  isFavorite(productId) {
    return this.favorites.some((item) => item.id === productId);
  }

  async getAllFavorites() {
    if (!this._userID) return [];
    const data = await getFavoritesProductByuserID(this._userID);
    this.favorites = data || [];
    console.log("Favorites loaded:", this.favorites);
    return this.favorites;
  }

  async login(userName) {
    this._userName = userName;

    // restore from session or generate a new ID
    if (!this._userID) {
      const randomId = Math.floor(Math.random() * 1000);
      this._userID = randomId;
      sessionStorage.setItem("userID", randomId);
    }

    // 🔥 await favorites so hearts work correctly
    await this.getAllFavorites();
  }

  logout() {
    sessionStorage.removeItem("userID");
    this.favorites = [];
    this._userID = null;
    alert(`User ${this.userName} has logged out`);
  }
}

export const customerConstructor = new Customer();
