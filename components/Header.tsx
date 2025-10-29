'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Home, BarChart3, Settings, Star } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/admin', label: 'Admin', icon: Settings },
    { href: '/recommendations', label: 'Recommendations', icon: Star },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom">
        <nav className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-indigo-600">
            <ShoppingCart size={28} />
            <span>EcomStore</span>
          </Link>

          <ul className="flex items-center gap-1 sm:gap-2">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1 text-sm sm:text-base ${
                      isActive(link.href)
                        ? 'bg-indigo-100 text-indigo-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent size={20} />
                    <span className="hidden sm:inline">{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}