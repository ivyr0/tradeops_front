const DataTable = ({
  columns,
  data = [],
  isLoading,
  emptyMessage = "No items found.",
  pagination = {
    currentPage: 0,
    totalPages: 1,
    onPageChange: () => {},
    isPlaceholderData: false,
  },
}) => {
  if (isLoading)
    return (
      <div className="flex justify-center p-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  const { currentPage, totalPages, onPageChange, isPlaceholderData } =
    pagination;

  return (
    <div className="bg-base-100 rounded-xl shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-base-200">
              {columns.map((col, index) => (
                <th key={index} className="text-sm font-semibold">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={row.id || rowIndex} className="hover">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-10 opacity-50"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between p-4 border-t bg-base-50">
        <span className="text-sm opacity-60">
          Page <strong>{currentPage + 1}</strong> of {totalPages || 1}
        </span>

        <div className="join">
          <button
            className="join-item btn btn-sm btn-outline"
            onClick={() => onPageChange(Math.max(currentPage - 1, 0))}
            disabled={currentPage === 0 || isPlaceholderData}
          >
            «
          </button>

          <button className="join-item btn btn-sm btn-active pointer-events-none">
            {currentPage + 1}
          </button>

          <button
            className="join-item btn btn-sm btn-outline"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1 || isPlaceholderData}
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
