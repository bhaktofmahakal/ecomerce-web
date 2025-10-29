import { getInventoryStats, getAllProducts } from '@/lib/db';
import { BarChart3, Package, AlertTriangle, AlertCircle, TrendingUp } from 'lucide-react';

/**
 * INVENTORY DASHBOARD - SSR (Server-Side Rendering)
 * 
 * - Data is fetched on every request using dynamic rendering
 * - No caching - always shows fresh, real-time data
 * - HTML is generated server-side for each request
 * 
 * Key Characteristics:
 * - No revalidate parameter = dynamic rendering
 * - Always calls server functions at request time
 * - Perfect for data that changes frequently
 * 
 * Benefits:
 * - Always up-to-date information
 * - Protected endpoints for admin data
 * - Real-time statistics and inventory
 * 
 * Trade-offs:
 * - Slower than static pages (server processing per request)
 * - Can't scale as easily without caching layer
 * - Better suited for admin/authenticated areas
 */

export const dynamic = 'force-dynamic'; // Ensure dynamic rendering

export async function generateMetadata() {
  return {
    title: 'Dashboard - EcomStore Admin',
    description: 'Real-time inventory dashboard with live statistics',
    robots: 'noindex, nofollow', // Don't index admin pages
  };
}

export default async function DashboardPage() {
  const stats = await getInventoryStats();
  const products = await getAllProducts();

  const topProducts = products
    .sort((a, b) => b.price * b.inventory - a.price * a.inventory)
    .slice(0, 5);

  return (
    <div className="container-custom py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Inventory Dashboard</h1>
        <div className="inline-block bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800 flex items-center gap-2">
          <div className="flex-shrink-0">
            <BarChart3 size={18} />
          </div>
          <span><strong>This page uses SSR:</strong> Rendered on every request with live data. Perfect for real-time statistics.</span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          label="Total Products"
          value={stats.totalProducts}
          icon={Package}
          color="bg-blue-50"
        />
        <StatCard
          label="Total Inventory"
          value={stats.totalInventory}
          icon={TrendingUp}
          color="bg-green-50"
        />
        <StatCard
          label="Low Stock Items"
          value={stats.lowStockProducts.length}
          icon={AlertTriangle}
          color="bg-yellow-50"
        />
        <StatCard
          label="Out of Stock"
          value={stats.outOfStockProducts.length}
          icon={AlertCircle}
          color="bg-red-50"
        />
      </div>

      {/* Categories */}
      <div className="mb-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {stats.categories.map((category) => {
            const categoryProducts = products.filter((p) => p.category === category);
            const categoryInventory = categoryProducts.reduce((sum, p) => sum + p.inventory, 0);

            return (
              <div key={category} className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">{category}</p>
                <p className="text-2xl font-bold text-gray-900 mb-2">{categoryProducts.length}</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{
                      width: `${(categoryInventory / stats.totalInventory) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">{categoryInventory} units</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Low Stock Alert */}
      {stats.lowStockProducts.length > 0 && (
        <div className="mb-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-yellow-900 mb-6 flex items-center gap-2">
            <div className="flex-shrink-0">
              <AlertTriangle size={24} />
            </div>
            Low Stock Alert
          </h2>
          <div className="space-y-3">
            {stats.lowStockProducts.map((product) => (
              <div key={product.id} className="flex justify-between items-center p-3 bg-white rounded border border-yellow-200">
                <div>
                  <p className="font-semibold text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.category}</p>
                </div>
                <span className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full font-semibold text-sm">
                  {product.inventory} units
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Top Products by Value</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Product</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Price</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Inventory</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product) => (
                <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.category}</p>
                  </td>
                  <td className="text-right py-3 px-4">${product.price.toFixed(2)}</td>
                  <td className="text-right py-3 px-4">{product.inventory}</td>
                  <td className="text-right py-3 px-4 font-semibold text-indigo-600">
                    ${(product.price * product.inventory).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">About Real-Time Data</h3>
        <p className="text-sm text-blue-800">
          This dashboard fetches live inventory data on every request. Unlike static pages, SSR ensures you always see
          the current state of your inventory. This is ideal for dashboards, admin panels, and any content that needs to
          be fresh at all times.
        </p>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ size: number }>;
  color: string;
}

function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className={`${color} rounded-lg p-6 border border-gray-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="text-gray-600">
          <Icon size={32} />
        </div>
      </div>
    </div>
  );
}