import { useState } from "react";
import DataTable from "../../../components/DataTable";
import { useFetchData } from "../../../hooks/useFetchData"; 
import { fetchTraders } from "../api/traders";

const TraderTable = ({ onStatusChange, updatingId }) => {
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const {
    items: traders,
    isLoading,
    totalPages,
    isPlaceholderData,
  } = useFetchData(["admin", "traders", page], () =>
    fetchTraders({ page, size: pageSize }),
  );

  const columns = [
    { header: "ID", key: "id" },
    {
      header: "Name",
      render: (t) => t.displayName || t.legalName,
    },
    { header: "Domain", key: "domain" },
    {
      header: "Status",
      render: (t) => (
        <span
          className={`badge badge-sm ${t.status === "ACTIVE" ? "badge-success" : "badge-ghost"}`}
        >
          {t.status || "PENDING"}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (t) => (
        <div className="flex gap-2">
          <button
            className={`btn btn-xs ${updatingId === t.id ? "loading" : ""}`}
            disabled={updatingId === t.id || t.status === "ACTIVE"}
            onClick={() => onStatusChange({ id: t.id, status: "ACTIVE" })}
          >
            Mark ACTIVE
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={traders}
      isLoading={isLoading}
      pagination={{
        currentPage: page,
        totalPages: totalPages,
        onPageChange: (newPage) => setPage(newPage),
        isPlaceholderData: isPlaceholderData,
      }}
    />
  );
};

export default TraderTable;
