import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'About Us – Daily Viral MMS' };

export default function AboutPage() {
  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 20px 80px' }}>

        <div style={{ borderBottom: '2px solid #111', paddingBottom: 20, marginBottom: 36 }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#111', marginBottom: 6 }}>About Daily Viral MMS</h1>
          <div style={{ width: 48, height: 4, background: '#e50935', borderRadius: 2 }} />
        </div>

        <p style={{ fontSize: 15, color: '#444', lineHeight: 1.8, marginBottom: 24 }}>
          Daily Viral MMS is an 18+ adult media directory dedicated to curating and sharing viral adult content.
          Our platform provides a safe, organized, and professional environment for adults to discover trending media.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            {
              title: 'Our Mission',
              content: 'We provide a directory of adult content with strict compliance standards. We only list content that depicts consenting adults and complies with all applicable laws and regulations.',
            },
            {
              title: 'Content Policy',
              list: [
                'All content depicts consenting adults aged 18 or older.',
                'We do not host, store, or upload any media files.',
                'We operate as a directory and index only.',
                'Content is strictly screened before listing.',
                'We respond to all DMCA and legal requests promptly.',
              ],
            },
            {
              title: '18 U.S.C. 2257 Compliance',
              content: 'Daily Viral MMS is a directory and does not produce any content. All content linked from this site is produced by third parties. All models depicted in linked content were 18 years of age or older at the time of creation. Records are maintained by the respective content producers in compliance with 18 U.S.C. 2257.',
            },
            {
              title: 'Contact',
              content: null,
              contact: true,
            },
          ].map(s => (
            <div key={s.title} style={{ border: '1.5px solid #111', borderRadius: 10, padding: '20px 24px' }}>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: '#111', marginBottom: 10 }}>{s.title}</h2>
              {s.content && <p style={{ fontSize: 14, color: '#444', lineHeight: 1.75, margin: 0 }}>{s.content}</p>}
              {s.list && (
                <ul style={{ fontSize: 14, color: '#444', lineHeight: 2, paddingLeft: 20, margin: 0 }}>
                  {s.list.map(item => <li key={item}>{item}</li>)}
                </ul>
              )}
              {s.contact && (
                <p style={{ fontSize: 14, color: '#444', lineHeight: 1.75, margin: 0 }}>
                  For questions, DMCA notices, or content removal requests, visit our{' '}
                  <a href="/contact" style={{ color: '#111', fontWeight: 700, textDecoration: 'underline' }}>Contact page</a> or{' '}
                  <a href="/dmca" style={{ color: '#111', fontWeight: 700, textDecoration: 'underline' }}>DMCA page</a>.
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
