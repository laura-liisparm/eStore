export class Product {
  constructor(title, price, category) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.price = price;
    this.category = category;
  }

  displayProduct() {
    return `${this.name} - ${this.category} - $${this.price}`;
  }

  discountedPrice(discountPercent) {
    return price - (price * discount) / 100;
  }
}
