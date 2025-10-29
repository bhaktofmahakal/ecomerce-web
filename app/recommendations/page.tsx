import { getAllProducts } from '@/lib/db';
import ProductCard from '@/components/ProductCard';
import WishlistClient from '@/components/WishlistClient';
import { Star, RefreshCw, Lightbulb } from 'lucide-react';


export async function generateMetadata() {
  return {
    title: 'Recommendations - EcomStore',
    description: 'Personalized product recommendations',
  };
}

export default async function RecommendationsPage() {
  const allProducts = await getAllProducts();

  // Server-side logic to get recommendations
  const getRecommendations = () => {
    // Simple recommendation algorithm: random popular items
    return allProducts
      .sort(() => Math.random() - 0.5)
      .slice(0, 8);
  };

  const recommendations = getRecommendations();

  return (
    <div className="container-custom py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
          <div className="text-yellow-500 fill-yellow-500">
            <Star size={32} fill="currentColor" />
          </div>
          Personalized Recommendations
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Products picked just for you
        </p>
        <div className="inline-block bg-purple-50 border border-purple-200 rounded-lg p-4 text-sm text-purple-800 flex items-center gap-2">
          <div className="flex-shrink-0">
            <RefreshCw size={18} />
          </div>
          <span><strong>This page uses Server Components:</strong> Server fetches data, client handles wishlist interactions.</span>
        </div>
      </div>

      {/* Featured Section */}
      <div className="mb-12 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-8 border border-indigo-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Why These Recommendations?</h2>
        <p className="text-gray-700 mb-4">
          Based on our catalog analysis and popularity trends, we've selected products that offer the best value and
          quality. Each product has been hand-picked to match diverse customer preferences.
        </p>
        <p className="text-gray-600 text-sm flex items-center gap-2">
          <span className="text-yellow-600 flex-shrink-0">
            <Lightbulb size={16} />
          </span>
          <span>Tip: Use the wishlist button on each product to save items for later!</span>
        </p>
      </div>

      {/* Recommendations Grid with Wishlist */}
      <div>
        <h2 className="text-3xl font-bold mb-8">Recommended for You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard product={product} />
              <div className="absolute top-4 right-4">
                <WishlistClient productId={product.id} productName={product.name} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Server-Rendered Statistics */}
      <RecommendationStats products={allProducts} />

      {/* How It Works */}
      <div className="mt-16 bg-white rounded-lg shadow-md p-8">
        <h3 className="text-2xl font-bold mb-6">How Server Components Work Here</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border-l-4 border-indigo-600 pl-6">
            <h4 className="font-semibold text-gray-900 mb-2">1. Server-Side Data</h4>
            <p className="text-gray-600 text-sm">
              Product data is fetched server-side, reducing client-side data transfer and keeping secrets secure.
            </p>
          </div>
          <div className="border-l-4 border-indigo-600 pl-6">
            <h4 className="font-semibold text-gray-900 mb-2">2. Client Interaction</h4>
            <p className="text-gray-600 text-sm">
              Wishlist functionality is handled by a client component, providing instant feedback and local state.
            </p>
          </div>
          <div className="border-l-4 border-indigo-600 pl-6">
            <h4 className="font-semibold text-gray-900 mb-2">3. Hybrid Performance</h4>
            <p className="text-gray-600 text-sm">
              Best of both worlds: fast data loading + responsive interactivity without waterfalls.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface RecommendationStatsProps {
  products: Array<{ category: string; price: number }>;
}

async function RecommendationStats({ products }: RecommendationStatsProps) {
  const avgPrice = (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2);
  const categories = new Set(products.map((p) => p.category)).size;

  return (
    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
        <p className="text-sm text-blue-700 mb-1">Average Price</p>
        <p className="text-3xl font-bold text-blue-900">${avgPrice}</p>
      </div>
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
        <p className="text-sm text-green-700 mb-1">Total Products</p>
        <p className="text-3xl font-bold text-green-900">{products.length}</p>
      </div>
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
        <p className="text-sm text-purple-700 mb-1">Categories</p>
        <p className="text-3xl font-bold text-purple-900">{categories}</p>
      </div>
    </div>
  );
}