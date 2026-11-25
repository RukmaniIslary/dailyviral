'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Grid3X3, X, Check } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: { posts: number };
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default function CategoriesClient({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function openCreate() {
    setEditId(null);
    setForm({ name: '', slug: '', description: '' });
    setError('');
    setShowForm(true);
  }

  function openEdit(cat: Category) {
    setEditId(cat.id);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || '' });
    setError('');
    setShowForm(true);
  }

  async function handleSave() {
    setError('');
    if (!form.name.trim()) { setError('Name is required'); return; }
    if (!form.slug.trim()) { setError('Slug is required'); return; }

    setLoading(true);
    try {
      const url = editId ? `/api/admin/categories/${editId}` : '/api/admin/categories';
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to save');
      } else {
        if (editId) {
          setCategories((prev) =>
            prev.map((c) =>
              c.id === editId ? { ...data.category, _count: { posts: c._count.posts } } : c
            )
          );
        } else {
          setCategories((prev) => [...prev, { ...data.category, _count: { posts: 0 } }]);
        }
        setShowForm(false);
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, name: string, postCount: number) {
    if (postCount > 0) {
      alert(`Cannot delete "${name}" – it has ${postCount} posts. Reassign them first.`);
      return;
    }
    if (!confirm(`Delete category "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || 'Delete failed');
      }
    } catch {
      alert('Network error');
    }
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Categories</h1>
          <p className="text-gray-500 text-sm">{categories.length} categories</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: '#E50935' }}
        >
          <Plus size={16} /> New Category
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div
          className="rounded-xl p-5 mb-6"
          style={{ background: '#17171D', border: '1px solid #2A2A35' }}
        >
          <h2 className="font-semibold text-white mb-4">{editId ? 'Edit Category' : 'New Category'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => {
                  setForm((f) => ({
                    ...f,
                    name: e.target.value,
                    slug: f.slug || generateSlug(e.target.value),
                  }));
                }}
                placeholder="Category Name"
                className="w-full px-3 py-2.5 rounded-lg text-white placeholder-gray-600 outline-none text-sm"
                style={{ background: '#0B0B0F', border: '1px solid #2A2A35' }}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Slug *</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                placeholder="category-slug"
                className="w-full px-3 py-2.5 rounded-lg text-white placeholder-gray-600 outline-none text-sm font-mono"
                style={{ background: '#0B0B0F', border: '1px solid #2A2A35' }}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-gray-500 mb-1.5">Description</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Optional description"
                className="w-full px-3 py-2.5 rounded-lg text-white placeholder-gray-600 outline-none text-sm"
                style={{ background: '#0B0B0F', border: '1px solid #2A2A35' }}
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-400 mt-3">{error}</p>}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
              style={{ background: '#E50935' }}
            >
              <Check size={14} /> {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white transition-colors"
              style={{ background: '#0B0B0F', border: '1px solid #2A2A35' }}
            >
              <X size={14} /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Categories list */}
      <div className="rounded-xl overflow-hidden" style={{ background: '#17171D', border: '1px solid #2A2A35' }}>
        {categories.length === 0 ? (
          <div className="py-16 text-center">
            <Grid3X3 size={32} className="text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500">No categories yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #2A2A35' }}>
                {['Name', 'Slug', 'Description', 'Posts', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="hover:bg-white/5 transition-colors"
                  style={{ borderBottom: '1px solid #1E1E26' }}
                >
                  <td className="px-4 py-3 text-white font-medium">{cat.name}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{cat.slug}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{cat.description || '-'}</td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-1 rounded text-xs font-medium"
                      style={{ background: '#2A2A35', color: '#9CA3AF' }}
                    >
                      {cat._count.posts}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(cat)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name, cat._count.posts)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-900/10 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
