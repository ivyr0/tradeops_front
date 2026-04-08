import api from "../../../api/http";

export async function fetchOrders(params = {}) {
  const res = await api.get("/admin/orders", { params });
  return res.data;
}

export async function fetchOrderById(orderId) {
  const res = await api.get(`/admin/orders/${orderId}`);
  return res.data;
}

export async function updateOrderStatus(orderId, status) {
  const res = await api.patch(
    `/admin/orders/${orderId}/status`,
    null,
    { params: { status } },
  );
  return res.data;
}

export async function assignCourier(orderId, courierId) {
  const res = await api.post(`/admin/orders/${orderId}/assign`, { courierId });
  return res.data;
}

export async function unassignCourier(orderId) {
  const res = await api.post(`/admin/orders/${orderId}/unassign`);
  return res.data;
}

