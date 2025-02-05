import styles from "./Pagination.module.scss";

type PropTypes = {
  currentPage: number;
  total: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
};

const Pagination = ({
  currentPage,
  total,
  pageSize,
  onPageChange,
}: PropTypes) => {
  const totalPages: number = Math.ceil(total / pageSize);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (total === 0) return null;

  return (
    <div className={styles.pagination}>
      <button onClick={handlePrevPage} disabled={currentPage === 1}>
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button onClick={handleNextPage} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  );
};

export default Pagination;
