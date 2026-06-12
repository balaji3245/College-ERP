import { useState, useMemo } from 'react';

export function usePagination(data, pageSize = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, currentPage, pageSize]);

  function goToPage(page) {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  }

  function reset() {
    setCurrentPage(1);
  }

  return { currentPage, totalPages, paginated, goToPage, reset, total: data.length };
}
