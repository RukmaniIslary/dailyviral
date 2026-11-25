'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Flag, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils/date';

interface Report {
  id: string;
  reason: string;
  description: string | null;
  status: string;
  createdAt: string;
  post: { title: string; slug: string; thumbnailUrl: string };
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  PENDING: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
  REVIEWED: { bg: 'rgba(99,102,241,0.1)', color: '#6366F1' },
  RESOLVED: { bg: 'rgba(16,185,129,0.1)', color: '#10B981' },
  DISMISSED: { bg: 'rgba(107,114,128,0.1)', color: '#6B7280' },
};

export default function ReportsClient({
  initialReports,
  total,
  page,
  pageSize,
}: {
  initialReports: Report[];
  total: number;
  page: number;
  pageSize: number;
}) {
  const [reports, setReports] = useState(initialReports);
  const totalPages = Math.ceil(total / pageSize);

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/admin/reports/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      }
    } catch {}
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">Reports</h1>
        <p className="text-gray-500 text-sm">{total.toLocaleString()} total reports</p>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: '#17171D', border: '1px solid #2A2A35' }}>
        {reports.length === 0 ? (
          <div className="py-16 text-center">
            <Flag size={32} className="text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500">No reports found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid #2A2A35' }}>
                  {['Post', 'Reason', 'Details', 'Status', 'Date', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => {
                  const sc = STATUS_COLORS[report.status] || STATUS_COLORS.PENDING;
                  return (
                    <tr
                      key={report.id}
                      className="hover:bg-white/5 transition-colors"
                      style={{ borderBottom: '1px solid #1E1E26' }}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={report.post.thumbnailUrl}
                            alt=""
                            className="w-10 h-7 rounded object-cover flex-shrink-0"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                          <span className="text-white text-xs line-clamp-1 max-w-32">{report.post.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-300">{report.reason.replace(/_/g, ' ')}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs max-w-40 truncate">
                        {report.description || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="px-2 py-1 rounded text-xs font-medium"
                          style={{ background: sc.bg, color: sc.color }}
                        >
                          {report.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{formatDate(report.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/post/${report.post.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-gray-500 hover:text-white transition-colors"
                          >
                            <ExternalLink size={13} />
                          </Link>
                          <select
                            value={report.status}
                            onChange={(e) => updateStatus(report.id, e.target.value)}
                            className="text-xs rounded-lg px-2 py-1.5 outline-none"
                            style={{ background: '#0B0B0F', border: '1px solid #2A2A35', color: '#9CA3AF' }}
                          >
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
    </>
  );
}
