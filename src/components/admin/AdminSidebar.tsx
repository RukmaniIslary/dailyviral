'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Plus,
  Grid3X3,
  Flag,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import Logo from '@/components/ui/Logo';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'All Posts', href: '/admin/posts', icon: FileText },
  { label: 'Add New Post', href: '/admin/posts/new', icon: Plus },
  { label: 'Categories', href: '/admin/categories', icon: Grid3X3 },
  { label: 'Reports', href: '/admin/reports', icon: Flag },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  const SidebarContent = () => (
    <>
      <div className="p-5 border-b" style={{ borderColor: '#2A2A35' }}>
        <Logo size="sm" />
        <p className="text-xs text-gray-600 mt-1 ml-1">Admin Panel</p>
      </div>

      <nav className="p-4 flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={
                active
                  ? { background: 'rgba(229,9,53,0.15)', color: '#fff', border: '1px solid rgba(229,9,53,0.3)' }
                  : { color: '#9CA3AF' }
              }
            >
              <Icon
                size={17}
                style={{ color: active ? '#E50935' : undefined }}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t" style={{ borderColor: '#2A2A35' }}>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-white w-full transition-colors"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col w-56 fixed left-0 top-0 h-full z-40"
        style={{ background: '#17171D', borderRight: '1px solid #2A2A35' }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile header */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 border-b"
        style={{ background: '#17171D', borderColor: '#2A2A35' }}
      >
        <Logo size="sm" />
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-gray-400 hover:text-white"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40"
          onClick={() => setMobileOpen(false)}
          style={{ background: 'rgba(0,0,0,0.6)' }}
        >
          <aside
            className="flex flex-col w-64 h-full"
            style={{ background: '#17171D' }}
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
