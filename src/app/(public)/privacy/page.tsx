import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Privacy Policy – Daily Viral MMS' };

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-white mb-2">Privacy Policy</h1>
      <p className="text-gray-500 text-sm mb-8">Last updated: January 2025</p>

      <div className="space-y-8 text-gray-300 text-sm leading-relaxed">
        {[
          {
            title: '1. Information We Collect',
            content:
              'We collect minimal information necessary to operate this service. We track anonymous page view counts and external link click counts on a per-post basis for analytics purposes. We do not collect personal information from site visitors.',
          },
          {
            title: '2. Cookies',
            content:
              'We use a single session cookie for age-gate confirmation (stored in localStorage). We use an HTTP-only cookie for admin authentication only. We do not use advertising or tracking cookies.',
          },
          {
            title: '3. Analytics',
            content:
              'We collect anonymous view and click statistics to understand which content is popular. These analytics do not include personally identifiable information. We store approximate IP addresses temporarily for abuse prevention only.',
          },
          {
            title: '4. Third-Party Content',
            content:
              'This site links to external content hosted by third parties. When you click an external link, you leave our site and are subject to the privacy policies of the destination site. We are not responsible for third-party privacy practices.',
          },
          {
            title: '5. Data Retention',
            content:
              'Anonymous analytics data is retained for up to 90 days. We do not retain personal information from visitors.',
          },
          {
            title: '6. Your Rights',
            content:
              'Since we do not collect personal information from visitors, there is no personal data to request, correct, or delete. For questions, contact us at privacy@dailyviralmms.com.',
          },
          {
            title: '7. Children\'s Privacy',
            content:
              'This site is strictly for adults aged 18 and over. We do not knowingly collect any information from minors. If you believe a minor has accessed this site, contact us immediately.',
          },
          {
            title: '8. Changes',
            content:
              'We may update this policy from time to time. Changes will be posted on this page with the updated date.',
          },
        ].map((section) => (
          <div
            key={section.title}
            className="rounded-xl p-5"
            style={{ background: '#17171D', border: '1px solid #2A2A35' }}
          >
            <h2 className="text-base font-bold text-white mb-3">{section.title}</h2>
            <p className="text-gray-400">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
