'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, Shield } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
      } else {
        router.push('/admin/dashboard');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: '#0B0B0F' }}
    >
      <div className="w-full max-w-md">
        {/* Logo area */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #E50935 0%, #8B0520 100%)' }}
          >
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">Admin Access</h1>
          <p className="text-gray-500 text-sm mt-1">Daily Viral MMS</p>
        </div>

        <div
          className="rounded-2xl border p-8"
          style={{ background: '#17171D', borderColor: '#2A2A35' }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="admin@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-gray-600 outline-none text-sm"
                  style={{ background: '#0B0B0F', border: '1px solid #2A2A35' }}
                />
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl text-white placeholder-gray-600 outline-none text-sm"
                  style={{ background: '#0B0B0F', border: '1px solid #2A2A35' }}
                />
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-900/20 border border-red-900/40">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: '#E50935' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-700 mt-6">
          Administrator access only. No public registration.
        </p>
      </div>
    </div>
  );
}
