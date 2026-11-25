'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`${pathname}?${params.toString()}`);
  }

  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ background: '#17171D', border: '1px solid #2A2A35', color: '#9CA3AF' }}
      >
        <ChevronLeft size={16} /> Prev
      </button>

      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-600">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => goToPage(page as number)}
            className="w-9 h-9 rounded-lg text-sm font-medium transition-all"
            style={
              page === currentPage
                ? { background: '#E50935', color: '#fff' }
                : { background: '#17171D', border: '1px solid #2A2A35', color: '#9CA3AF' }
            }
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ background: '#17171D', border: '1px solid #2A2A35', color: '#9CA3AF' }}
      >
        Next <ChevronRight size={16} />
      </button>
    </div>
  );
}
