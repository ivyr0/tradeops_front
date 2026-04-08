import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Trash } from "lucide-react";
import { getErrorMessage } from "../../../api/error";
import {
  fetchCategories,
  createCategory,
  fetchProducts,
  toggleProductActive,
  deleteProduct,
  deleteCategory,
  updateCategory
} from "../api/catalog";

const CatalogPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [categoryForm, setCategoryForm] = useState({ name: "" });
  const [categorySearch, setCategorySearch] = useState("");
  const [productToDelete, setProductToDelete] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  const categoriesQuery = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: fetchCategories,
  });

  const productsQuery = useQuery({
    queryKey: ["admin", "products"],
    queryFn: fetchProducts,
  });

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success("Category created");
      setCategoryForm({ name: "" });
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
    onError: (e) => toast.error(getErrorMessage(e, "Failed to create category")),
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, payload }) => updateCategory(id, payload),
    onSuccess: () => {
      toast.success("Category updated");
      setEditingCategory(null);
      setCategoryForm({ name: "" });
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
    onError: (e) => toast.error(getErrorMessage(e, "Failed to update category")),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, active }) => toggleProductActive(id, active),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] }),
    onError: (e) => toast.error(getErrorMessage(e, "Failed to update product")),
  });

  const deleteProductMutation = useMutation({
    mutationFn: () => deleteProduct(productToDelete),
    onSuccess: () => {
      toast.success("Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      setProductToDelete(null);
      document.getElementById('delete_modal').close();
    },
    onError: (e) => toast.error(getErrorMessage(e, "Failed to delete product")),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: () => deleteCategory(categoryToDelete),
    onSuccess: () => {
      toast.success("Category deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      setCategoryToDelete(null);
      document.getElementById('delete_category_modal').close();
    },
    onError: (e) => toast.error(getErrorMessage(e, "Failed to delete category")),
  });

  const categories = (categoriesQuery.data?.items || categoriesQuery.data || [])
    .slice()
    .sort((a, b) => (a.categoryId || a.id) - (b.categoryId || b.id));

  const filteredCategories = categories.filter((c) =>
    c.name?.toLowerCase().includes(categorySearch.toLowerCase()),
  );

  const products = (productsQuery.data?.items || productsQuery.data || [])
    .slice()
    .sort((a, b) => b.id - a.id);

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.categoryId || editingCategory.id, payload: categoryForm });
    } else {
      createCategoryMutation.mutate(categoryForm);
    }
  };

  const confirmDelete = (id) => {
    setProductToDelete(id);
    document.getElementById('delete_modal').showModal();
  };

  const confirmDeleteCategory = (id) => {
    setCategoryToDelete(id);
    document.getElementById('delete_category_modal').showModal();
  };

  return (
    <div className="space-y-8 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Catalog Management</h1>
          <p className="opacity-70 text-sm">
            Organize categories and products for all traders.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/catalog/create")}>
          Add New Product
        </button>
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body border rounded-lg">
            <h2 className="card-title text-sm uppercase tracking-widest opacity-60">
              {editingCategory ? "Edit Category" : "New Category"}
            </h2>
            <form onSubmit={handleCategorySubmit} className="flex gap-2">
              <input
                className="input input-bordered grow"
                placeholder="Category Name"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ name: e.target.value })}
                required
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={createCategoryMutation.isPending || (updateCategoryMutation && updateCategoryMutation.isPending)}
              >
                {editingCategory ? "Update" : "Add"}
              </button>
              {editingCategory && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setEditingCategory(null);
                    setCategoryForm({ name: "" });
                  }}
                >
                  Cancel
                </button>
              )}
            </form>

            <div className="mt-4">
              <input
                type="text"
                className="input w-full "
                placeholder="Search categories..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
              />
            </div>

            <div className="mt-2 max-h-60 overflow-auto border rounded-lg">
              <table className="table table-zebra table-sm">
                <thead className="bg-base-200">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((c) => (
                    <tr key={c.id}>
                      <td className="font-mono text-xs">
                        {c.categoryId || c.id}
                      </td>
                      <td className="font-medium">{c.name}</td>
                      <td className="text-right border-b border-base-200">
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm text-primary"
                          onClick={() => {
                            setEditingCategory(c);
                            setCategoryForm({ name: c.name });
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm text-error"
                          onClick={() => confirmDeleteCategory(c.categoryId || c.id)}
                        >
                          <Trash size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="card bg-base-100 shadow-sm border border-base-200">
        <div className="card-body p-0 border rounded-lg">
          <div className="p-4 border-b">
            <h2 className="font-bold">Product Inventory</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="table border-collapse w-full">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td className="font-mono text-xs">{p.id}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="font-bold">{p.name}</div>
                      </div>
                    </td>
                    <td>
                      <div className="badge badge-ghost badge-sm">
                        {p.category_name || `ID: ${p.category_id}`}
                      </div>
                    </td>
                    <td className="font-mono">${p.price}</td>
                    <td className="border-r border-b border-base-200">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className={`toggle toggle-sm ${p.active ? "toggle-success" : " "}`}
                          checked={p.active}
                          disabled={toggleActiveMutation.isPending}
                          onChange={(e) =>
                            toggleActiveMutation.mutate({
                              id: p.id,
                              active: e.target.checked,
                            })
                          }
                        />
                        <span
                          className={`text-[10px] font-bold uppercase ${p.active ? "text-success" : "text-error"}`}
                        >
                          {p.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>
                    <td className="text-right border-b border-base-200">
                      <button
                        className="btn btn-ghost btn-sm text-primary"
                        onClick={() => navigate(`/catalog/${p.id}/edit`)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-ghost btn-sm text-error ml-2"
                        onClick={() => confirmDelete(p.id)}
                      >
                        <Trash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      <dialog id="delete_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-error">Confirm Deletion</h3>
          <p className="py-4">Are you sure you want to delete this item? This action cannot be undone.</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn mr-2" onClick={() => setProductToDelete(null)}>Cancel</button>
              <button
                className="btn btn-error"
                onClick={(e) => {
                  e.preventDefault();
                  deleteProductMutation.mutate();
                }}
                disabled={deleteProductMutation.isPending}
              >
                Delete
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setProductToDelete(null)}>close</button>
        </form>
      </dialog>

      {/* Delete Category Confirmation Modal */}
      <dialog id="delete_category_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-error">Confirm Deletion</h3>
          <p className="py-4">Are you sure you want to delete this category? This action cannot be undone.</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn mr-2" onClick={() => setCategoryToDelete(null)}>Cancel</button>
              <button
                className="btn btn-error"
                onClick={(e) => {
                  e.preventDefault();
                  deleteCategoryMutation.mutate();
                }}
                disabled={deleteCategoryMutation.isPending}
              >
                Delete
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setCategoryToDelete(null)}>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default CatalogPage;