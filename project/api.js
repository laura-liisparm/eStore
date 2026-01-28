import { Product } from "./constructors/product.js";

/* GET products, optional category */
export const getProductsDataByCategory = async (category) => {
  try {
    const url =
      category && category !== "all"
        ? `/api/products?category=${encodeURIComponent(category)}`
        : "/api/products";

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch products");

    const productsData = await res.json();
    return productsData.map(
      (item) =>
        new Product(
          item.id,
          item.title,
          item.price,
          item.category,
          item.image,
          item.description,
        ),
    );
  } catch (error) {
    console.error(error);
    return [];
  }
};

/* GET all categories */
export const getAllCategory = async () => {
  try {
    const res = await fetch("/api/products/categories");
    if (!res.ok) throw new Error("Failed to fetch categories");
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

/* GET product by ID */
export const getProductById = async (productId) => {
  try {
    const res = await fetch(`/api/products/${productId}`);
    if (!res.ok) throw new Error("Product not found");
    const productData = await res.json();
    return new Product(
      productData.id,
      productData.title,
      productData.price,
      productData.category,
      productData.description,
      productData.image,
    );
  } catch (error) {
    console.error(error);
    return null;
  }
};

/* GET favorites by userID */
export const getFavoritesProductByuserID = async (userID) => {
  try {
    const res = await fetch(`/api/favorites/${userID}`);
    if (!res.ok) throw new Error("Failed to fetch favorites");
    const productsData = await res.json();
    return productsData.map(
      (item) =>
        new Product(
          item.id,
          item.title,
          item.price,
          item.category,
          item.description,
          item.image,
        ),
    );
  } catch (error) {
    console.error(error);
    return [];
  }
};

/* ADD favorite */
export const addFavoriteProductById = async (userID, productId) => {
  try {
    const res = await fetch(`/api/favorites/${userID}/${productId}`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to add favorite");
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

/* DELETE favorite */
export const deleteFavoriteProductById = async (userID, productId) => {
  try {
    const res = await fetch(`/api/favorites/${userID}/${productId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete favorite");
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};
