import AdminClient from '@/components/AdminClient';
import { Settings } from 'lucide-react';

/**
 * ADMIN PANEL - Client-Side Rendering with Client-Side Data Fetching
 * 
 * - Page is rendered server-side initially
 * - Data loading happens on the client via API calls
 * - Forms are interactive and use client-side state management
 * 
 * Key Features:
 * - Forms for adding/editing products
 * - API-based data fetching (POST/PUT requests)
 * - Client-side validation
 * - Real-time form feedback
 * 
 * Benefits:
 * - Interactive, responsive admin interface
 * - No server-side processing overhead
 * - Can implement instant feedback and optimistic updates
 */

export async function generateMetadata() {
  return {
    title: 'Admin Panel - EcomStore',
    description: 'Manage products and inventory',
    robots: 'noindex, nofollow',
  };
}

export default function AdminPage() {
  return (
    <div className="container-custom py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Admin Panel</h1>
        <div className="inline-block bg-orange-50 border border-orange-200 rounded-lg p-4 text-sm text-orange-800 flex items-center gap-2">
          <div className="flex-shrink-0">
            <Settings size={18} />
          </div>
          <span><strong>This page uses Client-Side Fetching:</strong> Interactive forms with API integration.
          Protected routes require API key.</span>
        </div>
      </div>

      {/* Admin Client Component */}
      <AdminClient />
    </div>
  );
}