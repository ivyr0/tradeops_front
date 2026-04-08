import api from "../../../api/http";

export async function fetchCategories(params = {}) {
  const query = {
    size: 100,
    sort: "name,asc",
    ...params,
  };

  const res = await api.get("/admin/catalog/categories", { params: query });
  const data = res.data;

  if (data && Array.isArray(data.content)) {
    return data.content;
  }

  return data?.items || data;
}

export async function createCategory(payload) {

  const body = {
    name: payload.name,
    parentId: null,
    slug: payload.slug || payload.name?.toLowerCase().replace(/\s+/g, "-"),
    sortOrder: 0,
  };

  const res = await api.post("/admin/catalog/categories", body);
  return res.data;
}

export async function fetchProducts(params = {}) {
  const res = await api.get("/admin/catalog/products", { params });
  const data = res.data;

  const rows = data?.content || data?.items || data || [];

  return rows.map((row) => ({
    id: row.productId || row.id,
    name: row.name || row.product_name || `Product #${row.productId || row.id}`,
    category_id: row.categoryId || row.category_id,
    price: row.basePrice || row.price || 0,
    active: row.isActive,
  }));
}

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export async function uploadProductImage(productId, file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post(
    `/admin/catalog/products/${productId}/image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return res.data;
}

export async function createProduct(payload, file) {
  let imageData = "https://via.placeholder.com/150";

  if (file) {
    imageData = await toBase64(file);
  }

  const body = {
    sku: `SKU-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    name: payload.name,
    description: payload.description || `Description for ${payload.name}`,
    basePrice: Number(payload.price),
    isActive: true,
    images: [imageData],
    categoryId: Number(payload.category_id),
  };

  const res = await api.post("/admin/catalog/products", body);
  return res.data;
}

export async function toggleProductActive(productId, active) {
  const res = await api.patch(`/admin/catalog/products/${productId}/status`, {
    isActive: active,
  });
  return res.data;
}

export async function fetchProductById(productId) {
  const res = await api.get(`/admin/catalog/products/${productId}`);
  return res.data;
}

export async function updateProduct(productId, payload) {
  const body = {
    productName: payload.name,
    categoryId: Number(payload.category_id),
    price: Number(payload.price),
  };
  const res = await api.put(`/admin/catalog/products/${productId}`, body);
  return res.data;
}

export async function deleteProduct(productId) {
  const res = await api.delete(`/admin/catalog/products/${productId}`);
  return res.data;
}

export async function deleteCategory(categoryId) {
  const res = await api.delete(`/admin/catalog/categories/${categoryId}`);
  return res.data;
}
