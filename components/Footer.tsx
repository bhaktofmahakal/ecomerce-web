import { ShoppingCart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-100 mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ShoppingCart size={20} /> EcomStore
            </h3>
            <p className="text-gray-400">Your trusted online marketplace.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Pages</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/" className="hover:text-white transition-colors">
                  Home (SSG)
                </a>
              </li>
              <li>
                <a href="/dashboard" className="hover:text-white transition-colors">
                  Dashboard (SSR)
                </a>
              </li>
              <li>
                <a href="/admin" className="hover:text-white transition-colors">
                  Admin (Client)
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">API Endpoints</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>GET /api/products</li>
              <li>GET /api/products/[slug]</li>
              <li>POST /api/products</li>
              <li>PUT /api/products/[id]</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Info</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/README.md" className="hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
              <li>© 2024 EcomStore</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <p className="text-center text-gray-400 text-sm">
            Built with Next.js • TypeScript • Tailwind CSS • Rendering Strategies Demo
          </p>
        </div>
      </div>
    </footer>
  );
}