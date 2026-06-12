import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange, total, pageSize }) {
  const maxVisible = 3;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-3 border-t border-slate-100">
      <p className="text-xs sm:text-sm text-slate-500">
        Showing{' '}
        <span className="font-medium">{Math.min((currentPage - 1) * pageSize + 1, total)}</span>–
        <span className="font-medium">{Math.min(currentPage * pageSize, total)}</span>{' '}
        of <span className="font-medium">{total}</span>
      </p>
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={15} />
        </button>
        {start > 1 && (
          <>
            <button onClick={() => onPageChange(1)} className="w-8 h-8 text-xs rounded-lg hover:bg-slate-100 text-slate-600">1</button>
            {start > 2 && <span className="px-1 text-slate-400 text-xs">…</span>}
          </>
        )}
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 text-xs rounded-lg font-medium ${p === currentPage ? 'bg-primary-600 text-white' : 'hover:bg-slate-100 text-slate-600'}`}
          >
            {p}
          </button>
        ))}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="px-1 text-slate-400 text-xs">…</span>}
            <button onClick={() => onPageChange(totalPages)} className="w-8 h-8 text-xs rounded-lg hover:bg-slate-100 text-slate-600">{totalPages}</button>
          </>
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
