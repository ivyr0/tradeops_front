import { useState } from "react";
import { useFetchData } from "../../../hooks/useFetchData";
import { fetchAuditLogs } from "../api/audit";
import AuditTable from "../components/AuditTable";

const AuditLogsPage = () => {
  const [page, setPage] = useState(0);

  const { items, isLoading, totalPages, isPlaceholderData } = useFetchData(
    ["admin", "audit", page],
    () => fetchAuditLogs({ page, size: 10 }),
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Audit Logs</h1>
        <p className="text-sm opacity-60">System-wide activity tracking</p>
      </header>

      <AuditTable
        logs={items}
        isLoading={isLoading}
        pagination={{
          currentPage: page,
          totalPages: totalPages,
          onPageChange: setPage,
          isPlaceholderData,
        }}
      />
    </div>
  );
};

export default AuditLogsPage;
