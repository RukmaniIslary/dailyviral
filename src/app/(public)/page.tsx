import { prisma } from '@/lib/db/prisma';
import PostGrid from '@/components/posts/PostGrid';
import SectionHeader from '@/components/ui/SectionHeader';
import { TrendingUp, Clock, Star, Flame, Grid3X3 } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 60;
export const dynamic = 'force-dynamic';

async function getHomepageData() {
  const [latest, trending, featured, mostViewed, categories] = await Promise.all([
    prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 12,
      include: { category: { select: { name: true, slug: true } } },
    }),
    prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { clicks: 'desc' },
      take: 8,
      include: { category: { select: { name: true, slug: true } } },
    }),
    prisma.post.findMany({
      where: { status: 'PUBLISHED', isFeatured: true },
      orderBy: { publishedAt: 'desc' },
      take: 6,
      include: { category: { select: { name: true, slug: true } } },
    }),
    prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { views: 'desc' },
      take: 8,
      include: { category: { select: { name: true, slug: true } } },
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { posts: { where: { status: 'PUBLISHED' } } } },
      },
    }),
  ]);

  return { latest, trending, featured, mostViewed, categories };
}

export default async function HomePage() {
  const { latest, trending, featured, mostViewed, categories } = await getHomepageData();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <div
        className="relative overflow-hidden rounded-2xl mb-10 p-8 md:p-12"
        style={{
          background: 'linear-gradient(135deg, #17171D 0%, #1a0812 50%, #17171D 100%)',
          border: '1px solid #2A2A35',
        }}
      >
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20"
          style={{ background: '#E50935' }}
        />
        <div className="relative z-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold text-white mb-4"
            style={{ background: 'rgba(229,9,53,0.2)', border: '1px solid rgba(229,9,53,0.3)' }}
          >
            <Flame size={12} style={{ color: '#E50935' }} />
            18+ Adult Media Directory
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-3">
            Daily <span style={{ color: '#E50935' }}>Viral</span> MMS
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-xl">
            Discover the hottest trending viral content. Updated daily with the latest MMS and media.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/trending"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90"
              style={{ background: '#E50935' }}
            >
              <TrendingUp size={16} /> View Trending
            </Link>
            <Link
              href="/latest"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:bg-white/10"
              style={{ border: '1px solid #2A2A35', color: '#9CA3AF' }}
            >
              <Clock size={16} /> Latest Posts
            </Link>
          </div>
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="mb-10">
          <SectionHeader title="Browse Categories" icon={<Grid3X3 size={16} />} />
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:-translate-y-0.5"
                style={{ background: '#17171D', border: '1px solid #2A2A35', color: '#9CA3AF' }}
              >
                {cat.name}
                <span
                  className="text-xs px-1.5 py-0.5 rounded font-bold"
                  style={{ background: '#E50935', color: '#fff' }}
                >
                  {cat._count.posts}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <div className="mb-10">
          <SectionHeader title="Featured Posts" icon={<Star size={16} />} viewAllHref="/latest?featured=true" />
          <PostGrid posts={featured} columns={3} />
        </div>
      )}

      {/* Latest */}
      {latest.length > 0 && (
        <div className="mb-10">
          <SectionHeader title="Latest Posts" icon={<Clock size={16} />} viewAllHref="/latest" />
          <PostGrid posts={latest} columns={4} />
        </div>
      )}

      {/* Trending */}
      {trending.length > 0 && (
        <div className="mb-10">
          <SectionHeader title="Trending Now" icon={<TrendingUp size={16} />} viewAllHref="/trending" />
          <PostGrid posts={trending} columns={4} />
        </div>
      )}

      {/* Most Viewed */}
      {mostViewed.length > 0 && (
        <div className="mb-10">
          <SectionHeader title="Most Viewed" icon={<Flame size={16} />} />
          <PostGrid posts={mostViewed} columns={4} />
        </div>
      )}

      {latest.length === 0 && trending.length === 0 && (
        <div className="py-20 text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: '#17171D' }}
          >
            <Flame size={32} className="text-gray-600" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No Content Yet</h2>
          <p className="text-gray-500">Check back soon for fresh viral content.</p>
        </div>
      )}
    </div>
  );
}
