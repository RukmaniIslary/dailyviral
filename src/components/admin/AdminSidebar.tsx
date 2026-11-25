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

  const Nav = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: 'linear-gradient(135deg,#00aff0,#0090cc)', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 11 }}>DV</span>
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: '#111' }}>Daily Viral MMS</div>
            <div style={{ fontSize: 10, color: '#999', letterSpacing: 1, textTransform: 'uppercase' }}>Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '14px 12px', overflowY: 'auto' }}>
        {navItems.map(item => {
          const active = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
              style={{
                display: 'block', padding: '10px 14px', borderRadius: 10, marginBottom: 2,
                fontSize: 14, fontWeight: active ? 700 : 500,
                color: active ? '#00aff0' : '#555',
                background: active ? '#e6f7fe' : 'transparent',
                borderLeft: `3px solid ${active ? '#00aff0' : 'transparent'}`,
                textDecoration: 'none',
              }}>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div style={{ padding: '12px', borderTop: '1px solid #f0f0f0' }}>
        <button onClick={handleLogout} style={{ display: 'block', width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 14, fontWeight: 500, color: '#999', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside style={{ width: 220, position: 'fixed', left: 0, top: 0, height: '100vh', background: '#fff', borderRight: '1.5px solid #e8e8e8', zIndex: 40 }} className="admin-desk">
        <Nav />
      </aside>

      {/* Mobile bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 56, background: '#fff', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', borderBottom: '1.5px solid #e8e8e8' }} className="admin-mob">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ background: 'linear-gradient(135deg,#00aff0,#0090cc)', borderRadius: 6, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 10 }}>DV</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 14, color: '#111' }}>Admin</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[0,1,2].map(i => <span key={i} style={{ display: 'block', width: 20, height: 2, background: '#333', borderRadius: 2 }} />)}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 45, background: 'rgba(0,0,0,0.3)' }} onClick={() => setMobileOpen(false)}>
          <aside style={{ width: 240, height: '100%', background: '#fff', borderRight: '1.5px solid #e8e8e8' }} onClick={e => e.stopPropagation()}>
            <div style={{ height: 56 }} />
            <Nav />
          </aside>
        </div>
      )}

      <style>{`
        @media (min-width: 769px) { .admin-mob { display: none !important; } }
        @media (max-width: 768px) { .admin-desk { display: none !important; } }
      `}</style>
    </>
  );
}
