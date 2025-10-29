import Link from 'next/link';
import { Product } from '@/lib/db';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const stockStatus =
    product.inventory === 0 ? 'Out of Stock' : product.inventory < 50 ? 'Low Stock' : 'In Stock';

  const stockColor =
    product.inventory === 0 ? 'text-red-600' : product.inventory < 50 ? 'text-yellow-600' : 'text-green-600';

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="card cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.category}</p>
          </div>
          <span className="ml-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
            ${product.price.toFixed(2)}
          </span>
        </div>

        {!compact && <p className="text-sm text-gray-600 line-clamp-2 mb-4">{product.description}</p>}

        <div className="flex justify-between items-center">
          <span className={`text-sm font-medium ${stockColor}`}>{stockStatus}</span>
          <span className="text-xs text-gray-500">{product.inventory} units</span>
        </div>

        {!compact && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-400">Last updated: {new Date(product.lastUpdated).toLocaleDateString()}</p>
          </div>
        )}
      </div>
    </Link>
  );
}