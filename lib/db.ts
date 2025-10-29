import fs from 'fs';
import path from 'path';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  inventory: number;
  lastUpdated: string;
}

const PRODUCTS_FILE = path.join(process.cwd(), 'data', 'products.json');


function ensureDataDirectory() {
  const dir = path.dirname(PRODUCTS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Read all products from JSON file
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    ensureDataDirectory();
    if (!fs.existsSync(PRODUCTS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products:', error);
    return [];
  }
}

/**
 * Get a single product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getAllProducts();
  return products.find((p) => p.slug === slug) || null;
}

/**
 * Get a single product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  const products = await getAllProducts();
  return products.find((p) => p.id === id) || null;
}

/**
 * Add a new product
 */
export async function addProduct(product: Omit<Product, 'id' | 'lastUpdated'>): Promise<Product> {
  ensureDataDirectory();
  const products = await getAllProducts();
  const newId = (Math.max(...products.map((p) => parseInt(p.id)), 0) + 1).toString();
  const newProduct: Product = {
    ...product,
    id: newId,
    lastUpdated: new Date().toISOString(),
  };
  products.push(newProduct);
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
  return newProduct;
}

/**
 * Update an existing product
 */
export async function updateProduct(id: string, updates: Partial<Omit<Product, 'id'>>): Promise<Product | null> {
  ensureDataDirectory();
  const products = await getAllProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  products[index] = {
    ...products[index],
    ...updates,
    id: products[index].id, // Ensure ID doesn't change
    lastUpdated: new Date().toISOString(),
  };

  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
  return products[index];
}

/**
 * Get inventory statistics
 */
export async function getInventoryStats() {
  const products = await getAllProducts();
  const lowStockThreshold = 50;

  return {
    totalProducts: products.length,
    totalInventory: products.reduce((sum, p) => sum + p.inventory, 0),
    lowStockProducts: products.filter((p) => p.inventory < lowStockThreshold),
    outOfStockProducts: products.filter((p) => p.inventory === 0),
    categories: [...new Set(products.map((p) => p.category))],
  };
}