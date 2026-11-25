import Link from 'next/link';

export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="relative">
        <div
          className="rounded-lg flex items-center justify-center font-black text-white"
          style={{
            background: 'linear-gradient(135deg, #E50935 0%, #8B0520 100%)',
            padding: size === 'lg' ? '8px 12px' : '6px 10px',
            fontSize: size === 'lg' ? '1.1rem' : '0.9rem',
          }}
        >
          DVM
        </div>
      </div>
      <div className="flex flex-col leading-none">
        <span
          className={`font-black text-white group-hover:text-red-400 transition-colors ${sizes[size]}`}
        >
          Daily Viral
        </span>
        <span
          className={`font-bold tracking-widest uppercase ${
            size === 'lg' ? 'text-sm' : 'text-xs'
          }`}
          style={{ color: '#E50935', letterSpacing: '0.15em' }}
        >
          MMS
        </span>
      </div>
    </Link>
  );
}
