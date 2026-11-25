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
    <div style={{ background: '#f4f5f7', minHeight: '100vh' }}>
      {children}
    </div>
  );
}
