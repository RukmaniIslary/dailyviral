'use client';

interface Post { thumbnailUrl: string; }

export default function HeroStripes({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;

  const r1 = [...posts, ...posts, ...posts, ...posts];
  const r2 = [...posts, ...posts, ...posts, ...posts].reverse();
  const r3 = [...posts, ...posts, ...posts, ...posts];

  const row = (items: Post[], dir: 'left' | 'right', speed: number) => (
    <div style={{ overflow: 'hidden', flex: 1 }}>
      <div
        className={dir === 'left' ? 'stripe-left' : 'stripe-right'}
        style={{
          display: 'flex',
          gap: 4,
          height: '100%',
          width: 'max-content',
          animationDuration: `${speed}s`,
        }}
      >
        {items.map((p, i) => (
          <div key={i} style={{ flexShrink: 0, width: 120, height: '100%' }}>
            <img
              src={p.thumbnailUrl}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes stripe-left {
          from { transform: translateX(0); }
          to   { transform: translateX(-25%); }
        }
        @keyframes stripe-right {
          from { transform: translateX(-25%); }
          to   { transform: translateX(0); }
        }
        .stripe-left  { animation: stripe-left  linear infinite; }
        .stripe-right { animation: stripe-right linear infinite; }
      `}</style>

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', gap: 4,
        overflow: 'hidden', pointerEvents: 'none',
        opacity: 0.2,
      }}>
        {row(r1, 'left',  30)}
        {row(r2, 'right', 25)}
        {row(r3, 'left',  35)}
      </div>
    </>
  );
}
