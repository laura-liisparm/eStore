import { displayFavoritesView } from "../views/favoritesView.js";
import { displayProductDetailView } from "../views/productDetailView.js";
import { displayCartView } from "../views/cartView.js";
import { displayAllProductsView } from "../views/allProductsView.js";

export const navigate = (view, param) => {
  const views = {
    allProducts: () => displayAllProductsView(param), // param peaks olema products massiiv
    productDetail: () => displayProductDetailView(param), // param on üks product
    cart: () => displayCartView(),
    favorites: () => displayFavoritesView(),
  };

  if (views[view]) {
    views[view]();
  } else {
    console.warn(`Vaadet "${view}" ei leitud.`);
  }
};
