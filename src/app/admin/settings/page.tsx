import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminSettingsPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  return (
    <div style={{ background: '#f7f7f7', minHeight: '100vh' }}>
      <AdminSidebar />
      <main style={{ marginLeft: 220, padding: '32px 28px' }} className="admin-main">
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111', marginBottom: 2 }}>Settings</h1>
          <p style={{ fontSize: 13, color: '#999' }}>Signed in as {session.email}</p>
        </div>

        <div style={{ maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#fff', border: '1.5px solid #e8e8e8', borderRadius: 12, padding: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 16 }}>Account Information</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid #f5f5f5' }}>
                <span style={{ fontSize: 13, color: '#999' }}>Email</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>{session.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: '#999' }}>Role</span>
                <span style={{ fontSize: 11, fontWeight: 700, background: '#e6f7fe', color: '#00aff0', padding: '3px 10px', borderRadius: 25 }}>
                  Administrator
                </span>
              </div>
            </div>
          </div>

          <div style={{ background: '#fff', border: '1.5px solid #e8e8e8', borderRadius: 12, padding: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 12 }}>Change Password</h2>
            <p style={{ fontSize: 13, color: '#999', lineHeight: 1.6, marginBottom: 12 }}>
              To change your password, re-run the seed script with your new credentials:
            </p>
            <code style={{ display: 'block', background: '#f7f7f7', border: '1px solid #e8e8e8', borderRadius: 8, padding: '12px 16px', fontSize: 12, color: '#333', fontFamily: 'monospace', lineHeight: 1.6 }}>
              SEED_ADMIN_EMAIL=you@example.com<br />
              SEED_ADMIN_PASSWORD=NewPassword123<br />
              npx ts-node --project tsconfig.seed.json prisma/seed.ts
            </code>
          </div>
        </div>
      </main>
      <style>{`@media (max-width: 768px) { .admin-main { margin-left: 0 !important; padding-top: 72px !important; } }`}</style>
    </div>
  );
}
