import { getAllProducts, getProductBySlug } from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/ProductDetailClient';
import { Settings, Package, CheckCircle } from 'lucide-react';


export const revalidate = 60; // Revalidate every 60 seconds

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: `${product.name} - EcomStore`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      type: 'website',
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const stockStatus =
    product.inventory === 0 ? 'Out of Stock' : product.inventory < 50 ? 'Low Stock' : 'In Stock';

  const stockColor =
    product.inventory === 0
      ? 'text-red-600 bg-red-50'
      : product.inventory < 50
        ? 'text-yellow-600 bg-yellow-50'
        : 'text-green-600 bg-green-50';

  return (
    <div className="container-custom py-12">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2 text-sm text-gray-600">
        <Link href="/" className="hover:text-indigo-600">
          Home
        </Link>
        <span>/</span>
        <Link href="/" className="hover:text-indigo-600">
          Products
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </div>

      {/* Info Banner */}
      <div className="mb-8 bg-purple-50 border border-purple-200 rounded-lg p-4 text-sm text-purple-800 flex items-center gap-2">
        <div className="flex-shrink-0">
          <Settings size={18} />
        </div>
        <span><strong>This page uses ISR:</strong> Pre-rendered at build time, revalidated every 60 seconds. Supports on-demand revalidation for price/stock updates.</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Product Image Placeholder */}
        <div className="md:col-span-1">
          <div className="aspect-square bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
            <Package size={80} className="text-indigo-400" />
          </div>
          <div className="mt-4 p-4 bg-gray-100 rounded-lg text-center text-sm text-gray-600">
            Product Image
          </div>
        </div>

        {/* Product Details */}
        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl font-bold text-indigo-600">${product.price.toFixed(2)}</span>
            <span className={`px-4 py-2 rounded-full font-semibold ${stockColor}`}>{stockStatus}</span>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {/* Product Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Category</p>
              <p className="font-semibold text-gray-900">{product.category}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Inventory</p>
              <p className="font-semibold text-gray-900">{product.inventory} units</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Product ID</p>
              <p className="font-mono text-sm text-gray-900">{product.id}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Last Updated</p>
              <p className="text-sm text-gray-900">{new Date(product.lastUpdated).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Client-side Add to Cart */}
          <ProductDetailClient product={product} />

          {/* Related Actions */}
          <div className="mt-8 pt-8 border-t border-gray-200 space-y-2">
            <Link href="/" className="btn-primary block text-center">
              ← Back to Home
            </Link>
            {product.inventory > 0 && (
              <p className="text-sm text-gray-600 text-center flex items-center justify-center gap-2">
                <CheckCircle size={16} />
                This product is in stock and ready to ship!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <RelatedProducts productId={product.id} category={product.category} />
    </div>
  );
}

async function RelatedProducts({ productId, category }: { productId: string; category: string }) {
  const allProducts = await getAllProducts();
  const related = allProducts.filter((p) => p.category === category && p.id !== productId).slice(0, 4);

  if (related.length === 0) return null;

  const ProductCard = (await import('@/components/ProductCard')).default;

  return (
    <div className="mt-16 pt-12 border-t border-gray-200">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {related.map((product) => (
          <ProductCard key={product.id} product={product} compact />
        ))}
      </div>
    </div>
  );
}