import api from "../../../api/http";

function getCurrentRole() {
  try {
    const raw = localStorage.getItem("admin_user");
    const user = raw ? JSON.parse(raw) : null;
    return user?.role || null;
  } catch {
    return null;
  }
}

function isModerator(role) {
  if (!role) return false;
  return String(role).toUpperCase().includes("MODERATOR");
}

function getTradersBasePath() {

  const role = getCurrentRole();
  return isModerator(role) ? "/admin/traders" : "/superadmin/traders";
}

export async function fetchTraders(params = {}) {
  const res = await api.get(getTradersBasePath(), { 
    params: {
      page: 0,
      size: 50,
      ...params,
    },
  });
  return res.data;
}

export async function createTrader(payload) {
  const body = {
    legalName: payload.legalName || payload.name || payload.displayName,
    displayName: payload.displayName || payload.name || payload.legalName,
    domain: payload.domain,
  };
  const res = await api.post(getTradersBasePath(), body);
  return res.data;
}

export async function updateTraderStatus(id, status) {
  const res = await api.patch(`${getTradersBasePath()}/${id}/status`, { status });
  return res.data;
}

export async function uploadTraderSsl(traderId, file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post(
    `/trader/${traderId}/settings/ssl`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return res.data;
}

export async function buildTraderPackage(id) {
  const res = await api.post(`${getTradersBasePath()}/${id}/package/build`);
  return res.data;
}

export async function downloadTraderPackage(id) {
  const res = await api.get(`trader/${id}/package/download`, {
    responseType: "blob",
  });
  return res.data;
}

export async function createTraderUser(traderId, payload) {
  const body = {
    name: payload.name,
    email: payload.email,
    password: payload.password,
    role: payload.role || "TRADER_ADMIN",
  };
  const res = await api.post(`/trader/${traderId}/personnel`, body);
  return res.data;
}

export async function triggerPackageBuild(traderId) {
  const res = await api.post(`/trader/${traderId}/build`);
  return res.data;
}
