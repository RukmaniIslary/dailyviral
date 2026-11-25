import type { Metadata } from 'next';
import { ShieldAlert, FileText, Clock } from 'lucide-react';

export const metadata: Metadata = { title: 'DMCA – Daily Viral MMS' };

export default function DmcaPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(229,9,53,0.1)' }}
        >
          <ShieldAlert size={22} style={{ color: '#E50935' }} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">DMCA Notice</h1>
          <p className="text-gray-500 text-sm">Digital Millennium Copyright Act</p>
        </div>
      </div>

      <div className="space-y-6 text-sm leading-relaxed">
        <div className="rounded-xl p-5" style={{ background: '#17171D', border: '1px solid #2A2A35' }}>
          <p className="text-gray-300">
            Daily Viral MMS respects intellectual property rights. We comply with the Digital Millennium
            Copyright Act (DMCA) and respond promptly to valid takedown notices.
          </p>
        </div>

        <div className="rounded-xl p-5" style={{ background: '#17171D', border: '1px solid #2A2A35' }}>
          <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <FileText size={16} style={{ color: '#E50935' }} />
            How to File a DMCA Takedown
          </h2>
          <p className="text-gray-400 mb-3">
            To file a DMCA takedown notice, send an email to{' '}
            <a href="mailto:dmca@dailyviralmms.com" className="underline hover:text-white">
              dmca@dailyviralmms.com
            </a>{' '}
            with the following information:
          </p>
          <ol className="text-gray-400 space-y-2 list-decimal list-inside">
            <li>Your full name and contact information.</li>
            <li>Identification of the copyrighted work claimed to be infringed.</li>
            <li>The URL(s) of the infringing content on our site.</li>
            <li>A statement that you have a good-faith belief the use is not authorized.</li>
            <li>A statement that the information in your notice is accurate.</li>
            <li>Your physical or electronic signature.</li>
          </ol>
        </div>

        <div className="rounded-xl p-5" style={{ background: '#17171D', border: '1px solid #2A2A35' }}>
          <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <Clock size={16} style={{ color: '#E50935' }} />
            Response Time
          </h2>
          <p className="text-gray-400">
            We process DMCA notices within 24 hours of receipt. Upon receipt of a valid notice, we will
            remove or disable access to the identified content promptly.
          </p>
        </div>

        <div className="rounded-xl p-5" style={{ background: '#17171D', border: '1px solid #2A2A35' }}>
          <h2 className="text-base font-bold text-white mb-3">Counter-Notice</h2>
          <p className="text-gray-400">
            If you believe content was removed in error, you may file a counter-notice. Counter-notices
            must include your contact information, identification of the removed content, a statement under
            penalty of perjury that you have a good-faith belief the content was removed in error, and your
            physical or electronic signature.
          </p>
        </div>

        <div className="rounded-xl p-5" style={{ background: '#17171D', border: '1px solid #2A2A35' }}>
          <h2 className="text-base font-bold text-white mb-3">Non-Consensual Content</h2>
          <p className="text-gray-400">
            We have zero tolerance for non-consensual intimate imagery. If you are depicted in content on
            this site without your consent, contact us immediately at{' '}
            <a href="mailto:dmca@dailyviralmms.com" className="underline hover:text-white">
              dmca@dailyviralmms.com
            </a>
            . We will remove such content within 2 hours of verification.
          </p>
        </div>
      </div>
    </div>
  );
}
