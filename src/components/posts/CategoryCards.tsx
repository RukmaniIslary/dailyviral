import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  _count: { posts: number };
}

// Gradient fallbacks per card index
const gradients = [
  'linear-gradient(135deg,#e50935,#9b0a24)',
  'linear-gradient(135deg,#00aff0,#0070c0)',
  'linear-gradient(135deg,#7c3aed,#4c1d95)',
  'linear-gradient(135deg,#f59e0b,#b45309)',
  'linear-gradient(135deg,#10b981,#065f46)',
  'linear-gradient(135deg,#ec4899,#9d174d)',
  'linear-gradient(135deg,#06b6d4,#0e7490)',
  'linear-gradient(135deg,#8b5cf6,#5b21b6)',
];

export default function CategoryCards({ categories }: { categories: Category[] }) {
  if (!categories.length) return null;

  return (
    <>
      <style>{`
        .cat-card { transition: transform .2s, box-shadow .2s; }
        .cat-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.15); }
        .cat-card:hover .cat-overlay { opacity: 0.5 !important; }
        @media (max-width: 600px) {
          .cat-cards-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
      <div className="cat-cards-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 14,
      }}>
        {categories.map((cat, i) => (
          <Link key={cat.id} href={`/category/${cat.slug}`} className="cat-card" style={{
            display: 'block',
            borderRadius: 14,
            overflow: 'hidden',
            position: 'relative',
            aspectRatio: '16/10',
            textDecoration: 'none',
            background: gradients[i % gradients.length],
          }}>
            {/* Cover image */}
            {cat.imageUrl && (
              <img
                src={cat.imageUrl}
                alt={cat.name}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}

            {/* Dark overlay */}
            <div className="cat-overlay" style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
              opacity: 0.75,
              transition: 'opacity .2s',
            }} />

            {/* Text */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: '10px 12px',
            }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', lineHeight: 1.3, marginBottom: 3 }}>
                {cat.name}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>
                {cat._count.posts.toLocaleString()} posts
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
