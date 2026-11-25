'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Image as ImageIcon, ExternalLink, Tag, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface PostData {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnailUrl: string;
  externalUrl: string;
  categoryId: string;
  isFeatured: boolean;
  status: string;
  tags: Array<{ tag: { name: string } }>;
}

interface Props {
  categories: Category[];
  post?: PostData;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .substring(0, 100);
}

export default function PostForm({ categories, post }: Props) {
  const router = useRouter();
  const isEdit = !!post;

  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [description, setDescription] = useState(post?.description || '');
  const [thumbnailUrl, setThumbnailUrl] = useState(post?.thumbnailUrl || '');
  const [thumbnailPreview, setThumbnailPreview] = useState(post?.thumbnailUrl || '');
  const [thumbnailError, setThumbnailError] = useState(false);
  const [thumbnailLoading, setThumbnailLoading] = useState(false);
  const [externalUrl, setExternalUrl] = useState(post?.externalUrl || '');
  const [categoryId, setCategoryId] = useState(post?.categoryId || '');
  const [tagsInput, setTagsInput] = useState(post?.tags.map((t) => t.tag.name).join(', ') || '');
  const [isFeatured, setIsFeatured] = useState(post?.isFeatured || false);
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>(
    (post?.status as 'DRAFT' | 'PUBLISHED') || 'DRAFT'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [slugManual, setSlugManual] = useState(!!post);

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugManual && title) {
      setSlug(generateSlug(title));
    }
  }, [title, slugManual]);

  // Live image preview with debounce
  useEffect(() => {
    if (!thumbnailUrl) {
      setThumbnailPreview('');
      setThumbnailError(false);
      return;
    }

    const timer = setTimeout(() => {
      setThumbnailLoading(true);
      setThumbnailError(false);
      setThumbnailPreview(thumbnailUrl);
    }, 600);

    return () => clearTimeout(timer);
  }, [thumbnailUrl]);

  async function handleSubmit(submitStatus: 'DRAFT' | 'PUBLISHED') {
    setError('');
    setSuccess('');
    setLoading(true);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title,
      slug,
      description,
      thumbnailUrl,
      externalUrl,
      categoryId,
      tags,
      isFeatured,
      status: submitStatus,
    };

    try {
      const url = isEdit ? `/api/admin/posts/${post!.id}` : '/api/admin/posts';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to save post');
      } else {
        setSuccess(submitStatus === 'PUBLISHED' ? 'Post published!' : 'Draft saved!');
        setTimeout(() => router.push('/admin/posts'), 1200);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title */}
          <div
            className="rounded-xl p-5"
            style={{ background: '#17171D', border: '1px solid #2A2A35' }}
          >
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Post Title <span style={{ color: '#E50935' }}>*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title..."
              className="w-full px-3 py-2.5 rounded-lg text-white placeholder-gray-600 outline-none text-sm"
              style={{ background: '#0B0B0F', border: '1px solid #2A2A35' }}
            />

            <label className="block text-sm font-semibold text-gray-300 mt-4 mb-2">
              URL Slug <span style={{ color: '#E50935' }}>*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
                  setSlugManual(true);
                }}
                placeholder="post-url-slug"
                className="flex-1 px-3 py-2.5 rounded-lg text-white placeholder-gray-600 outline-none text-sm font-mono"
                style={{ background: '#0B0B0F', border: '1px solid #2A2A35' }}
              />
              <button
                type="button"
                onClick={() => { setSlug(generateSlug(title)); setSlugManual(false); }}
                className="px-3 py-2.5 rounded-lg text-xs text-gray-400 hover:text-white transition-colors"
                style={{ background: '#0B0B0F', border: '1px solid #2A2A35' }}
              >
                Auto
              </button>
            </div>
          </div>

          {/* Description */}
          <div
            className="rounded-xl p-5"
            style={{ background: '#17171D', border: '1px solid #2A2A35' }}
          >
            <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              maxLength={2000}
              placeholder="Optional description..."
              className="w-full px-3 py-2.5 rounded-lg text-white placeholder-gray-600 outline-none text-sm resize-none"
              style={{ background: '#0B0B0F', border: '1px solid #2A2A35' }}
            />
            <p className="text-xs text-gray-600 mt-1 text-right">{description.length}/2000</p>
          </div>

          {/* Thumbnail URL */}
          <div
            className="rounded-xl p-5"
            style={{ background: '#17171D', border: '1px solid #2A2A35' }}
          >
            <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
              <ImageIcon size={15} style={{ color: '#E50935' }} />
              Thumbnail Image URL <span style={{ color: '#E50935' }}>*</span>
            </label>
            <input
              type="url"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2.5 rounded-lg text-white placeholder-gray-600 outline-none text-sm font-mono"
              style={{ background: '#0B0B0F', border: '1px solid #2A2A35' }}
            />
            <p className="text-xs text-gray-600 mt-1">
              Paste a direct link to the image. Supports JPG, PNG, WebP, GIF.
            </p>

            {/* Live preview */}
            {thumbnailPreview && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">Preview:</p>
                <div
                  className="relative rounded-xl overflow-hidden aspect-video max-w-sm"
                  style={{ background: '#0B0B0F' }}
                >
                  {thumbnailLoading && !thumbnailError && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 size={20} className="text-gray-500 animate-spin" />
                    </div>
                  )}
                  <img
                    src={thumbnailPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onLoad={() => { setThumbnailLoading(false); setThumbnailError(false); }}
                    onError={() => { setThumbnailLoading(false); setThumbnailError(true); }}
                    style={{ display: thumbnailError ? 'none' : 'block' }}
                  />
                  {thumbnailError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                      <AlertCircle size={20} style={{ color: '#E50935' }} />
                      <p className="text-xs text-gray-500">Could not load image</p>
                    </div>
                  )}
                </div>
                {!thumbnailError && !thumbnailLoading && (
                  <div className="flex items-center gap-1 mt-1 text-xs" style={{ color: '#10B981' }}>
                    <CheckCircle size={12} /> Image loaded successfully
                  </div>
                )}
              </div>
            )}
          </div>

          {/* External URL */}
          <div
            className="rounded-xl p-5"
            style={{ background: '#17171D', border: '1px solid #2A2A35' }}
          >
            <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
              <ExternalLink size={15} style={{ color: '#E50935' }} />
              External Content URL <span style={{ color: '#E50935' }}>*</span>
            </label>
            <input
              type="url"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://example.com/content"
              className="w-full px-3 py-2.5 rounded-lg text-white placeholder-gray-600 outline-none text-sm font-mono"
              style={{ background: '#0B0B0F', border: '1px solid #2A2A35' }}
            />
            <p className="text-xs text-gray-600 mt-1">Must be HTTPS. Visitors will be redirected here.</p>
          </div>

          {/* Tags */}
          <div
            className="rounded-xl p-5"
            style={{ background: '#17171D', border: '1px solid #2A2A35' }}
          >
            <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
              <Tag size={15} style={{ color: '#E50935' }} />
              Tags
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="viral, trending, mms (comma-separated)"
              className="w-full px-3 py-2.5 rounded-lg text-white placeholder-gray-600 outline-none text-sm"
              style={{ background: '#0B0B0F', border: '1px solid #2A2A35' }}
            />
          </div>
        </div>

        {/* Sidebar options */}
        <div className="space-y-5">
          {/* Category */}
          <div
            className="rounded-xl p-5"
            style={{ background: '#17171D', border: '1px solid #2A2A35' }}
          >
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Category <span style={{ color: '#E50935' }}>*</span>
            </label>
            {categories.length === 0 ? (
              <div className="p-3 rounded-lg text-sm text-gray-500" style={{ background: '#0B0B0F' }}>
                No categories yet.{' '}
                <a href="/admin/categories" className="underline" style={{ color: '#E50935' }}>
                  Create one
                </a>
              </div>
            ) : (
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-white outline-none text-sm"
                style={{ background: '#0B0B0F', border: '1px solid #2A2A35' }}
              >
                <option value="">Select category...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Options */}
          <div
            className="rounded-xl p-5"
            style={{ background: '#17171D', border: '1px solid #2A2A35' }}
          >
            <h3 className="text-sm font-semibold text-gray-300 mb-4">Options</h3>

            <label className="flex items-center gap-3 cursor-pointer mb-3">
              <div
                className="relative w-10 h-6 rounded-full transition-colors"
                style={{ background: isFeatured ? '#E50935' : '#2A2A35' }}
                onClick={() => setIsFeatured(!isFeatured)}
              >
                <div
                  className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"
                  style={{ transform: isFeatured ? 'translateX(20px)' : 'translateX(4px)' }}
                />
              </div>
              <span className="text-sm text-gray-300">Featured Post</span>
            </label>
          </div>

          {/* Error / Success */}
          {error && (
            <div className="rounded-xl p-4 flex items-start gap-2" style={{ background: 'rgba(229,9,53,0.1)', border: '1px solid rgba(229,9,53,0.3)' }}>
              <AlertCircle size={16} style={{ color: '#E50935', flexShrink: 0, marginTop: 1 }} />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {success && (
            <div className="rounded-xl p-4 flex items-start gap-2" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
              <CheckCircle size={16} style={{ color: '#10B981', flexShrink: 0, marginTop: 1 }} />
              <p className="text-sm text-green-400">{success}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handleSubmit('PUBLISHED')}
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: '#E50935' }}
            >
              {loading ? 'Saving...' : 'Publish Now'}
            </button>
            <button
              onClick={() => handleSubmit('DRAFT')}
              disabled={loading}
              className="w-full py-3 rounded-xl font-medium text-gray-300 text-sm transition-colors hover:text-white"
              style={{ background: '#0B0B0F', border: '1px solid #2A2A35' }}
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/posts')}
              className="w-full py-2 text-sm text-gray-600 hover:text-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
