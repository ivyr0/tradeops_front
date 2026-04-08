import api from "../../../api/http";

export async function fetchCouriers() {
  const res = await api.get("/admin/couriers");
  return res.data;
}

export async function createCourier(payload) {
  const res = await api.post("/admin/couriers", payload);
  return res.data;
}

export async function updateCourier(id, payload) {
  const res = await api.put(`/admin/couriers/${id}`, payload);
  return res.data;
}

export async function setCourierActive(id, active) {
  const res = await api.patch(`/admin/couriers/${id}/status`, {
    status: active,
  });
  return res.data;
}

export async function deleteCourier(id) {
  const res = await api.delete(`/admin/couriers/${id}`);
  return res.data;
}

