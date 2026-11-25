'use client';

interface Post { thumbnailUrl: string; }

export default function HeroStripes({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;

  // Triple the array so the loop is seamless
  const row1 = [...posts, ...posts, ...posts];
  const row2 = [...posts, ...posts, ...posts].reverse();

  return (
    <>
      <style>{`
        @keyframes scroll-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes scroll-right {
          0%   { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }
        .stripe-left  { animation: scroll-left  28s linear infinite; }
        .stripe-right { animation: scroll-right 24s linear infinite; }
      `}</style>

      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', opacity: 0.22 }}>

        {/* Row 1 — scrolls left */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', overflow: 'hidden' }}>
          <div className="stripe-left" style={{ display: 'flex', gap: 4, height: '100%', width: 'max-content' }}>
            {row1.map((p, i) => (
              <div key={i} style={{ flexShrink: 0, width: 130, height: '100%' }}>
                <img src={p.thumbnailUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls right */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', overflow: 'hidden' }}>
          <div className="stripe-right" style={{ display: 'flex', gap: 4, height: '100%', width: 'max-content' }}>
            {row2.map((p, i) => (
              <div key={i} style={{ flexShrink: 0, width: 130, height: '100%' }}>
                <img src={p.thumbnailUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
