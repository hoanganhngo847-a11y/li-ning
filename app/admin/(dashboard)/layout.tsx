'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const cookies = document.cookie.split(';');
      const hasAuth = cookies.some(c => c.trim().startsWith('admin-token='));
      if (!hasAuth) {
        window.location.href = '/admin/login';
      } else {
        setIsAuthenticated(true);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    document.cookie = 'admin-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/admin/login';
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">Loading...</div>;
  }

  if (!isAuthenticated) return null;

  const navItems = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Danh mục', href: '/admin/categories' },
    { name: 'Sản phẩm', href: '/admin/products' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-[#111111] text-white flex flex-col fixed h-full">
        <div className="p-6">
          <h1 className="text-xl font-bold tracking-wider text-[#f30d29]">LI-NING ADMIN</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 rounded-md transition-colors ${
                pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                  ? 'bg-[#f30d29] text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col h-full overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Admin Panel</h2>
            <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-700">
              Đăng xuất
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
