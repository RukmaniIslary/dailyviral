import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Terms of Service – Daily Viral MMS' };

const sections = [
  { title: '1. Age Requirement', content: 'You must be at least 18 years of age to access this website. By entering the site, you confirm that you are of legal age in your jurisdiction to view adult content. Minors are strictly prohibited from accessing this site.' },
  { title: '2. Nature of Service', content: 'Daily Viral MMS is a directory and index service. We link to adult content hosted on third-party platforms. We do not host, upload, store, or distribute any media files directly.' },
  { title: '3. Acceptable Use', content: 'You agree to use this site for lawful purposes only. You may not attempt to circumvent security measures, access administrative functions, harvest data, or use automated tools to scrape content.' },
  { title: '4. Prohibited Content', content: 'This site strictly prohibits: content involving minors, non-consensual intimate imagery, stolen intimate content, content uploaded without authorization from all parties depicted, and any illegal sexual material. Violating content will be removed and reported to relevant authorities.' },
  { title: '5. External Links', content: 'We link to content on third-party websites. We have no control over those sites and are not responsible for their content, privacy practices, or terms of service. External links open in a new tab.' },
  { title: '6. Disclaimer', content: 'This site is provided "as is" without any warranties. We do not warrant the accuracy, completeness, or availability of any content. We reserve the right to modify or discontinue the service at any time.' },
  { title: '7. Intellectual Property', content: 'If you believe content on this site infringes your intellectual property rights, please submit a DMCA notice via our DMCA page. We respond to all valid takedown requests promptly.' },
  { title: '8. Governing Law', content: 'These terms are governed by applicable law. Any disputes shall be resolved through arbitration. If any provision of these terms is found unenforceable, the remaining provisions continue in full force.' },
];

export default function TermsPage() {
  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 20px 80px' }}>

        {/* Header */}
        <div style={{ borderBottom: '2px solid #111', paddingBottom: 20, marginBottom: 36 }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#111', marginBottom: 6 }}>Terms of Service</h1>
          <p style={{ fontSize: 13, color: '#888' }}>Last updated: January 2025</p>
        </div>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {sections.map(s => (
            <div key={s.title} style={{ border: '1.5px solid #111', borderRadius: 10, padding: '20px 24px' }}>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: '#111', marginBottom: 10 }}>{s.title}</h2>
              <p style={{ fontSize: 14, color: '#444', lineHeight: 1.75, margin: 0 }}>{s.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
