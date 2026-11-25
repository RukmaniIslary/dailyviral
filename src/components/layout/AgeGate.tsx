'use client';

import { useState, useEffect } from 'react';

export default function AgeGate({ children }: { children: React.ReactNode }) {
  const [confirmed, setConfirmed] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('dvm_age_confirmed');
    if (stored !== 'true') setConfirmed(false);
  }, []);

  function handleConfirm() {
    localStorage.setItem('dvm_age_confirmed', 'true');
    setConfirmed(true);
  }

  function handleDecline() {
    window.location.href = 'https://www.google.com';
  }

  if (!confirmed) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#0B0B0F',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}>
        <div style={{
          background: '#17171D',
          border: '1px solid #2A2A35',
          borderRadius: 20,
          padding: '40px 32px',
          maxWidth: 440,
          width: '100%',
          textAlign: 'center',
        }}>
          {/* Icon */}
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(229,9,53,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#E50935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#E50935', color: '#fff',
            padding: '4px 14px', borderRadius: 6,
            fontSize: 13, fontWeight: 900, letterSpacing: 1,
            marginBottom: 18,
          }}>
            18+ ADULTS ONLY
          </div>

          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 12 }}>
            Age Verification Required
          </h1>
          <p style={{ fontSize: 14, color: '#9ca3af', lineHeight: 1.7, marginBottom: 28 }}>
            This website contains adult-oriented content intended only for individuals who are 18 years of age or older.
            By entering you confirm that you are of legal age in your jurisdiction.
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button onClick={handleConfirm} style={{
              width: '100%', padding: '14px',
              borderRadius: 12, border: 'none',
              background: '#E50935', color: '#fff',
              fontSize: 15, fontWeight: 700, cursor: 'pointer',
            }}>
              I am 18 or older – Enter
            </button>
            <button onClick={handleDecline} style={{
              width: '100%', padding: '14px',
              borderRadius: 12, border: '1px solid #2A2A35',
              background: '#0B0B0F', color: '#9ca3af',
              fontSize: 15, fontWeight: 500, cursor: 'pointer',
            }}>
              I am under 18 – Leave
            </button>
          </div>

          <p style={{ marginTop: 20, fontSize: 12, color: '#4b5563' }}>
            By entering you agree to our{' '}
            <a href="/terms" style={{ textDecoration: 'underline', color: '#6b7280' }}>Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" style={{ textDecoration: 'underline', color: '#6b7280' }}>Privacy Policy</a>.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
