import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: '#1a1a2e', color: '#fff', marginTop: 60 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 16px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, marginBottom: 32 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ background: '#e50935', borderRadius: 6, padding: '4px 8px', fontWeight: 900, fontSize: 12, letterSpacing: 1 }}>DVM</div>
              <span style={{ fontWeight: 800, fontSize: 16 }}>Daily Viral MMS</span>
            </div>
            <p style={{ fontSize: 13, color: '#aaa', lineHeight: 1.6, maxWidth: 260 }}>
              Premier 18+ adult media directory. All content is strictly for adults aged 18 and over.
            </p>
            <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 8, background: '#e50935', padding: '6px 14px', borderRadius: 20 }}>
              <span style={{ fontWeight: 800, fontSize: 13 }}>18+</span>
              <span style={{ fontSize: 12, color: '#ffcdd2' }}>Adults Only</span>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#e50935', marginBottom: 14 }}>Browse</h4>
            {[{ label: 'Home', href: '/' }, { label: 'Trending', href: '/trending' }, { label: 'Latest', href: '/latest' }].map(item => (
              <Link key={item.href} href={item.href} style={{ display: 'block', fontSize: 14, color: '#bbb', marginBottom: 8 }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#bbb')}>
                {item.label}
              </Link>
            ))}
          </div>

          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#e50935', marginBottom: 14 }}>Legal</h4>
            {[
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms of Service', href: '/terms' },
              { label: 'DMCA', href: '/dmca' },
              { label: 'Contact Us', href: '/contact' },
              { label: 'About', href: '/about' },
            ].map(item => (
              <Link key={item.href} href={item.href} style={{ display: 'block', fontSize: 14, color: '#bbb', marginBottom: 8 }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#bbb')}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid #2d2d4e', paddingTop: 20, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 }}>
          <p style={{ fontSize: 12, color: '#666' }}>&copy; {new Date().getFullYear()} Daily Viral MMS. All rights reserved.</p>
          <p style={{ fontSize: 12, color: '#666' }}>All models are 18+. Compliant with 18 U.S.C. 2257.</p>
        </div>
      </div>
    </footer>
  );
}
