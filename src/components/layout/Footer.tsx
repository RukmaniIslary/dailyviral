import Link from 'next/link';
import Logo from '@/components/ui/Logo';

export default function Footer() {
  return (
    <footer className="border-t mt-16" style={{ background: '#17171D', borderColor: '#2A2A35' }}>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <Logo size="md" />
            <p className="mt-3 text-sm text-gray-500 max-w-sm leading-relaxed">
              Daily Viral MMS is an 18+ adult media directory. All content is strictly for adults aged 18 and over.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span
                className="inline-flex items-center px-2.5 py-1 rounded text-xs font-bold text-white"
                style={{ background: '#E50935' }}
              >
                18+
              </span>
              <span className="text-xs text-gray-500">Adults only. By browsing you confirm you are 18+.</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Browse</h4>
            <ul className="space-y-2">
              {[
                { label: 'Home', href: '/' },
                { label: 'Trending', href: '/trending' },
                { label: 'Latest', href: '/latest' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Legal</h4>
            <ul className="space-y-2">
              {[
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'DMCA', href: '/dmca' },
                { label: 'Contact Us', href: '/contact' },
                { label: 'About', href: '/about' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-3"
          style={{ borderColor: '#2A2A35' }}
        >
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Daily Viral MMS. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            All models are 18+. This site is strictly for adults. We comply with 18 U.S.C. 2257.
          </p>
        </div>
      </div>
    </footer>
  );
}
