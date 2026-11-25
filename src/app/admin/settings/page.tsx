import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Settings } from 'lucide-react';

export default async function AdminSettingsPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  return (
    <div className="min-h-screen" style={{ background: '#0B0B0F' }}>
      <AdminSidebar />
      <main className="md:ml-56 pt-14 md:pt-0 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-white">Settings</h1>
          <p className="text-gray-500 text-sm">Signed in as {session.email}</p>
        </div>

        <div className="max-w-xl space-y-5">
          <div
            className="rounded-xl p-5"
            style={{ background: '#17171D', border: '1px solid #2A2A35' }}
          >
            <h2 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Settings size={16} style={{ color: '#E50935' }} />
              Account Information
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b" style={{ borderColor: '#2A2A35' }}>
                <span className="text-gray-500">Email</span>
                <span className="text-white">{session.email}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Role</span>
                <span
                  className="px-2 py-0.5 rounded text-xs font-bold"
                  style={{ background: 'rgba(229,9,53,0.1)', color: '#E50935' }}
                >
                  Administrator
                </span>
              </div>
            </div>
          </div>

          <div
            className="rounded-xl p-5"
            style={{ background: '#17171D', border: '1px solid #2A2A35' }}
          >
            <h2 className="font-semibold text-white mb-3">Site Information</h2>
            <div className="space-y-3 text-sm text-gray-400">
              <p>To change your password, re-seed the database with the updated credentials using the seed script.</p>
              <code
                className="block p-3 rounded-lg text-xs font-mono"
                style={{ background: '#0B0B0F', border: '1px solid #2A2A35' }}
              >
                npm run db:seed
              </code>
              <p>Environment variables are managed in the <code>.env</code> file.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
