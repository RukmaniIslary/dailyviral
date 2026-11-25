import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Contact – Daily Viral MMS' };

export default function ContactPage() {
  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 20px 80px' }}>

        <div style={{ borderBottom: '2px solid #111', paddingBottom: 20, marginBottom: 36 }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#111', marginBottom: 6 }}>Contact Us</h1>
          <p style={{ fontSize: 14, color: '#666' }}>For content removal, DMCA notices, or general inquiries.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div style={{ border: '1.5px solid #111', borderRadius: 10, padding: '20px 24px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{ width: 42, height: 42, borderRadius: 8, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: '#111', marginBottom: 8 }}>Email</h2>
              <p style={{ fontSize: 14, color: '#444', lineHeight: 1.7, marginBottom: 4 }}>
                DMCA & legal:{' '}
                <a href="mailto:dmca@dailyviralmms.com" style={{ color: '#111', fontWeight: 700, textDecoration: 'underline' }}>
                  dmca@dailyviralmms.com
                </a>
              </p>
              <p style={{ fontSize: 14, color: '#444', lineHeight: 1.7 }}>
                General:{' '}
                <a href="mailto:contact@dailyviralmms.com" style={{ color: '#111', fontWeight: 700, textDecoration: 'underline' }}>
                  contact@dailyviralmms.com
                </a>
              </p>
            </div>
          </div>

          <div style={{ border: '1.5px solid #111', borderRadius: 10, padding: '20px 24px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{ width: 42, height: 42, borderRadius: 8, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: '#111', marginBottom: 8 }}>Response Time</h2>
              <p style={{ fontSize: 14, color: '#444', lineHeight: 1.75 }}>
                We aim to respond to all inquiries within 48 hours. DMCA and legal requests are handled within 24 hours.
              </p>
            </div>
          </div>

          <div style={{ border: '1.5px solid #111', borderRadius: 10, padding: '20px 24px' }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#111', marginBottom: 10 }}>Report Content</h2>
            <p style={{ fontSize: 14, color: '#444', lineHeight: 1.75, marginBottom: 16 }}>
              To report specific content, use the Report button on any post page or visit our DMCA page for formal takedown procedures.
            </p>
            <a href="/dmca" style={{ display: 'inline-block', padding: '10px 22px', borderRadius: 8, background: '#e50935', color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
              File DMCA Request
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
