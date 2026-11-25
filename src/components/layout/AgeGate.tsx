'use client';

import { useState, useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';

export default function AgeGate({ children }: { children: React.ReactNode }) {
  const [confirmed, setConfirmed] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('dvm_age_confirmed');
    setConfirmed(stored === 'true');
  }, []);

  function handleConfirm() {
    localStorage.setItem('dvm_age_confirmed', 'true');
    setConfirmed(true);
  }

  function handleDecline() {
    window.location.href = 'https://www.google.com';
  }

  if (confirmed === null) return null; // avoid hydration mismatch

  if (!confirmed) {
    return (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        style={{ background: '#0B0B0F' }}
      >
        <div
          className="max-w-md w-full rounded-2xl border p-8 text-center"
          style={{ background: '#17171D', borderColor: '#2A2A35' }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: 'rgba(229,9,53,0.1)' }}
          >
            <ShieldAlert size={32} style={{ color: '#E50935' }} />
          </div>

          <div
            className="inline-flex items-center px-3 py-1 rounded text-sm font-black text-white mb-4"
            style={{ background: '#E50935' }}
          >
            18+ ADULTS ONLY
          </div>

          <h1 className="text-2xl font-bold text-white mb-3">Age Verification Required</h1>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            This website contains adult-oriented content intended only for individuals who are 18 years of age or older.
            By entering you confirm that you are of legal age in your jurisdiction.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleConfirm}
              className="w-full py-3 rounded-xl font-bold text-white transition-all hover:opacity-90"
              style={{ background: '#E50935' }}
            >
              I am 18 or older – Enter
            </button>
            <button
              onClick={handleDecline}
              className="w-full py-3 rounded-xl font-medium text-gray-400 hover:text-white transition-colors"
              style={{ background: '#0B0B0F', border: '1px solid #2A2A35' }}
            >
              I am under 18 – Leave
            </button>
          </div>

          <p className="mt-5 text-xs text-gray-600">
            By entering you agree to our{' '}
            <a href="/terms" className="underline hover:text-gray-400">Terms of Service</a> and{' '}
            <a href="/privacy" className="underline hover:text-gray-400">Privacy Policy</a>.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
