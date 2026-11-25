'use client';

import { useState } from 'react';

interface Category { id: string; name: string; slug: string; description: string | null; imageUrl: string | null; _count: { posts: number }; }

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #e0e0e0', fontSize: 14, color: '#111', background: '#fff', outline: 'none', boxSizing: 'border-box' as const };

export default function CategoriesClient({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '', imageUrl: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function openCreate() { setEditId(null); setForm({ name: '', slug: '', description: '', imageUrl: '' }); setError(''); setShowForm(true); }
  function openEdit(c: Category) { setEditId(c.id); setForm({ name: c.name, slug: c.slug, description: c.description || '', imageUrl: c.imageUrl || '' }); setError(''); setShowForm(true); }

  async function handleSave() {
    if (!form.name.trim()) { setError('Name is required'); return; }
    if (!form.slug.trim()) { setError('Slug is required'); return; }
    setLoading(true); setError('');
    try {
      const url = editId ? `/api/admin/categories/${editId}` : '/api/admin/categories';
      const res = await fetch(url, { method: editId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to save'); }
      else {
        if (editId) setCategories(prev => prev.map(c => c.id === editId ? { ...data.category, _count: { posts: c._count.posts } } : c));
        else setCategories(prev => [...prev, { ...data.category, _count: { posts: 0 } }]);
        setShowForm(false);
      }
    } catch { setError('Network error'); }
    finally { setLoading(false); }
  }

  async function handleDelete(id: string, name: string, count: number) {
    if (count > 0) { alert(`Cannot delete "${name}" — it has ${count} posts. Reassign them first.`); return; }
    if (!confirm(`Delete category "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      if (res.ok) setCategories(prev => prev.filter(c => c.id !== id));
      else { const d = await res.json(); alert(d.error || 'Delete failed'); }
    } catch { alert('Network error'); }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111', marginBottom: 2 }}>Categories</h1>
          <p style={{ fontSize: 13, color: '#999' }}>{categories.length} categories</p>
        </div>
        <button onClick={openCreate} style={{ background: '#00aff0', color: '#fff', padding: '10px 22px', borderRadius: 10, fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}>
          + New Category
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#fff', border: '1.5px solid #e8e8e8', borderRadius: 12, padding: 24, marginBottom: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 18 }}>{editId ? 'Edit Category' : 'New Category'}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
            {[
              { label: 'Name *', key: 'name', placeholder: 'e.g. OnlyFans Videos' },
              { label: 'Slug *', key: 'slug', placeholder: 'onlyfans-videos', mono: true },
              { label: 'Description', key: 'description', placeholder: 'Optional short description' },
              { label: 'Cover Image URL', key: 'imageUrl', placeholder: 'https://example.com/cover.jpg' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>{f.label}</label>
                <input
                  type="text"
                  value={form[f.key as keyof typeof form]}
                  onChange={e => {
                    const val = e.target.value;
                    if (f.key === 'name') setForm(p => ({ ...p, name: val, slug: p.slug || generateSlug(val) }));
                    else if (f.key === 'slug') setForm(p => ({ ...p, slug: val.toLowerCase().replace(/[^a-z0-9-]/g, '') }));
                    else setForm(p => ({ ...p, [f.key]: val }));
                  }}
                  placeholder={f.placeholder}
                  style={{ ...inputStyle, ...(f.mono ? { fontFamily: 'monospace' } : {}) }}
                  onFocus={e => (e.target.style.borderColor = '#00aff0')}
                  onBlur={e => (e.target.style.borderColor = '#e0e0e0')}
                />
              </div>
            ))}
          </div>

          {/* Image preview */}
          {form.imageUrl && (
            <div style={{ marginTop: 14 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 8 }}>Cover Preview</p>
              <div style={{ width: 160, height: 100, borderRadius: 8, overflow: 'hidden', background: '#f0f0f0', border: '1px solid #e0e0e0' }}>
                <img src={form.imageUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          )}

          {error && <p style={{ fontSize: 13, color: '#e50935', marginTop: 10 }}>{error}</p>}
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button onClick={handleSave} disabled={loading}
              style={{ padding: '10px 24px', borderRadius: 8, background: '#00aff0', color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setShowForm(false)}
              style={{ padding: '10px 20px', borderRadius: 8, background: '#fff', color: '#555', fontSize: 14, fontWeight: 600, border: '1.5px solid #e0e0e0', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div style={{ background: '#fff', border: '1.5px solid #e8e8e8', borderRadius: 12, overflow: 'hidden' }}>
        {categories.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center' }}>
            <p style={{ color: '#999', marginBottom: 12 }}>No categories yet.</p>
            <button onClick={openCreate} style={{ color: '#00aff0', fontWeight: 700, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}>Create one</button>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>{['Cover', 'Name', 'Slug', 'Description', 'Posts', 'Actions'].map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id}>
                  <td>
                    <div style={{ width: 48, height: 32, borderRadius: 6, overflow: 'hidden', background: '#f0f0f0', border: '1px solid #e0e0e0' }}>
                      {cat.imageUrl
                        ? <img src={cat.imageUrl} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#00aff0,#0090cc)' }} />
                      }
                    </div>
                  </td>
                  <td style={{ fontWeight: 600, color: '#111' }}>{cat.name}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{cat.slug}</td>
                  <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.description || '—'}</td>
                  <td><span className="badge badge-blue">{cat._count.posts}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openEdit(cat)} style={{ padding: '5px 12px', borderRadius: 6, border: '1.5px solid #e0e0e0', fontSize: 12, fontWeight: 600, color: '#555', background: '#fff', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => handleDelete(cat.id, cat.name, cat._count.posts)} style={{ padding: '5px 12px', borderRadius: 6, border: '1.5px solid #fecdd3', fontSize: 12, fontWeight: 600, color: '#e50935', background: '#fff', cursor: 'pointer' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
