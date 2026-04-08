import DataTable from "../../../components/DataTable";

const AuditTable = ({ logs, isLoading, pagination }) => {
  const columns = [
    {
      header: "Time",
      render: (row) => (
        <span className="whitespace-nowrap text-xs text-opacity-70">
          {new Date(row.createdAt).toLocaleString()}
        </span>
      ),
    },
    {
      header: "Actor",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-xs">{row.actorId}</span>
          <span className="text-[10px] opacity-50 uppercase tracking-tighter">
            {row.actorType}
          </span>
        </div>
      ),
    },
    {
      header: "Action",
      render: (row) => (
        <span className="badge badge-outline badge-sm font-mono text-[10px]">
          {row.action}
        </span>
      ),
    },
    {
      header: "Details",
      render: (row) => (
        <div
          className="max-w-xs truncate text-xs font-mono opacity-60"
          title={row.diffJson}
        >
          {row.diffJson || "—"}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={logs}
      isLoading={isLoading}
      pagination={pagination}
      emptyMessage="No audit logs found for this period."
    />
  );
};

export default AuditTable;
