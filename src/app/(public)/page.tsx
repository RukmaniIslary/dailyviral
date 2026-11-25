import { prisma } from '@/lib/db/prisma';
import PostGrid from '@/components/posts/PostGrid';
import HeroStripes from '@/components/ui/HeroStripes';
import Link from 'next/link';

export const revalidate = 60;
export const dynamic = 'force-dynamic';

async function getData() {
  const [latest, trending, featured, mostViewed, categories] = await Promise.all([
    prisma.post.findMany({ where: { status: 'PUBLISHED' }, orderBy: { publishedAt: 'desc' }, take: 12, include: { category: { select: { name: true, slug: true } } } }),
    prisma.post.findMany({ where: { status: 'PUBLISHED' }, orderBy: { clicks: 'desc' }, take: 8, include: { category: { select: { name: true, slug: true } } } }),
    prisma.post.findMany({ where: { status: 'PUBLISHED', isFeatured: true }, orderBy: { publishedAt: 'desc' }, take: 6, include: { category: { select: { name: true, slug: true } } } }),
    prisma.post.findMany({ where: { status: 'PUBLISHED' }, orderBy: { views: 'desc' }, take: 8, include: { category: { select: { name: true, slug: true } } } }),
    prisma.category.findMany({ orderBy: { name: 'asc' }, include: { _count: { select: { posts: { where: { status: 'PUBLISHED' } } } } } }),
  ]);
  return { latest, trending, featured, mostViewed, categories };
}

function SectionHead({ title, href }: { title: string; href?: string }) {
  return (
    <div className="section-header">
      <h2 className="section-title">{title}</h2>
      {href && <Link href={href} style={{ fontSize: 13, fontWeight: 700, color: '#00aff0', border: '1.5px solid #00aff0', padding: '6px 18px', borderRadius: 25 }}>View All</Link>}
    </div>
  );
}

export default async function HomePage() {
  const { latest, trending, featured, mostViewed, categories } = await getData();

  return (
    <div style={{ background: '#f7f7f7', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0d0d1a 0%, #001f3f 60%, #003366 100%)', padding: '80px 20px', overflow: 'hidden', position: 'relative', minHeight: 380 }}>

        {/* Animated stripes background */}
        <HeroStripes posts={latest} />

        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <span style={{ display: 'inline-block', background: 'rgba(0,175,240,0.15)', border: '1px solid rgba(0,175,240,0.4)', color: '#00aff0', fontSize: 12, fontWeight: 700, padding: '5px 18px', borderRadius: 25, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20 }}>
            18+ Adult Media Directory
          </span>
          <h1 style={{ fontSize: 'clamp(32px,5vw,58px)', fontWeight: 900, color: '#fff', marginBottom: 16, lineHeight: 1.1 }}>
            Daily Viral <span style={{ color: '#00aff0' }}>MMS</span>
          </h1>
          <p style={{ fontSize: 16, color: '#94a3b8', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Discover the hottest trending viral content. Updated daily.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56 }}>
            <Link href="/trending" className="btn-primary">View Trending</Link>
            <Link href="/latest" className="btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>Latest Posts</Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '44px 20px' }}>

        {/* Categories */}
        {categories.length > 0 && (
          <div style={{ marginBottom: 52 }}>
            <SectionHead title="Browse Categories" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {categories.map(c => (
                <Link key={c.id} href={`/category/${c.slug}`} className="cat-pill">
                  {c.name}
                  <span style={{ background: '#00aff0', color: '#fff', fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 25 }}>
                    {c._count.posts}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {featured.length > 0 && (
          <div style={{ marginBottom: 52 }}>
            <SectionHead title="Featured" href="/latest?featured=true" />
            <PostGrid posts={JSON.parse(JSON.stringify(featured))} columns={3} />
          </div>
        )}

        {latest.length > 0 && (
          <div style={{ marginBottom: 52 }}>
            <SectionHead title="Latest Posts" href="/latest" />
            <PostGrid posts={JSON.parse(JSON.stringify(latest))} columns={4} />
          </div>
        )}

        {trending.length > 0 && (
          <div style={{ marginBottom: 52 }}>
            <SectionHead title="Trending Now" href="/trending" />
            <PostGrid posts={JSON.parse(JSON.stringify(trending))} columns={4} />
          </div>
        )}

        {mostViewed.length > 0 && (
          <div style={{ marginBottom: 52 }}>
            <SectionHead title="Most Viewed" />
            <PostGrid posts={JSON.parse(JSON.stringify(mostViewed))} columns={4} />
          </div>
        )}

        {latest.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#e6f7fe', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00aff0" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 8 }}>No Content Yet</h2>
            <p style={{ color: '#999', marginBottom: 24 }}>Check back soon or add content via the admin panel.</p>
            <Link href="/admin/login" className="btn-primary">Admin Login</Link>
          </div>
        )}
      </div>
    </div>
  );
}
