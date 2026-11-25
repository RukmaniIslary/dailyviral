'use client';

import { useState } from 'react';
import { X, Flag, AlertTriangle } from 'lucide-react';

interface Props {
  postId: string;
  onClose: () => void;
}

const REASONS = [
  { value: 'ILLEGAL_CONTENT', label: 'Illegal Content' },
  { value: 'MINOR_INVOLVED', label: 'Minors Involved' },
  { value: 'NON_CONSENSUAL', label: 'Non-Consensual Content' },
  { value: 'COPYRIGHT', label: 'Copyright Violation' },
  { value: 'SPAM', label: 'Spam / Fake Content' },
  { value: 'OTHER', label: 'Other' },
];

export default function ReportModal({ postId, onClose }: Props) {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason) {
      setError('Please select a reason');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, reason, description }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to submit report');
      } else {
        setSubmitted(true);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div
        className="max-w-md w-full rounded-2xl border p-6"
        style={{ background: '#17171D', borderColor: '#2A2A35' }}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Flag size={18} style={{ color: '#E50935' }} />
            <h2 className="text-lg font-bold text-white">Report Content</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-6">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(229,9,53,0.1)' }}
            >
              <AlertTriangle size={24} style={{ color: '#E50935' }} />
            </div>
            <h3 className="text-white font-semibold mb-2">Report Submitted</h3>
            <p className="text-gray-400 text-sm">Our team will review this content promptly.</p>
            <button
              onClick={onClose}
              className="mt-5 px-6 py-2.5 rounded-xl font-medium text-white text-sm"
              style={{ background: '#E50935' }}
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Reason *</label>
              <div className="grid grid-cols-1 gap-2">
                {REASONS.map((r) => (
                  <label
                    key={r.value}
                    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors"
                    style={{
                      background: reason === r.value ? 'rgba(229,9,53,0.1)' : '#0B0B0F',
                      border: reason === r.value ? '1px solid #E50935' : '1px solid #2A2A35',
                    }}
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={r.value}
                      checked={reason === r.value}
                      onChange={(e) => setReason(e.target.value)}
                      className="accent-red-600"
                    />
                    <span className="text-sm text-gray-300">{r.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Additional details (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                maxLength={1000}
                placeholder="Provide more context..."
                className="w-full px-3 py-2 rounded-lg text-sm text-white placeholder-gray-600 outline-none resize-none"
                style={{ background: '#0B0B0F', border: '1px solid #2A2A35' }}
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition-colors"
                style={{ background: '#0B0B0F', border: '1px solid #2A2A35' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: '#E50935' }}
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
