import type { Metadata } from 'next';
import { Mail, MessageSquare } from 'lucide-react';

export const metadata: Metadata = { title: 'Contact – Daily Viral MMS' };

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-white mb-2">Contact Us</h1>
      <p className="text-gray-400 mb-8">
        For content removal, DMCA notices, or general inquiries, use the information below.
      </p>

      <div className="space-y-4">
        <div
          className="rounded-xl p-5 flex items-start gap-4"
          style={{ background: '#17171D', border: '1px solid #2A2A35' }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: 'rgba(229,9,53,0.1)' }}
          >
            <Mail size={18} style={{ color: '#E50935' }} />
          </div>
          <div>
            <h2 className="font-semibold text-white mb-1">Email</h2>
            <p className="text-gray-400 text-sm">
              For DMCA, legal, and content removal requests:{' '}
              <a href="mailto:dmca@dailyviralmms.com" className="underline hover:text-white">
                dmca@dailyviralmms.com
              </a>
            </p>
            <p className="text-gray-400 text-sm mt-1">
              General inquiries:{' '}
              <a href="mailto:contact@dailyviralmms.com" className="underline hover:text-white">
                contact@dailyviralmms.com
              </a>
            </p>
          </div>
        </div>

        <div
          className="rounded-xl p-5 flex items-start gap-4"
          style={{ background: '#17171D', border: '1px solid #2A2A35' }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: 'rgba(229,9,53,0.1)' }}
          >
            <MessageSquare size={18} style={{ color: '#E50935' }} />
          </div>
          <div>
            <h2 className="font-semibold text-white mb-1">Response Time</h2>
            <p className="text-gray-400 text-sm">
              We aim to respond to all inquiries within 48 hours. DMCA and legal requests are handled
              within 24 hours.
            </p>
          </div>
        </div>

        <div
          className="rounded-xl p-5"
          style={{ background: '#17171D', border: '1px solid #2A2A35' }}
        >
          <h2 className="font-semibold text-white mb-3">Report Content</h2>
          <p className="text-gray-400 text-sm mb-3">
            To report specific content on this site, use the Report button on any post page or visit
            our DMCA page for formal takedown procedures.
          </p>
          <a
            href="/dmca"
            className="inline-block px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ background: '#E50935' }}
          >
            File DMCA Request
          </a>
        </div>
      </div>
    </div>
  );
}
