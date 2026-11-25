import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Don't apply layout to login page
  return (
    <div style={{ background: '#0B0B0F', minHeight: '100vh' }}>
      {children}
    </div>
  );
}
