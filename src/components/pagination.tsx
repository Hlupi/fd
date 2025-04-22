import arrowLeft from "@ingka/ssr-icon/paths/arrow-left";
import arrowRight from "@ingka/ssr-icon/paths/arrow-right";
import Button from "@ingka/button";
import Text from "@ingka/text";

type PaginationProps = {
  totalPages: number;
  currentPage: number;
  onClick: (page: number) => void;
  hasPrevPage: boolean;
  hasNextPage: boolean;
};

export function Pagination({
  totalPages,
  currentPage,
  onClick,
  hasPrevPage,
  hasNextPage,
}: PaginationProps) {
  if (!totalPages) return null;

  const renderPageNumbers = () => {
    const visiblePages = 5;

    let startPage = Math.max(0, currentPage - Math.floor(visiblePages / 2));
    let endPage = startPage + visiblePages - 1;

    if (endPage >= totalPages) {
      endPage = totalPages - 1;
      startPage = Math.max(0, endPage - visiblePages + 1);
    }

    const pages = [];

    for (let i = startPage; i <= endPage; i++) {
      const pageNumber = i + 1;
      pages.push(
        <Button
          key={`go-to-page-${i}`}
          type="plain"
          size="small"
          onClick={() => onClick(i)}
          text={pageNumber.toString()}
          className={`pagination__page-number ${i === currentPage ? "pagination__page-number--active" : ""}`}
          aria-label={
            i === currentPage
              ? `Current page ${pageNumber}`
              : `Page ${pageNumber}`
          }
        />
      );
    }

    return pages;
  };

  const pageNumbers = (
    <div className="pagination__page-numbers">{renderPageNumbers()}</div>
  );

  if (totalPages === 1) {
    return <div className="pagination__controls">{pageNumbers}</div>;
  }

  return (
    <>
      <div className="pagination__controls">
        <Button
          type="primary"
          iconOnly
          size="small"
          ssrIcon={arrowLeft}
          onClick={() => onClick(0)}
          disabled={!hasPrevPage}
          aria-label="First page"
        />
        {pageNumbers}

        <Button
          type="primary"
          iconOnly
          size="small"
          ssrIcon={arrowRight}
          onClick={() => onClick(totalPages - 1)}
          disabled={!hasNextPage}
          aria-label="Last page"
        />
      </div>
      <Text tagName="p" className="pagination__info">
        Showing page {currentPage + 1} of {totalPages}
      </Text>
    </>
  );
}
