export class Product {
  constructor(title, price, category, image) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.price = Number(price) || 0;
    this.category = category;
    this.image = image || "../img/placeholder.png";
  }

  displayProduct() {
    return `${this.title} - ${this.category} - $${this.price}`;
  }

  discountedPrice(discountPercent) {
    return this.price - (this.price * discountPercent) / 100;
  }
}
