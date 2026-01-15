// Customer.js
import { Order } from "./order.js";

import {
  addFavoriteProductById,
  deleteFavoriteProductById,
  getFavoritesProductByuserID,
} from "../api.js";

export class Customer {
  constructor() {
    this._userName;
    this._userID;
    this.orderHistory = [];
    this.favorites = [];
  }
  get userID() {
    return this._userID;
  }

  set userID(id) {
    const USER_ID = sessionStorage.getItem("userID");
    if (USER_ID) {
      this._userID = USER_ID;
    } else {
      this._userID = id;
      sessionStorage.setItem("userID", id);
    }
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
        } - Kuupäev: ${order.orderDate.toDateString()}, Kogusumma: $${order.cart.calculateTotal()}`
      );
    });
  }
  async toggleFavorites(productId) {
    const existingItem = this.favorites.find((item) => item.id === productId);
    //  console.log(productId);
    if (existingItem) {
      await deleteFavoriteProductById(this._userID, productId);
    } else {
      await addFavoriteProductById(this._userID, productId);
    }
    this.getAllFavorites();
  }

  isFavorite(productId) {
    //console.log("is favorie", productId);
    //  console.log("is favorie", productId, this.favorites);
    const existingItem = this.favorites.find((item) => item.id === productId);

    return !!existingItem;
  }

  async getAllFavorites() {
    const data = await getFavoritesProductByuserID(this._userID);
    this.favorites = data;
    console.log("favorite", this.favorites);
    return this.favorites;
  }

  async login(userName) {
    //console.log("110", USER_ID, sessionStorage);
    const randomId = Math.floor(Math.random() * 100);
    this._userID = randomId;
    this._userName = userName;

    sessionStorage.setItem("userID", randomId);

    // alert(`User ${userName} has logged in`);
    //Võta kõik lemmikud BE valmis
    this.getAllFavorites();
  }

  logout() {
    sessionStorage.removeItem("userID");
    this.favorites = [];
    alert(`User ${this.userName} has logged out`);
  }
}

export const customerConstructor = new Customer();
