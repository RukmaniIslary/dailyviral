import Link from 'next/link';

interface SectionHeaderProps {
  title: string;
  viewAllHref?: string;
  icon?: React.ReactNode;
}

export default function SectionHeader({ title, viewAllHref, icon }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2">
        <div className="w-1 h-6 rounded-full" style={{ background: '#E50935' }} />
        {icon && <span className="text-gray-400">{icon}</span>}
        <h2 className="text-lg font-bold text-white">{title}</h2>
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="text-sm font-medium transition-colors hover:opacity-80"
          style={{ color: '#E50935' }}
        >
          View All
        </Link>
      )}
    </div>
  );
}
