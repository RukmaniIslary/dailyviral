'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Category { id: string; name: string; }

interface PostRow {
  title: string;
  externalUrl: string;
  thumbnailUrl: string;
  categoryId: string;
  description: string;
  isFeatured: boolean;
}

const emptyRow = (): PostRow => ({
  title: '', externalUrl: '', thumbnailUrl: '',
  categoryId: '', description: '', isFeatured: false,
});

const inp: React.CSSProperties = {
  width: '100%', padding: '9px 12px', borderRadius: 7,
  border: '1.5px solid #e0e0e0', fontSize: 13, color: '#111',
  background: '#fff', outline: 'none', boxSizing: 'border-box',
};

export default function BulkUploadClient({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<PostRow[]>([emptyRow()]);
  const [status, setStatus] = useState<'PUBLISHED' | 'DRAFT'>('PUBLISHED');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ index: number; success: boolean; title: string; error?: string }[]>([]);
  const [done, setDone] = useState(false);

  function updateRow(i: number, field: keyof PostRow, value: string | boolean) {
    setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: value } : r));
  }

  function addRow() {
    if (rows.length < 10) setRows(prev => [...prev, emptyRow()]);
  }

  function removeRow(i: number) {
    if (rows.length === 1) return;
    setRows(prev => prev.filter((_, idx) => idx !== i));
  }

  function pasteAll(field: keyof PostRow, value: string) {
    setRows(prev => prev.map(r => ({ ...r, [field]: value })));
  }

  const filledRows = rows.filter(r => r.title.trim() && r.externalUrl.trim() && r.thumbnailUrl.trim() && r.categoryId);

  async function handleSubmit() {
    if (filledRows.length === 0) return;
    setLoading(true); setDone(false); setResults([]);
    const res = await fetch('/api/admin/posts/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ posts: filledRows, status }),
    });
    const data = await res.json();
    setResults(data.results || []);
    setDone(true);
    setLoading(false);
  }

  if (done) {
    const succeeded = results.filter(r => r.success).length;
    return (
      <div style={{ maxWidth: 600 }}>
        <div style={{ background: '#fff', border: '1.5px solid #e8e8e8', borderRadius: 14, padding: 28 }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>{succeeded === results.length ? '🎉' : '⚠️'}</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 4 }}>
              {succeeded} of {results.length} posts uploaded
            </h2>
            <p style={{ fontSize: 14, color: '#888' }}>
              {succeeded === results.length ? 'All posts published successfully!' : `${results.length - succeeded} failed.`}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
            {results.map((r, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                borderRadius: 8, background: r.success ? '#ecfdf5' : '#fff0f3',
                border: `1px solid ${r.success ? '#a7f3d0' : '#fecdd3'}`,
              }}>
                <span style={{ fontSize: 16 }}>{r.success ? '✓' : '✗'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</div>
                  {r.error && <div style={{ fontSize: 12, color: '#e50935' }}>{r.error}</div>}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => { setDone(false); setRows([emptyRow()]); setResults([]); }}
              style={{ flex: 1, padding: '11px', borderRadius: 9, border: '1.5px solid #e0e0e0', background: '#fff', fontSize: 14, fontWeight: 600, color: '#555', cursor: 'pointer' }}>
              Upload More
            </button>
            <button onClick={() => router.push('/admin/posts')}
              style={{ flex: 1, padding: '11px', borderRadius: 9, border: 'none', background: '#00aff0', fontSize: 14, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>
              View All Posts
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Publish status toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, background: '#fff', border: '1.5px solid #e8e8e8', borderRadius: 10, padding: '12px 18px' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#555' }}>Publish as:</span>
        {(['PUBLISHED', 'DRAFT'] as const).map(s => (
          <button key={s} onClick={() => setStatus(s)} style={{
            padding: '6px 18px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700,
            background: status === s ? (s === 'PUBLISHED' ? '#00aff0' : '#f0f0f0') : '#f7f7f7',
            color: status === s ? (s === 'PUBLISHED' ? '#fff' : '#333') : '#999',
          }}>
            {s === 'PUBLISHED' ? '🌐 Publish Now' : '📝 Save as Draft'}
          </button>
        ))}
      </div>

      {/* Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rows.map((row, i) => (
          <div key={i} style={{ background: '#fff', border: '1.5px solid #e8e8e8', borderRadius: 12, padding: 16 }}>
            {/* Row header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#00aff0' }}>Post {i + 1}</span>
              <button onClick={() => removeRow(i)} disabled={rows.length === 1}
                style={{ background: 'none', border: 'none', cursor: rows.length === 1 ? 'not-allowed' : 'pointer', color: '#e50935', fontSize: 18, opacity: rows.length === 1 ? 0.3 : 1, lineHeight: 1 }}>
                ×
              </button>
            </div>

            {/* Fields grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {/* Title */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#666', display: 'block', marginBottom: 4 }}>Title *</label>
                <input value={row.title} onChange={e => updateRow(i, 'title', e.target.value)}
                  placeholder="Post title" style={inp}
                  onFocus={e => (e.target.style.borderColor = '#00aff0')} onBlur={e => (e.target.style.borderColor = '#e0e0e0')} />
              </div>

              {/* External URL */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#666', display: 'block', marginBottom: 4 }}>
                  External URL *
                  <button type="button" onClick={() => pasteAll('externalUrl', row.externalUrl)}
                    style={{ marginLeft: 8, fontSize: 10, color: '#00aff0', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                    Apply to all
                  </button>
                </label>
                <input value={row.externalUrl} onChange={e => updateRow(i, 'externalUrl', e.target.value)}
                  placeholder="https://example.com/video" style={{ ...inp, fontFamily: 'monospace', fontSize: 12 }}
                  onFocus={e => (e.target.style.borderColor = '#00aff0')} onBlur={e => (e.target.style.borderColor = '#e0e0e0')} />
              </div>

              {/* Thumbnail URL */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#666', display: 'block', marginBottom: 4 }}>Thumbnail URL *</label>
                <input value={row.thumbnailUrl} onChange={e => updateRow(i, 'thumbnailUrl', e.target.value)}
                  placeholder="https://example.com/thumb.jpg" style={{ ...inp, fontFamily: 'monospace', fontSize: 12 }}
                  onFocus={e => (e.target.style.borderColor = '#00aff0')} onBlur={e => (e.target.style.borderColor = '#e0e0e0')} />
              </div>

              {/* Category */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#666', display: 'block', marginBottom: 4 }}>
                  Category *
                  <button type="button" onClick={() => pasteAll('categoryId', row.categoryId)}
                    style={{ marginLeft: 8, fontSize: 10, color: '#00aff0', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                    Apply to all
                  </button>
                </label>
                <select value={row.categoryId} onChange={e => updateRow(i, 'categoryId', e.target.value)}
                  style={{ ...inp, cursor: 'pointer' }}
                  onFocus={e => (e.target.style.borderColor = '#00aff0')} onBlur={e => (e.target.style.borderColor = '#e0e0e0')}>
                  <option value="">Select category...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#666', display: 'block', marginBottom: 4 }}>Description (optional)</label>
                <input value={row.description} onChange={e => updateRow(i, 'description', e.target.value)}
                  placeholder="Optional description" style={inp}
                  onFocus={e => (e.target.style.borderColor = '#00aff0')} onBlur={e => (e.target.style.borderColor = '#e0e0e0')} />
              </div>
            </div>

            {/* Thumbnail preview */}
            {row.thumbnailUrl && (
              <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 80, height: 50, borderRadius: 6, overflow: 'hidden', background: '#f0f0f0', flexShrink: 0 }}>
                  <img src={row.thumbnailUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>✓ Thumbnail preview</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add row button */}
      {rows.length < 10 && (
        <button onClick={addRow} style={{
          width: '100%', marginTop: 10, padding: '12px', borderRadius: 10,
          border: '2px dashed #d0d0d0', background: 'none', fontSize: 14,
          fontWeight: 700, color: '#aaa', cursor: 'pointer',
        }}
          onMouseOver={e => { e.currentTarget.style.borderColor = '#00aff0'; e.currentTarget.style.color = '#00aff0'; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = '#d0d0d0'; e.currentTarget.style.color = '#aaa'; }}>
          + Add Another Post ({rows.length}/10)
        </button>
      )}

      {/* Submit */}
      <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
        <button onClick={handleSubmit} disabled={loading || filledRows.length === 0}
          style={{
            padding: '13px 36px', borderRadius: 10, border: 'none',
            background: '#00aff0', color: '#fff', fontSize: 15, fontWeight: 800,
            cursor: loading || filledRows.length === 0 ? 'not-allowed' : 'pointer',
            opacity: loading || filledRows.length === 0 ? 0.6 : 1,
            boxShadow: '0 2px 12px rgba(0,175,240,0.3)',
          }}>
          {loading ? 'Uploading...' : `Upload ${filledRows.length} Post${filledRows.length !== 1 ? 's' : ''}`}
        </button>
        <button onClick={() => router.push('/admin/posts')}
          style={{ padding: '13px 20px', borderRadius: 10, border: '1.5px solid #e0e0e0', background: '#fff', fontSize: 14, fontWeight: 600, color: '#555', cursor: 'pointer' }}>
          Cancel
        </button>
        {filledRows.length < rows.length && (
          <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 600 }}>
            ⚠ {rows.length - filledRows.length} incomplete row{rows.length - filledRows.length > 1 ? 's' : ''} will be skipped
          </span>
        )}
      </div>
    </div>
  );
}
