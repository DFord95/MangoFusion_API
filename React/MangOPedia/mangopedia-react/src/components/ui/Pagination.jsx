function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  ariaLabel = "Order pages",
}) {
  if (totalItems === 0) return null;

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
      pageNumbers.push(i);
    }
  }

  return (
    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-3">
      <span className="text-body-secondary small">
        Showing {(currentPage - 1) * itemsPerPage + 1}-
        {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
      </span>
      <div className="d-flex align-items-center gap-3">
        <label className="d-flex align-items-center gap-2 small text-body-secondary">
          Rows per page
          <select
            className="form-select form-select-sm w-auto"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          >
            {[5, 10, 25, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
        {totalPages > 1 && (
          <nav aria-label={ariaLabel}>
            <ul className="pagination pagination-sm mb-0">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  type="button"
                  className="page-link"
                  aria-label="Previous page"
                  disabled={currentPage === 1}
                  onClick={() => onPageChange(currentPage - 1)}
                >
                  <i className="bi bi-chevron-left" aria-hidden="true"></i>
                </button>
              </li>
              {pageNumbers.map((page, index) => (
                <li key={page} className="d-flex">
                  {index > 0 && page > pageNumbers[index - 1] + 1 && (
                    <span className="page-link disabled" aria-hidden="true">
                      ...
                    </span>
                  )}
                  <button
                    type="button"
                    className={`page-link ${page === currentPage ? "active" : ""}`}
                    aria-current={page === currentPage ? "page" : undefined}
                    onClick={() => onPageChange(page)}
                  >
                    {page}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
              >
                <button
                  type="button"
                  className="page-link"
                  aria-label="Next page"
                  disabled={currentPage === totalPages}
                  onClick={() => onPageChange(currentPage + 1)}
                >
                  <i className="bi bi-chevron-right" aria-hidden="true"></i>
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}

export default Pagination;
