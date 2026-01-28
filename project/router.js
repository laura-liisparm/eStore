import { displayFavoritesView } from "./views/favoritesView.js";
import { displayProductDetailView } from "./views/productDetailView.js";
import { displayCartView } from "./views/cartView.js";
import { displayAllProductsView } from "./views/allProductsView.js";

export const navigate = async (view, param, pushState = true) => {
  const views = {
    allProducts: () => displayAllProductsView(param), // param peaks olema products massiiv
    productDetail: () => displayProductDetailView(param), // param on üks product
    cart: () => displayCartView(param),
    favorites: () => displayFavoritesView(param),
  };

  if (views[view]) {
    await views[view]();
    if (pushState) {
      const url = constructUrl(view, param);
      window.history.pushState({ view, param }, "", url);
    }
  } else {
    console.warn(`Vaadet "${view}" ei leitud.`);
  }
};

const constructUrl = (view, param) => {
  switch (view) {
    case "allProducts":
      return param && param !== "all" ? "/category/${param}" : "/";
    case "productDetail":
      return `/product/${param}`;
    case "cart":
      return "/cart";
    case "favorites":
      return "/favorites";
    default:
      return "/";
  }
};
