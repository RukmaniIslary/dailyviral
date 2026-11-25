import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Terms of Service – Daily Viral MMS' };

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-white mb-2">Terms of Service</h1>
      <p className="text-gray-500 text-sm mb-8">Last updated: January 2025</p>

      <div className="space-y-6 text-sm leading-relaxed">
        {[
          {
            title: '1. Age Requirement',
            content:
              'You must be at least 18 years of age to access this website. By entering the site, you confirm that you are of legal age in your jurisdiction to view adult content. Minors are strictly prohibited from accessing this site.',
          },
          {
            title: '2. Nature of Service',
            content:
              'Daily Viral MMS is a directory and index service. We link to adult content hosted on third-party platforms. We do not host, upload, store, or distribute any media files directly.',
          },
          {
            title: '3. Acceptable Use',
            content:
              'You agree to use this site for lawful purposes only. You may not attempt to circumvent security measures, access administrative functions, harvest data, or use automated tools to scrape content.',
          },
          {
            title: '4. Prohibited Content',
            content:
              'This site strictly prohibits: content involving minors, non-consensual intimate imagery, stolen intimate content, content uploaded without authorization from all parties depicted, and any illegal sexual material. Violating content will be removed and reported to relevant authorities.',
          },
          {
            title: '5. External Links',
            content:
              'We link to content on third-party websites. We have no control over those sites and are not responsible for their content, privacy practices, or terms of service. External links open in a new tab.',
          },
          {
            title: '6. Disclaimer',
            content:
              'This site is provided "as is" without any warranties. We do not warrant the accuracy, completeness, or availability of any content. We reserve the right to modify or discontinue the service at any time.',
          },
          {
            title: '7. Intellectual Property',
            content:
              'If you believe content on this site infringes your intellectual property rights, please submit a DMCA notice via our DMCA page. We respond to all valid takedown requests promptly.',
          },
          {
            title: '8. Governing Law',
            content:
              'These terms are governed by applicable law. Any disputes shall be resolved through arbitration. If any provision of these terms is found unenforceable, the remaining provisions continue in full force.',
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
