'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Category { id: string; name: string; }

interface PostData {
  id: string; title: string; slug: string; description: string | null;
  thumbnailUrl: string; externalUrl: string; categoryId: string;
  isFeatured: boolean; status: string;
  tags: Array<{ tag: { name: string } }>;
}

function generateSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim().substring(0, 100);
}

const inputStyle = {
  width: '100%', padding: '11px 14px', borderRadius: 8,
  border: '1.5px solid #e0e0e0', fontSize: 14, color: '#111',
  background: '#fff', outline: 'none', boxSizing: 'border-box' as const,
};

const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 7 } as const;

export default function PostForm({ categories, post }: { categories: Category[]; post?: PostData }) {
  const router = useRouter();
  const isEdit = !!post;

  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [slugManual, setSlugManual] = useState(!!post);
  const [description, setDescription] = useState(post?.description || '');
  const [thumbnailUrl, setThumbnailUrl] = useState(post?.thumbnailUrl || '');
  const [previewSrc, setPreviewSrc] = useState(post?.thumbnailUrl || '');
  const [previewError, setPreviewError] = useState(false);
  const [externalUrl, setExternalUrl] = useState(post?.externalUrl || '');
  const [categoryId, setCategoryId] = useState(post?.categoryId || '');
  const [tagsInput, setTagsInput] = useState(post?.tags.map(t => t.tag.name).join(', ') || '');
  const [isFeatured, setIsFeatured] = useState(post?.isFeatured || false);
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>((post?.status as 'DRAFT' | 'PUBLISHED') || 'DRAFT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!slugManual && title) setSlug(generateSlug(title));
  }, [title, slugManual]);

  useEffect(() => {
    if (!thumbnailUrl) { setPreviewSrc(''); setPreviewError(false); return; }
    const t = setTimeout(() => { setPreviewSrc(thumbnailUrl); setPreviewError(false); }, 700);
    return () => clearTimeout(t);
  }, [thumbnailUrl]);

  async function handleSubmit(submitStatus: 'DRAFT' | 'PUBLISHED') {
    setError(''); setSuccess(''); setLoading(true);
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const payload = { title, slug, description, thumbnailUrl, externalUrl, categoryId, tags, isFeatured, status: submitStatus };
    try {
      const url = isEdit ? `/api/admin/posts/${post!.id}` : '/api/admin/posts';
      const res = await fetch(url, { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) setError(data.error || 'Failed to save');
      else { setSuccess(submitStatus === 'PUBLISHED' ? 'Post published successfully!' : 'Draft saved!'); setTimeout(() => router.push('/admin/posts'), 1000); }
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ maxWidth: 860 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'start' }}>

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Title + Slug */}
          <div style={{ background: '#fff', border: '1.5px solid #e8e8e8', borderRadius: 12, padding: 24 }}>
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Post Title <span style={{ color: '#e50935' }}>*</span></label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter post title..."
                style={inputStyle} onFocus={e => (e.target.style.borderColor = '#00aff0')} onBlur={e => (e.target.style.borderColor = '#e0e0e0')} />
            </div>
            <div>
              <label style={labelStyle}>URL Slug <span style={{ color: '#e50935' }}>*</span></label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="text" value={slug} onChange={e => { setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')); setSlugManual(true); }}
                  placeholder="post-url-slug" style={{ ...inputStyle, flex: 1, fontFamily: 'monospace', fontSize: 13 }}
                  onFocus={e => (e.target.style.borderColor = '#00aff0')} onBlur={e => (e.target.style.borderColor = '#e0e0e0')} />
                <button type="button" onClick={() => { setSlug(generateSlug(title)); setSlugManual(false); }}
                  style={{ padding: '11px 16px', borderRadius: 8, border: '1.5px solid #e0e0e0', background: '#f7f7f7', fontSize: 13, fontWeight: 600, color: '#555', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  Auto
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={{ background: '#fff', border: '1.5px solid #e8e8e8', borderRadius: 12, padding: 24 }}>
            <label style={labelStyle}>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} maxLength={2000}
              placeholder="Optional description of the post..."
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
              onFocus={e => (e.target.style.borderColor = '#00aff0')} onBlur={e => (e.target.style.borderColor = '#e0e0e0')} />
            <p style={{ fontSize: 11, color: '#ccc', textAlign: 'right', marginTop: 4 }}>{description.length} / 2000</p>
          </div>

          {/* Thumbnail URL */}
          <div style={{ background: '#fff', border: '1.5px solid #e8e8e8', borderRadius: 12, padding: 24 }}>
            <label style={labelStyle}>Thumbnail Image URL <span style={{ color: '#e50935' }}>*</span></label>
            <input type="url" value={thumbnailUrl} onChange={e => setThumbnailUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              style={{ ...inputStyle, fontFamily: 'monospace', fontSize: 13 }}
              onFocus={e => (e.target.style.borderColor = '#00aff0')} onBlur={e => (e.target.style.borderColor = '#e0e0e0')} />
            <p style={{ fontSize: 12, color: '#aaa', marginTop: 6 }}>Paste a direct link to any JPG, PNG, WebP or GIF image.</p>

            {/* Live preview */}
            {previewSrc && (
              <div style={{ marginTop: 16 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 8 }}>Image Preview</p>
                <div style={{ position: 'relative', aspectRatio: '16/9', background: '#f5f5f5', borderRadius: 8, overflow: 'hidden', maxWidth: 360 }}>
                  {!previewError ? (
                    <img src={previewSrc} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onLoad={() => setPreviewError(false)} onError={() => setPreviewError(true)} />
                  ) : (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#fff0f3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: '#e50935', fontSize: 18, fontWeight: 900 }}>!</span>
                      </div>
                      <p style={{ fontSize: 12, color: '#e50935', fontWeight: 600 }}>Could not load image</p>
                    </div>
                  )}
                </div>
                {!previewError && (
                  <p style={{ fontSize: 11, color: '#10b981', marginTop: 6, fontWeight: 600 }}>Image loaded successfully</p>
                )}
              </div>
            )}
          </div>

          {/* External URL */}
          <div style={{ background: '#fff', border: '1.5px solid #e8e8e8', borderRadius: 12, padding: 24 }}>
            <label style={labelStyle}>External Content URL <span style={{ color: '#e50935' }}>*</span></label>
            <input type="url" value={externalUrl} onChange={e => setExternalUrl(e.target.value)}
              placeholder="https://example.com/content"
              style={{ ...inputStyle, fontFamily: 'monospace', fontSize: 13 }}
              onFocus={e => (e.target.style.borderColor = '#00aff0')} onBlur={e => (e.target.style.borderColor = '#e0e0e0')} />
            <p style={{ fontSize: 12, color: '#aaa', marginTop: 6 }}>Must be HTTPS. Visitors will be sent to this URL when they click Watch Now.</p>
          </div>

          {/* Tags */}
          <div style={{ background: '#fff', border: '1.5px solid #e8e8e8', borderRadius: 12, padding: 24 }}>
            <label style={labelStyle}>Tags</label>
            <input type="text" value={tagsInput} onChange={e => setTagsInput(e.target.value)}
              placeholder="viral, trending, mms (comma separated)"
              style={inputStyle} onFocus={e => (e.target.style.borderColor = '#00aff0')} onBlur={e => (e.target.style.borderColor = '#e0e0e0')} />
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Category */}
          <div style={{ background: '#fff', border: '1.5px solid #e8e8e8', borderRadius: 12, padding: 20 }}>
            <label style={labelStyle}>Category <span style={{ color: '#e50935' }}>*</span></label>
            {categories.length === 0 ? (
              <div style={{ padding: '10px 14px', background: '#f7f7f7', borderRadius: 8, fontSize: 13, color: '#999' }}>
                No categories yet. <a href="/admin/categories" style={{ color: '#00aff0', fontWeight: 600 }}>Create one</a>
              </div>
            ) : (
              <select value={categoryId} onChange={e => setCategoryId(e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={e => (e.target.style.borderColor = '#00aff0')} onBlur={e => (e.target.style.borderColor = '#e0e0e0')}>
                <option value="">Select category...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            )}
          </div>

          {/* Options */}
          <div style={{ background: '#fff', border: '1.5px solid #e8e8e8', borderRadius: 12, padding: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 14 }}>Options</p>
            <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
              <div
                onClick={() => setIsFeatured(!isFeatured)}
                style={{ width: 44, height: 24, borderRadius: 12, background: isFeatured ? '#00aff0' : '#e0e0e0', position: 'relative', transition: 'background .2s', cursor: 'pointer', flexShrink: 0 }}>
                <div style={{ position: 'absolute', top: 3, left: isFeatured ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
              </div>
              <span style={{ fontSize: 14, color: '#333', fontWeight: 500 }}>Featured Post</span>
            </label>
          </div>

          {/* Error / Success */}
          {error && (
            <div style={{ background: '#fff0f3', border: '1px solid #fecdd3', borderRadius: 10, padding: '12px 16px' }}>
              <p style={{ fontSize: 13, color: '#e50935', fontWeight: 500 }}>{error}</p>
            </div>
          )}
          {success && (
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 10, padding: '12px 16px' }}>
              <p style={{ fontSize: 13, color: '#10b981', fontWeight: 600 }}>{success}</p>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={() => handleSubmit('PUBLISHED')} disabled={loading}
              style={{ width: '100%', padding: '13px', borderRadius: 10, background: '#00aff0', color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '0 2px 10px rgba(0,175,240,0.3)' }}>
              {loading ? 'Saving...' : 'Publish Now'}
            </button>
            <button onClick={() => handleSubmit('DRAFT')} disabled={loading}
              style={{ width: '100%', padding: '12px', borderRadius: 10, background: '#fff', color: '#555', fontSize: 14, fontWeight: 600, border: '1.5px solid #e0e0e0', cursor: loading ? 'not-allowed' : 'pointer' }}>
              Save as Draft
            </button>
            <button type="button" onClick={() => router.push('/admin/posts')}
              style={{ width: '100%', padding: '10px', borderRadius: 10, background: 'none', color: '#aaa', fontSize: 13, border: 'none', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .post-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
