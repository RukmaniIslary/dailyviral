'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
      if (!res.ok) setError(data.error || 'Login failed');
      else router.push('/admin/dashboard');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 380 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, background: '#e50935', borderRadius: 14, marginBottom: 16 }}>
            <div style={{ width: 20, height: 20, border: '2.5px solid #fff', borderRadius: 3 }} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e', marginBottom: 4 }}>Admin Access</h1>
          <p style={{ fontSize: 13, color: '#94a3b8' }}>Daily Viral MMS</p>
        </div>

        {/* Form card */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
                style={{ width: '100%', padding: '11px 14px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 14, outline: 'none', color: '#1a1a2e', background: '#fafafa', boxSizing: 'border-box' }}
                onFocus={e => (e.target.style.borderColor = '#e50935')}
                onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '11px 44px 11px 14px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 14, outline: 'none', color: '#1a1a2e', background: '#fafafa', boxSizing: 'border-box' }}
                  onFocus={e => (e.target.style.borderColor = '#e50935')}
                  onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#94a3b8', fontWeight: 600 }}
                >
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ background: '#fff0f3', border: '1px solid #fecdd3', borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
                <p style={{ fontSize: 13, color: '#e50935' }}>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '13px', borderRadius: 8, background: '#e50935', color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '0 2px 8px rgba(229,9,53,0.25)' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#cbd5e1', marginTop: 20 }}>
          Administrator access only
        </p>
      </div>
    </div>
  );
}
