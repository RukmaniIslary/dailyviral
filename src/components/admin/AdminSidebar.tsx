'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'All Posts', href: '/admin/posts' },
  { label: 'Add New Post', href: '/admin/posts/new' },
  { label: 'Categories', href: '/admin/categories' },
  { label: 'Reports', href: '/admin/reports' },
  { label: 'Analytics', href: '/admin/analytics' },
  { label: 'Settings', href: '/admin/settings' },
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid #2d2d4e' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: '#e50935', borderRadius: 6, padding: '5px 9px', fontWeight: 900, fontSize: 12, color: '#fff', letterSpacing: 1 }}>DVM</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, color: '#fff', lineHeight: 1.2 }}>Daily Viral MMS</div>
            <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        {navItems.map(item => {
          const active = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} style={{
              display: 'block',
              padding: '10px 14px',
              borderRadius: 8,
              marginBottom: 2,
              fontSize: 14,
              fontWeight: active ? 700 : 400,
              color: active ? '#fff' : '#94a3b8',
              background: active ? 'rgba(229,9,53,0.15)' : 'transparent',
              borderLeft: `3px solid ${active ? '#e50935' : 'transparent'}`,
              textDecoration: 'none',
            }}>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px', borderTop: '1px solid #2d2d4e' }}>
        <button onClick={handleLogout} style={{
          display: 'block', width: '100%', padding: '10px 14px', borderRadius: 8,
          fontSize: 14, fontWeight: 400, color: '#64748b', background: 'none',
          border: 'none', cursor: 'pointer', textAlign: 'left',
        }}>
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside style={{ width: 220, position: 'fixed', left: 0, top: 0, height: '100vh', background: '#1a1a2e', zIndex: 40 }} className="admin-sidebar-desktop">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 56, background: '#1a1a2e', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', borderBottom: '1px solid #2d2d4e' }} className="admin-sidebar-mobile">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ background: '#e50935', borderRadius: 5, padding: '3px 7px', fontWeight: 900, fontSize: 11, color: '#fff' }}>DVM</div>
          <span style={{ fontWeight: 800, fontSize: 14, color: '#fff' }}>Admin</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer', lineHeight: 1 }}>
          {mobileOpen ? '✕' : '≡'}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 45, background: 'rgba(0,0,0,0.5)' }} onClick={() => setMobileOpen(false)}>
          <aside style={{ width: 240, height: '100%', background: '#1a1a2e' }} onClick={e => e.stopPropagation()}>
            <div style={{ height: 56 }} />
            <SidebarContent />
          </aside>
        </div>
      )}

      <style>{`
        @media (min-width: 769px) { .admin-sidebar-mobile { display: none !important; } }
        @media (max-width: 768px) { .admin-sidebar-desktop { display: none !important; } }
      `}</style>
    </>
  );
}
