import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../../api/error";
import { fetchProductById, updateProduct, fetchCategories } from "../api/catalog";

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [productForm, setProductForm] = useState({ name: "", category_id: "", price: "" });

  const categoriesQuery = useQuery({ queryKey: ["admin", "categories"], queryFn: fetchCategories });
  const categories = (categoriesQuery.data?.items || categoriesQuery.data || [])
    .slice()
    .sort((a, b) => (a.categoryId || a.id) - (b.categoryId || b.id));

  const productQuery = useQuery({
    queryKey: ["admin", "product", id],
    queryFn: () => fetchProductById(id),
  });

  useEffect(() => {
    if (productQuery.data) {
      setProductForm({
        name: productQuery.data.productName || productQuery.data.name || "",
        category_id: productQuery.data.categoryId || productQuery.data.category_id || "",
        price: productQuery.data.price || productQuery.data.basePrice || "",
      });
    }
  }, [productQuery.data]);

  const updateProductMutation = useMutation({
    mutationFn: (payload) => updateProduct(id, payload),
    onSuccess: () => {
      toast.success("Product updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "product", id] });
      navigate("/catalog");
    },
    onError: (e) => toast.error(getErrorMessage(e, "Failed to update product")),
  });

  const handleProductSubmit = (e) => {
    e.preventDefault();
    updateProductMutation.mutate(productForm);
  };

  if (productQuery.isLoading) return <div className="p-4">Loading...</div>;

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      <div>
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <p className="opacity-70 text-sm">Update item details.</p>
      </div>
      <div className="card bg-base-100 shadow-sm border border-base-200">
        <div className="card-body">
          <form onSubmit={handleProductSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label"><span className="label-text">Product Name</span></label>
              <input
                className="input input-bordered w-full"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                required
              />
            </div>
            
            <div className="form-control">
              <label className="label"><span className="label-text">Category</span></label>
              <select
                className="select select-bordered w-full"
                value={productForm.category_id}
                onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                required
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.categoryId || c.id}>
                    {c.name} (ID: {c.categoryId || c.id})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Price</span></label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                required
              />
            </div>

            <div className="flex gap-4 mt-6">
              <button
                type="button"
                className="btn btn-ghost flex-1"
                onClick={() => navigate("/catalog")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-1"
                disabled={updateProductMutation.isPending}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;
