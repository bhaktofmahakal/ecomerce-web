import { getAllProducts } from '@/lib/db';
import HomeClient from '@/components/HomeClient';
import { MapPin } from 'lucide-react';


export const revalidate = 3600; // Revalidate every hour (optional ISR)

export async function generateMetadata() {
  return {
    title: 'Home - EcomStore',
    description: 'Browse our collection of quality products',
    openGraph: {
      title: 'EcomStore - Your Online Marketplace',
      description: 'Browse our collection of quality products',
    },
  };
}

export default async function Home() {
  // Fetch data at build time
  const products = await getAllProducts();

  return (
    <div className="container-custom py-12">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Welcome to <span className="text-indigo-600">EcomStore</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover premium products with cutting-edge rendering technology
        </p>
        <div className="inline-block bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 flex items-center gap-2">
          <div className="flex-shrink-0">
            <MapPin size={18} />
          </div>
          <span><strong>This page uses SSG:</strong> Pre-rendered at build time with client-side filtering</span>
        </div>
      </div>

      {/* Products Grid with Client-side Filtering */}
      <HomeClient products={products} />
    </div>
  );
}