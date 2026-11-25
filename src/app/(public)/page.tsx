import { prisma } from '@/lib/db/prisma';
import PostGrid from '@/components/posts/PostGrid';
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
      include: { _count: { select: { posts: { where: { status: 'PUBLISHED' } } } } },
    }),
  ]);
  return { latest, trending, featured, mostViewed, categories };
}

function SectionTitle({ title, href }: { title: string; href?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 4, height: 24, background: '#e50935', borderRadius: 2 }} />
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1a1a2e' }}>{title}</h2>
      </div>
      {href && (
        <Link href={href} style={{ fontSize: 13, fontWeight: 700, color: '#e50935', padding: '6px 16px', border: '1.5px solid #e50935', borderRadius: 20 }}>
          View All
        </Link>
      )}
    </div>
  );
}

export default async function HomePage() {
  const { latest, trending, featured, mostViewed, categories } = await getHomepageData();

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', padding: '48px 16px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#e50935', padding: '6px 16px', borderRadius: 20, marginBottom: 20 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>&#128293; 18+ Adult Media Directory</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, color: '#fff', marginBottom: 16, lineHeight: 1.1 }}>
            Daily <span style={{ color: '#e50935' }}>Viral</span> MMS
          </h1>
          <p style={{ fontSize: 16, color: '#94a3b8', maxWidth: 500, margin: '0 auto 28px', lineHeight: 1.6 }}>
            Discover the hottest trending viral content. Updated daily with the latest MMS and media.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/trending" style={{ background: '#e50935', color: '#fff', padding: '12px 28px', borderRadius: 28, fontWeight: 700, fontSize: 15, display: 'inline-block' }}>
              &#128293; View Trending
            </Link>
            <Link href="/latest" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '12px 28px', borderRadius: 28, fontWeight: 700, fontSize: 15, border: '1.5px solid rgba(255,255,255,0.2)', display: 'inline-block' }}>
              &#128337; Latest Posts
            </Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 16px' }}>

        {/* Categories */}
        {categories.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <SectionTitle title="Browse Categories" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {categories.map(cat => (
                <Link key={cat.id} href={`/category/${cat.slug}`}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 24, background: '#fff', border: '1.5px solid #eee', fontSize: 14, fontWeight: 600, color: '#1a1a2e', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                  {cat.name}
                  <span style={{ background: '#e50935', color: '#fff', fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 12 }}>
                    {cat._count.posts}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Featured */}
        {featured.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <SectionTitle title="Featured Posts" href="/latest?featured=true" />
            <PostGrid posts={JSON.parse(JSON.stringify(featured))} columns={3} />
          </div>
        )}

        {/* Latest */}
        {latest.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <SectionTitle title="Latest Posts" href="/latest" />
            <PostGrid posts={JSON.parse(JSON.stringify(latest))} columns={4} />
          </div>
        )}

        {/* Trending */}
        {trending.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <SectionTitle title="Trending Now" href="/trending" />
            <PostGrid posts={JSON.parse(JSON.stringify(trending))} columns={4} />
          </div>
        )}

        {/* Most Viewed */}
        {mostViewed.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <SectionTitle title="Most Viewed" />
            <PostGrid posts={JSON.parse(JSON.stringify(mostViewed))} columns={4} />
          </div>
        )}

        {latest.length === 0 && trending.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>&#127916;</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a2e', marginBottom: 8 }}>No Content Yet</h2>
            <p style={{ color: '#999', marginBottom: 24 }}>Check back soon for fresh viral content.</p>
            <Link href="/admin/login" style={{ background: '#e50935', color: '#fff', padding: '10px 24px', borderRadius: 24, fontWeight: 700, fontSize: 14 }}>
              Admin Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
