'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils/date';

interface Report {
  id: string; reason: string; description: string | null; status: string; createdAt: string;
  post: { title: string; slug: string; thumbnailUrl: string };
}

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  PENDING: { bg: '#fff8e6', color: '#f59e0b' },
  REVIEWED: { bg: '#eef2ff', color: '#6366f1' },
  RESOLVED: { bg: '#ecfdf5', color: '#10b981' },
  DISMISSED: { bg: '#f5f5f5', color: '#999' },
};

export default function ReportsClient({ initialReports, total, page, pageSize }: { initialReports: Report[]; total: number; page: number; pageSize: number; }) {
  const [reports, setReports] = useState(initialReports);

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/admin/reports/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
      if (res.ok) setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    } catch {}
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111', marginBottom: 2 }}>Reports</h1>
        <p style={{ fontSize: 13, color: '#999' }}>{total.toLocaleString()} total reports</p>
      </div>

      <div style={{ background: '#fff', border: '1.5px solid #e8e8e8', borderRadius: 12, overflow: 'hidden' }}>
        {reports.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center' }}>
            <p style={{ color: '#999' }}>No reports found.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>{['Post', 'Reason', 'Details', 'Status', 'Date', 'Actions'].map(h => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {reports.map(report => {
                  const sc = STATUS_STYLE[report.status] || STATUS_STYLE.PENDING;
                  return (
                    <tr key={report.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 48, height: 32, borderRadius: 6, background: '#f5f5f5', flexShrink: 0, overflow: 'hidden' }}>
                            <img src={report.post.thumbnailUrl} alt=""
                              style={{ width: 48, height: 32, objectFit: 'cover', display: 'block' }}
                              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#111', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                            {report.post.title}
                          </span>
                        </div>
                      </td>
                      <td style={{ fontSize: 12 }}>{report.reason.replace(/_/g, ' ')}</td>
                      <td style={{ fontSize: 12, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{report.description || '—'}</td>
                      <td>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 25, background: sc.bg, color: sc.color }}>
                          {report.status}
                        </span>
                      </td>
                      <td style={{ fontSize: 12, color: '#aaa' }}>{formatDate(report.createdAt)}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <Link href={`/post/${report.post.slug}`} target="_blank"
                            style={{ padding: '5px 10px', borderRadius: 6, border: '1.5px solid #e0e0e0', fontSize: 12, fontWeight: 600, color: '#00aff0' }}>
                            View
                          </Link>
                          <select value={report.status} onChange={e => updateStatus(report.id, e.target.value)}
                            style={{ padding: '5px 10px', borderRadius: 6, border: '1.5px solid #e0e0e0', fontSize: 12, color: '#555', background: '#fff', cursor: 'pointer', outline: 'none' }}>
                            <option value="PENDING">Pending</option>
                            <option value="REVIEWED">Reviewed</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="DISMISSED">Dismissed</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
