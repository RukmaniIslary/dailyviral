import type { Metadata } from 'next';
import Logo from '@/components/ui/Logo';

export const metadata: Metadata = { title: 'About Us – Daily Viral MMS' };

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Logo size="lg" />
        <h1 className="text-3xl font-black text-white mt-6 mb-3">About Daily Viral MMS</h1>
        <div
          className="w-16 h-1 rounded-full"
          style={{ background: '#E50935' }}
        />
      </div>

      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          Daily Viral MMS is an 18+ adult media directory dedicated to curating and sharing viral adult content.
          Our platform provides a safe, organized, and professional environment for adults to discover trending media.
        </p>

        <div
          className="rounded-xl p-5"
          style={{ background: '#17171D', border: '1px solid #2A2A35' }}
        >
          <h2 className="text-lg font-bold text-white mb-3">Our Mission</h2>
          <p className="text-gray-400 text-sm">
            We provide a directory of adult content with strict compliance standards. We only list content
            that depicts consenting adults and complies with all applicable laws and regulations.
          </p>
        </div>

        <div
          className="rounded-xl p-5"
          style={{ background: '#17171D', border: '1px solid #2A2A35' }}
        >
          <h2 className="text-lg font-bold text-white mb-3">Content Policy</h2>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>All content depicts consenting adults aged 18 or older.</li>
            <li>We do not host, store, or upload any media files.</li>
            <li>We operate as a directory and index only.</li>
            <li>Content is strictly screened before listing.</li>
            <li>We respond to all DMCA and legal requests promptly.</li>
          </ul>
        </div>

        <div
          className="rounded-xl p-5"
          style={{ background: '#17171D', border: '1px solid #2A2A35' }}
        >
          <h2 className="text-lg font-bold text-white mb-3">18 U.S.C. 2257 Compliance</h2>
          <p className="text-gray-400 text-sm">
            Daily Viral MMS is a directory and does not produce any content. All content linked from this
            site is produced by third parties. All models depicted in linked content were 18 years of age
            or older at the time of creation. Records are maintained by the respective content producers
            in compliance with 18 U.S.C. 2257.
          </p>
        </div>

        <div
          className="rounded-xl p-5"
          style={{ background: '#17171D', border: '1px solid #2A2A35' }}
        >
          <h2 className="text-lg font-bold text-white mb-3">Contact</h2>
          <p className="text-gray-400 text-sm">
            For questions, DMCA notices, or content removal requests, visit our{' '}
            <a href="/contact" className="underline hover:text-white">Contact page</a> or{' '}
            <a href="/dmca" className="underline hover:text-white">DMCA page</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
