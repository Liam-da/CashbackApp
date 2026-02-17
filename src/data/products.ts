export type Product = {
  id: string;
  barcode: string;
  name: string;
  brand: string;
  size: string;
  category: string;
  points: number;
  cashbackPercent: number;
  isHealthy: boolean;
  price?: number;
};

export type ItemRecord = {
  _id: string;
  barcode: bigint;
  name: string;
  price: number;
  category: string;
  creditvalue: number;
  healthy: boolean;
};

export const products: Product[] = [
  {
    id: "item-5700000000001",
    barcode: "5700000000001",
    name: "Organic Apples",
    brand: "FreshCo",
    size: "1kg",
    category: "Produce",
    points: 8,
    cashbackPercent: 5,
    isHealthy: true,
    price: 24.5,
  },
  {
    id: "item-5700000000002",
    barcode: "5700000000002",
    name: "Bananas",
    brand: "FreshCo",
    size: "1kg",
    category: "Produce",
    points: 6,
    cashbackPercent: 5,
    isHealthy: true,
    price: 18.0,
  },
  {
    id: "item-5700000000003",
    barcode: "5700000000003",
    name: "Whole Grain Bread",
    brand: "BakeHouse",
    size: "500g",
    category: "Bakery",
    points: 7,
    cashbackPercent: 5,
    isHealthy: true,
    price: 22.5,
  },
  {
    id: "item-5700000000004",
    barcode: "5700000000004",
    name: "Low Fat Milk 1L",
    brand: "Nordic Dairy",
    size: "1L",
    category: "Dairy",
    points: 5,
    cashbackPercent: 5,
    isHealthy: true,
    price: 14.0,
  },
  {
    id: "item-5700000000005",
    barcode: "5700000000005",
    name: "Greek Yogurt",
    brand: "Nordic Dairy",
    size: "500g",
    category: "Dairy",
    points: 6,
    cashbackPercent: 5,
    isHealthy: true,
    price: 16.0,
  },
  {
    id: "item-5700000000006",
    barcode: "5700000000006",
    name: "Oatmeal",
    brand: "PantryCo",
    size: "500g",
    category: "Pantry",
    points: 7,
    cashbackPercent: 5,
    isHealthy: true,
    price: 20.0,
  },
  {
    id: "item-5700000000007",
    barcode: "5700000000007",
    name: "Brown Rice",
    brand: "PantryCo",
    size: "1kg",
    category: "Pantry",
    points: 6,
    cashbackPercent: 5,
    isHealthy: true,
    price: 19.5,
  },
  {
    id: "item-5700000000008",
    barcode: "5700000000008",
    name: "Peanut Butter",
    brand: "PantryCo",
    size: "350g",
    category: "Pantry",
    points: 4,
    cashbackPercent: 5,
    isHealthy: true,
    price: 28.0,
  },
  {
    id: "item-5700000000009",
    barcode: "5700000000009",
    name: "Mixed Salad",
    brand: "FreshCo",
    size: "250g",
    category: "Produce",
    points: 9,
    cashbackPercent: 5,
    isHealthy: true,
    price: 25.0,
  },
  {
    id: "item-5700000000010",
    barcode: "5700000000010",
    name: "Chicken Breast",
    brand: "Butchers Best",
    size: "400g",
    category: "Meat",
    points: 8,
    cashbackPercent: 5,
    isHealthy: true,
    price: 39.0,
  },
  {
    id: "item-5700000000011",
    barcode: "5700000000011",
    name: "Salmon Fillet",
    brand: "Ocean Market",
    size: "300g",
    category: "Seafood",
    points: 10,
    cashbackPercent: 5,
    isHealthy: true,
    price: 49.0,
  },
  {
    id: "item-5700000000012",
    barcode: "5700000000012",
    name: "Sparkling Water",
    brand: "Sparkle",
    size: "1L",
    category: "Beverage",
    points: 2,
    cashbackPercent: 5,
    isHealthy: true,
    price: 10.0,
  },
  {
    id: "item-5700000000013",
    barcode: "5700000000013",
    name: "Orange Juice",
    brand: "Citrus Co",
    size: "1L",
    category: "Beverage",
    points: 4,
    cashbackPercent: 5,
    isHealthy: true,
    price: 24.0,
  },
  {
    id: "item-5700000000014",
    barcode: "5700000000014",
    name: "Protein Bar",
    brand: "FitFuel",
    size: "60g",
    category: "Snack",
    points: 3,
    cashbackPercent: 5,
    isHealthy: true,
    price: 18.0,
  },
  {
    id: "item-5700000000015",
    barcode: "5700000000015",
    name: "Chocolate Bar",
    brand: "SweetCo",
    size: "50g",
    category: "Snack",
    points: 1,
    cashbackPercent: 0,
    isHealthy: false,
    price: 14.0,
  },
  {
    id: "item-5700000000016",
    barcode: "5700000000016",
    name: "Potato Chips",
    brand: "CrunchCo",
    size: "150g",
    category: "Snack",
    points: 1,
    cashbackPercent: 0,
    isHealthy: false,
    price: 22.0,
  },
  {
    id: "item-5700000000017",
    barcode: "5700000000017",
    name: "Tomato Soup",
    brand: "PantryCo",
    size: "400g",
    category: "Pantry",
    points: 4,
    cashbackPercent: 5,
    isHealthy: true,
    price: 17.5,
  },
  {
    id: "item-5700000000018",
    barcode: "5700000000018",
    name: "Frozen Vegetables",
    brand: "Frostline",
    size: "500g",
    category: "Frozen",
    points: 6,
    cashbackPercent: 5,
    isHealthy: true,
    price: 21.0,
  },
  {
    id: "item-5700000000019",
    barcode: "5700000000019",
    name: "Cheddar Cheese",
    brand: "Nordic Dairy",
    size: "200g",
    category: "Dairy",
    points: 3,
    cashbackPercent: 0,
    isHealthy: false,
    price: 26.0,
  },
  {
    id: "item-5700000000020",
    barcode: "5700000000020",
    name: "Granola",
    brand: "PantryCo",
    size: "400g",
    category: "Pantry",
    points: 5,
    cashbackPercent: 5,
    isHealthy: true,
    price: 27.0,
  },
];

export function findProductByBarcode(barcode: string) {
  return products.find((product) => product.barcode === barcode) ?? null;
}

const formatCategory = (category: string) =>
  category ? `${category[0].toUpperCase()}${category.slice(1)}` : category;

export function mapItemToProduct(item: ItemRecord): Product {
  const barcode = item.barcode.toString();
  const fallback = findProductByBarcode(barcode);

  return {
    id: fallback?.id ?? String(item._id),
    barcode,
    name: item.name,
    brand: fallback?.brand ?? "Demo Brand",
    size: fallback?.size ?? "1 unit",
    category: fallback?.category ?? formatCategory(item.category),
    points: item.creditvalue,
    cashbackPercent: fallback?.cashbackPercent ?? (item.healthy ? 5 : 0),
    isHealthy: item.healthy,
    price: item.price,
  };
}
