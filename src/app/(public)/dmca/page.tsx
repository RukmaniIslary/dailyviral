import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'DMCA – Daily Viral MMS' };

export default function DmcaPage() {
  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 20px 80px' }}>

        {/* Header */}
        <div style={{ borderBottom: '2px solid #111', paddingBottom: 20, marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 10, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 900, color: '#111', marginBottom: 2 }}>DMCA Notice</h1>
              <p style={{ fontSize: 13, color: '#888' }}>Digital Millennium Copyright Act</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div style={{ border: '1.5px solid #111', borderRadius: 10, padding: '20px 24px' }}>
            <p style={{ fontSize: 14, color: '#444', lineHeight: 1.75, margin: 0 }}>
              Daily Viral MMS respects intellectual property rights. We comply with the Digital Millennium Copyright Act (DMCA) and respond promptly to valid takedown notices.
            </p>
          </div>

          <div style={{ border: '1.5px solid #111', borderRadius: 10, padding: '20px 24px' }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#111', marginBottom: 12 }}>How to File a DMCA Takedown</h2>
            <p style={{ fontSize: 14, color: '#444', lineHeight: 1.75, marginBottom: 12 }}>
              Send an email to{' '}
              <a href="mailto:dmca@dailyviralmms.com" style={{ color: '#111', fontWeight: 700, textDecoration: 'underline' }}>
                dmca@dailyviralmms.com
              </a>{' '}
              with the following information:
            </p>
            <ol style={{ fontSize: 14, color: '#444', lineHeight: 2, paddingLeft: 20, margin: 0 }}>
              <li>Your full name and contact information.</li>
              <li>Identification of the copyrighted work claimed to be infringed.</li>
              <li>The URL(s) of the infringing content on our site.</li>
              <li>A statement that you have a good-faith belief the use is not authorized.</li>
              <li>A statement that the information in your notice is accurate.</li>
              <li>Your physical or electronic signature.</li>
            </ol>
          </div>

          <div style={{ border: '1.5px solid #111', borderRadius: 10, padding: '20px 24px' }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#111', marginBottom: 10 }}>Response Time</h2>
            <p style={{ fontSize: 14, color: '#444', lineHeight: 1.75, margin: 0 }}>
              We process DMCA notices within 24 hours of receipt. Upon receipt of a valid notice, we will remove or disable access to the identified content promptly.
            </p>
          </div>

          <div style={{ border: '1.5px solid #111', borderRadius: 10, padding: '20px 24px' }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#111', marginBottom: 10 }}>Counter-Notice</h2>
            <p style={{ fontSize: 14, color: '#444', lineHeight: 1.75, margin: 0 }}>
              If you believe content was removed in error, you may file a counter-notice. Counter-notices must include your contact information, identification of the removed content, a statement under penalty of perjury that you have a good-faith belief the content was removed in error, and your physical or electronic signature.
            </p>
          </div>

          <div style={{ border: '1.5px solid #e50935', borderRadius: 10, padding: '20px 24px', background: '#fff8f8' }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#e50935', marginBottom: 10 }}>Non-Consensual Content</h2>
            <p style={{ fontSize: 14, color: '#444', lineHeight: 1.75, margin: 0 }}>
              We have zero tolerance for non-consensual intimate imagery. If you are depicted in content on this site without your consent, contact us immediately at{' '}
              <a href="mailto:dmca@dailyviralmms.com" style={{ color: '#e50935', fontWeight: 700, textDecoration: 'underline' }}>
                dmca@dailyviralmms.com
              </a>
              . We will remove such content within 2 hours of verification.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
