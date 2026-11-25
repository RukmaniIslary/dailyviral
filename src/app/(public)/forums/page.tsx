import { prisma } from '@/lib/db/prisma';
import Link from 'next/link';

export const metadata = { title: 'Forums – Daily Viral MMS' };

export default async function ForumsPage() {
  const groups = await prisma.forumGroup.findMany({
    orderBy: { order: 'asc' },
    include: { forums: { orderBy: { order: 'asc' } } },
  });

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 16px 60px' }}>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: '#111', marginBottom: 24 }}>Forums</h1>

      {groups.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#999', fontSize: 15 }}>
          No forums yet. Check back soon.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {groups.map(group => (
          <div key={group.id} style={{ border: '1px solid #e0e0e0', borderRadius: 10, overflow: 'hidden' }}>

            {/* Group header */}
            <div style={{
              background: 'linear-gradient(135deg, #1a73e8, #0d5fc4)',
              padding: '11px 18px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: '#ff4444', fontSize: 16 }}>⊗</span>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: 15, letterSpacing: 0.3 }}>
                  {group.name}
                </span>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
            </div>

            {/* Forums list */}
            {group.forums.length === 0 ? (
              <div style={{ padding: '16px 20px', fontSize: 13, color: '#aaa', background: '#fff' }}>
                No forums in this group yet.
              </div>
            ) : (
              group.forums.map((forum, i) => (
                <div key={forum.id} style={{
                  background: '#fff',
                  borderTop: i === 0 ? 'none' : '1px solid #f0f0f0',
                  padding: '14px 18px',
                  display: 'flex', alignItems: 'center', gap: 14,
                }}>
                  {/* Thumbnail */}
                  <div style={{
                    width: 54, height: 54, flexShrink: 0,
                    borderRadius: 6, overflow: 'hidden',
                    background: '#f0f0f0',
                    border: '1px solid #e0e0e0',
                  }}>
                    {forum.imageUrl ? (
                      <img src={forum.imageUrl} alt={forum.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/></svg>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link href={`/forums/${forum.slug}`} style={{
                      fontSize: 15, fontWeight: 700, color: '#1a1a2e',
                      display: 'block', marginBottom: 3,
                    }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#1a73e8')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#1a1a2e')}>
                      {forum.name}
                    </Link>
                    {forum.description && (
                      <p style={{ fontSize: 12, color: '#777', lineHeight: 1.5, margin: 0 }}>
                        {forum.description}
                      </p>
                    )}
                  </div>

                  {/* Post count */}
                  <div style={{ textAlign: 'center', flexShrink: 0, minWidth: 56 }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#111' }}>
                      {forum.postCount >= 1000 ? `${(forum.postCount / 1000).toFixed(1)}k` : forum.postCount}
                    </div>
                    <div style={{ fontSize: 10, color: '#aaa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>posts</div>
                  </div>
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
