import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: '#111', color: '#fff', marginTop: 72 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '52px 20px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 36 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ background: 'linear-gradient(135deg, #00aff0, #0090cc)', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontWeight: 900, fontSize: 11 }}>DV</span>
              </div>
              <span style={{ fontWeight: 800, fontSize: 15 }}>Daily Viral MMS</span>
            </div>
            <p style={{ fontSize: 13, color: '#888', lineHeight: 1.7, maxWidth: 260 }}>
              Premier 18+ adult media directory. All content is strictly for adults aged 18 and over.
            </p>
            <div style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,175,240,0.15)', border: '1px solid rgba(0,175,240,0.3)', padding: '6px 14px', borderRadius: 25 }}>
              <span style={{ fontWeight: 800, fontSize: 12, color: '#00aff0' }}>18+</span>
              <span style={{ fontSize: 12, color: '#888' }}>Adults Only</span>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: '#00aff0', marginBottom: 16 }}>Browse</h4>
            {[{ label: 'Home', href: '/' }, { label: 'Trending', href: '/trending' }, { label: 'Latest', href: '/latest' }].map(item => (
              <Link key={item.href} href={item.href} style={{ display: 'block', fontSize: 14, color: '#888', marginBottom: 10 }}>
                {item.label}
              </Link>
            ))}
          </div>

          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: '#00aff0', marginBottom: 16 }}>Legal</h4>
            {[
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms of Service', href: '/terms' },
              { label: 'DMCA', href: '/dmca' },
              { label: 'Contact Us', href: '/contact' },
              { label: 'About', href: '/about' },
            ].map(item => (
              <Link key={item.href} href={item.href} style={{ display: 'block', fontSize: 14, color: '#888', marginBottom: 10 }}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid #222', paddingTop: 24, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 }}>
          <p style={{ fontSize: 12, color: '#555' }}>&copy; {new Date().getFullYear()} Daily Viral MMS. All rights reserved.</p>
          <p style={{ fontSize: 12, color: '#555' }}>All models are 18+. Compliant with 18 U.S.C. 2257.</p>
        </div>
      </div>
    </footer>
  );
}
