import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  size?: 'sm' | 'md';
  className?: string;
  showTotals?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onChange, size='sm', className='', showTotals=true }) => {
  if (totalPages <= 1) return null;
  const btnCls = 'px-2 py-1 rounded bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-600 transition';
  const textCls = size === 'sm' ? 'text-xs' : 'text-sm';
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}> 
      <button
        aria-label="Prev page"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className={btnCls}
      >
        <ChevronLeft size={16} />
      </button>
      {showTotals && <span className={`${textCls} text-gray-400`}>Стр. {page} / {totalPages}</span>}
      <button
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className={btnCls}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
