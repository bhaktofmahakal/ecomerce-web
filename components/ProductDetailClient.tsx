'use client';

import { Product } from '@/lib/db';
import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (quantity > 0 && quantity <= product.inventory) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    setQuantity(Math.max(1, Math.min(value, product.inventory)));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Purchase Options</h3>

      {product.inventory > 0 ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                max={product.inventory}
                value={quantity}
                onChange={handleQuantityChange}
                className="input-field w-20 text-center"
              />
              <button
                onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}
                className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                +
              </button>
              <span className="text-sm text-gray-600 ml-2">Max: {product.inventory}</span>
            </div>
          </div>

          <div className="bg-indigo-50 p-4 rounded-lg">
            <p className="text-lg font-semibold text-indigo-900">
              Total: ${(product.price * quantity).toFixed(2)}
            </p>
          </div>

          <button
            onClick={handleAddToCart}
            className="btn-primary w-full text-lg py-3 font-semibold flex items-center justify-center gap-2"
          >
            {added ? (
              <>
                <Check size={20} />
                Added to Cart!
              </>
            ) : (
              <>
                <ShoppingCart size={20} />
                Add to Cart
              </>
            )}
          </button>

          {added && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center text-green-800 text-sm">
              Product added to cart! (This is a demo - no real cart system)
            </div>
          )}
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-800 font-semibold">Out of Stock</p>
          <p className="text-sm text-red-600 mt-1">This product is currently unavailable.</p>
        </div>
      )}
    </div>
  );
}