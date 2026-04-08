import api from "../../../api/http";

// GET /api/v1/admin/inventory → Page<InventoryItem>
export async function fetchInventory(params = {}) {
  const res = await api.get("/admin/inventory", { params });
  return res.data;
}

// PATCH /api/v1/admin/inventory/products/{productId}?qtyOnHand=...
export async function adjustStock(productId, qtyOnHand) {
  const res = await api.patch(
    `/admin/inventory/products/${productId}`,
    null,
    { params: { qtyOnHand } },
  );
  return res.data;
}

