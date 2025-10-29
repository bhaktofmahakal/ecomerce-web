'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/lib/db';
import { Check, X, Plus, Save, Edit2 } from 'lucide-react';

interface FormData {
  name: string;
  slug: string;
  description: string;
  price: string;
  category: string;
  inventory: string;
}

export default function AdminClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [apiKey, setApiKey] = useState('');
  const [formMode, setFormMode] = useState<'add' | 'edit' | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    slug: '',
    description: '',
    price: '',
    category: 'Electronics',
    inventory: '',
  });

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!apiKey) {
      showMessage('error', 'Please enter API key');
      return;
    }

    if (!formData.name || !formData.slug || !formData.price || !formData.inventory) {
      showMessage('error', 'Please fill all required fields');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        inventory: parseInt(formData.inventory),
      };

      const url = formMode === 'add' ? '/api/products' : `/api/products/${editingId}`;
      const method = formMode === 'add' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to save product');
      }

      await fetchProducts();
      resetForm();
      showMessage('success', `Product ${formMode === 'add' ? 'created' : 'updated'} successfully!`);
    } catch (err) {
      showMessage('error', err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleEdit = (product: Product) => {
    setFormMode('edit');
    setEditingId(product.id);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      inventory: product.inventory.toString(),
    });
  };

  const resetForm = () => {
    setFormMode(null);
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: '',
      category: 'Electronics',
      inventory: '',
    });
  };

  return (
    <div className="space-y-12">
      {/* API Key Section */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
        <h2 className="text-2xl font-bold mb-4">Authentication</h2>
        <p className="text-sm text-gray-600 mb-4">
          Enter your API key to manage products. Default key: <code className="bg-gray-100 px-2 py-1 rounded">admin-secret-key-2024</code>
        </p>
        <input
          type="password"
          placeholder="Enter API key..."
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="input-field"
        />
      </div>

      {/* Messages */}
      {message && (
        <div
          className={`rounded-lg p-4 flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex-shrink-0">
            {message.type === 'success' ? (
              <Check size={20} />
            ) : (
              <X size={20} />
            )}
          </div>
          <span>{message.text}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-800 rounded-lg p-4 border border-red-200">
          Error: {error}
        </div>
      )}

      {/* Add Product Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {formMode === 'edit' ? 'Edit Product' : 'Add New Product'}
          </h2>
          {formMode && (
            <button onClick={resetForm} className="btn-secondary">
              Cancel
            </button>
          )}
        </div>

        {formMode ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="input-field"
                  placeholder="e.g., Premium Headphones"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleFormChange}
                  className="input-field"
                  placeholder="e.g., premium-headphones"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleFormChange}
                  className="input-field"
                  placeholder="99.99"
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select name="category" value={formData.category} onChange={handleFormChange} className="input-field">
                  <option value="Electronics">Electronics</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Books">Books</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Inventory *</label>
                <input
                  type="number"
                  name="inventory"
                  value={formData.inventory}
                  onChange={handleFormChange}
                  className="input-field"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                className="input-field h-32"
                placeholder="Product description..."
              />
            </div>

            <button type="submit" className="btn-primary flex items-center gap-2">
              {formMode === 'add' ? (
                <>
                  <Plus size={20} />
                  Add Product
                </>
              ) : (
                <>
                  <Save size={20} />
                  Update Product
                </>
              )}
            </button>
          </form>
        ) : (
          <button onClick={() => setFormMode('add')} className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Add New Product
          </button>
        )}
      </div>

      {/* Products List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Products Management</h2>

        {loading ? (
          <p className="text-center text-gray-600 py-8">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-600 py-8">No products found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Price</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Inventory</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.slug}</p>
                    </td>
                    <td className="text-right py-3 px-4">${product.price.toFixed(2)}</td>
                    <td className="text-right py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-sm font-medium ${
                          product.inventory === 0
                            ? 'bg-red-100 text-red-800'
                            : product.inventory < 50
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {product.inventory}
                      </span>
                    </td>
                    <td className="py-3 px-4">{product.category}</td>
                    <td className="text-center py-3 px-4">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center gap-1 mx-auto"
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* API Documentation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-4">API Documentation</h3>
        <div className="space-y-3 text-sm text-blue-800">
          <p>
            <strong>Base URL:</strong> <code className="bg-white px-2 py-1 rounded">/api</code>
          </p>
          <p>
            <strong>Authentication:</strong> Add header <code className="bg-white px-2 py-1 rounded">x-api-key</code>
          </p>
          <ul className="space-y-2 ml-4">
            <li>
              <strong>POST /api/products</strong> - Create new product (requires auth)
            </li>
            <li>
              <strong>PUT /api/products/[id]</strong> - Update product (requires auth)
            </li>
            <li>
              <strong>GET /api/products</strong> - Get all products
            </li>
            <li>
              <strong>GET /api/products/[slug]</strong> - Get product by slug
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}