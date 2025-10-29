import fs from 'fs';
import path from 'path';
import {
  getAllProducts,
  getProductBySlug,
  getProductById,
  addProduct,
  updateProduct,
  getInventoryStats,
  Product,
} from '@/lib/db';

jest.mock('fs');
jest.mock('path');

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Laptop',
    slug: 'laptop',
    description: 'High performance laptop',
    price: 1299.99,
    category: 'Electronics',
    inventory: 50,
    lastUpdated: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Mouse',
    slug: 'mouse',
    description: 'Wireless mouse',
    price: 29.99,
    category: 'Electronics',
    inventory: 100,
    lastUpdated: '2024-01-01T00:00:00Z',
  },
];

describe('Database Library', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (path.join as jest.Mock).mockReturnValue('/mock/data/products.json');
    (fs.existsSync as jest.Mock).mockReturnValue(true);
  });

  describe('getAllProducts', () => {
    it('should return all products from file', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockProducts));

      const products = await getAllProducts();
      expect(products).toEqual(mockProducts);
    });

    it('should return empty array if file does not exist', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      const products = await getAllProducts();
      expect(products).toEqual([]);
    });

    it('should return empty array on JSON parse error', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue('invalid json');
      const products = await getAllProducts();
      expect(products).toEqual([]);
    });
  });

  describe('getProductBySlug', () => {
    it('should return product by slug', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockProducts));

      const product = await getProductBySlug('laptop');
      expect(product).toEqual(mockProducts[0]);
    });

    it('should return null if product not found', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockProducts));

      const product = await getProductBySlug('nonexistent');
      expect(product).toBeNull();
    });

    it('should return null if no products exist', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify([]));

      const product = await getProductBySlug('laptop');
      expect(product).toBeNull();
    });
  });

  describe('getProductById', () => {
    it('should return product by id', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockProducts));

      const product = await getProductById('1');
      expect(product).toEqual(mockProducts[0]);
    });

    it('should return null if product not found', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockProducts));

      const product = await getProductById('999');
      expect(product).toBeNull();
    });
  });

  describe('addProduct', () => {
    it('should add a new product', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockProducts));
      const writeFileSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation();

      const newProduct = await addProduct({
        name: 'Keyboard',
        slug: 'keyboard',
        description: 'Mechanical keyboard',
        price: 149.99,
        category: 'Electronics',
        inventory: 30,
      });

      expect(newProduct.name).toBe('Keyboard');
      expect(newProduct.id).toBeDefined();
      expect(newProduct.lastUpdated).toBeDefined();
      expect(writeFileSpy).toHaveBeenCalled();
    });

    it('should increment product id correctly', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockProducts));
      jest.spyOn(fs, 'writeFileSync').mockImplementation();

      const product1 = await addProduct({
        name: 'Product 1',
        slug: 'product-1',
        price: 10,
        category: 'Test',
        inventory: 5,
      });

      expect(parseInt(product1.id)).toBe(3); // After products with id 1 and 2
    });
  });

  describe('updateProduct', () => {
    it('should update an existing product', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockProducts));
      jest.spyOn(fs, 'writeFileSync').mockImplementation();

      const updated = await updateProduct('1', {
        price: 999.99,
        inventory: 25,
      });

      expect(updated?.price).toBe(999.99);
      expect(updated?.inventory).toBe(25);
      expect(updated?.id).toBe('1'); // ID should not change
    });

    it('should return null if product not found', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockProducts));

      const updated = await updateProduct('999', { price: 50 });
      expect(updated).toBeNull();
    });

    it('should preserve original fields when not updating', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockProducts));
      jest.spyOn(fs, 'writeFileSync').mockImplementation();

      const updated = await updateProduct('1', { price: 1000 });

      expect(updated?.name).toBe(mockProducts[0].name);
      expect(updated?.slug).toBe(mockProducts[0].slug);
      expect(updated?.price).toBe(1000);
    });
  });

  describe('getInventoryStats', () => {
    it('should calculate inventory statistics', async () => {
      const productsWithLowStock: Product[] = [
        { ...mockProducts[0], inventory: 10 }, // Low stock
        { ...mockProducts[1], inventory: 100 },
      ];

      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(productsWithLowStock));

      const stats = await getInventoryStats();

      expect(stats.totalProducts).toBe(2);
      expect(stats.totalInventory).toBe(110);
      expect(stats.lowStockProducts.length).toBe(1);
      expect(stats.lowStockProducts[0].id).toBe('1');
    });

    it('should identify out of stock products', async () => {
      const productsWithOutOfStock: Product[] = [
        { ...mockProducts[0], inventory: 0 },
        { ...mockProducts[1], inventory: 50 },
      ];

      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(productsWithOutOfStock));

      const stats = await getInventoryStats();

      expect(stats.outOfStockProducts.length).toBe(1);
      expect(stats.outOfStockProducts[0].id).toBe('1');
    });

    it('should extract unique categories', async () => {
      const productsWithMultipleCategories: Product[] = [
        { ...mockProducts[0], category: 'Electronics' },
        { ...mockProducts[1], category: 'Accessories' },
        {
          id: '3',
          name: 'Another Electronic',
          slug: 'electronic-3',
          description: 'Another electronic product',
          price: 199.99,
          category: 'Electronics',
          inventory: 40,
          lastUpdated: '2024-01-01T00:00:00Z',
        },
      ];

      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(productsWithMultipleCategories));

      const stats = await getInventoryStats();

      expect(stats.categories).toHaveLength(2);
      expect(stats.categories).toContain('Electronics');
      expect(stats.categories).toContain('Accessories');
    });
  });
});