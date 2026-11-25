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
      <body style={{ background: '#f7f7f7', color: '#111', minHeight: '100vh' }}>
        <AgeGate>{children}</AgeGate>
      </body>
    </html>
  );
}
