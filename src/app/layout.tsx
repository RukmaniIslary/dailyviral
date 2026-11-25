import type { Metadata } from 'next';
import './globals.css';
import AgeGate from '@/components/layout/AgeGate';

export const metadata: Metadata = {
  title: {
    default: 'Daily Viral MMS – Trending Adult Media Directory',
    template: '%s | Daily Viral MMS',
  },
  description:
    'Daily Viral MMS – the premier 18+ adult media directory. Browse trending and latest viral content. Adults only.',
  robots: { index: false, follow: false },
  openGraph: {
    type: 'website',
    siteName: 'Daily Viral MMS',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: '#0B0B0F', color: '#fff', minHeight: '100vh' }}>
        <AgeGate>{children}</AgeGate>
      </body>
    </html>
  );
}
