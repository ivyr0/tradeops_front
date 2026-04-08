import api from "../../../api/http";

export async function fetchAuditLogs(params = {}) {
  const res = await api.get("/admin/audit", { params });
  return res.data;
}

