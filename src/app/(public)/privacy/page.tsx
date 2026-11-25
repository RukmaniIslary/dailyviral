import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Privacy Policy – Daily Viral MMS' };

const sections = [
  { title: '1. Information We Collect', content: 'We collect minimal information necessary to operate this service. We track anonymous page view counts and external link click counts on a per-post basis for analytics purposes. We do not collect personal information from site visitors.' },
  { title: '2. Cookies', content: 'We use a single session cookie for age-gate confirmation (stored in localStorage). We use an HTTP-only cookie for admin authentication only. We do not use advertising or tracking cookies.' },
  { title: '3. Analytics', content: 'We collect anonymous view and click statistics to understand which content is popular. These analytics do not include personally identifiable information. We store approximate IP addresses temporarily for abuse prevention only.' },
  { title: '4. Third-Party Content', content: 'This site links to external content hosted by third parties. When you click an external link, you leave our site and are subject to the privacy policies of the destination site. We are not responsible for third-party privacy practices.' },
  { title: '5. Data Retention', content: 'Anonymous analytics data is retained for up to 90 days. We do not retain personal information from visitors.' },
  { title: '6. Your Rights', content: 'Since we do not collect personal information from visitors, there is no personal data to request, correct, or delete. For questions, contact us at privacy@dailyviralmms.com.' },
  { title: "7. Children's Privacy", content: 'This site is strictly for adults aged 18 and over. We do not knowingly collect any information from minors. If you believe a minor has accessed this site, contact us immediately.' },
  { title: '8. Changes', content: 'We may update this policy from time to time. Changes will be posted on this page with the updated date.' },
];

export default function PrivacyPage() {
  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 20px 80px' }}>

        {/* Header */}
        <div style={{ borderBottom: '2px solid #111', paddingBottom: 20, marginBottom: 36 }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#111', marginBottom: 6 }}>Privacy Policy</h1>
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
