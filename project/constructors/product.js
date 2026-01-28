export class Product {
  constructor(id, title, price, category, image, description) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.price = Number(price) || 0;
    this.category = category;
    this.image = image || "../img/placeholder.png";
    this.description = description || "No description available.";
  }

  displayProduct() {
    return `${this.title} - ${this.category} - $${this.price}`;
  }

  discountedPrice(discountPercent) {
    return this.price - (this.price * discountPercent) / 100;
  }
}
