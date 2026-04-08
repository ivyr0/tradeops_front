import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../../api/error";
import { createProduct, uploadProductImage, fetchCategories } from "../api/catalog";

const CreateProductPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [productForm, setProductForm] = useState({ name: "", category_id: "", price: "" });
  const [productFile, setProductFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const categoriesQuery = useQuery({ queryKey: ["admin", "categories"], queryFn: fetchCategories });
  const categories = (categoriesQuery.data?.items || categoriesQuery.data || [])
    .slice()
    .sort((a, b) => (a.categoryId || a.id) - (b.categoryId || b.id));

  const createProductMutation = useMutation({
    mutationFn: async ({ payload, file }) => {
      const product = await createProduct(payload);
      const productId = product.id || product.productId;
      if (productId && file) {
        await uploadProductImage(productId, file);
      }
      return product;
    },
    onSuccess: () => {
      toast.success("Product created successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      navigate("/catalog");
    },
    onError: (e) => toast.error(getErrorMessage(e, "Failed to create product")),
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProductFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    createProductMutation.mutate({ payload: productForm, file: productFile });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      <div>
        <h1 className="text-2xl font-bold">Add New Product</h1>
        <p className="opacity-70 text-sm">Create a new item in the catalog.</p>
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

            <div className="form-control">
              <label className="label"><span className="label-text">Product Image</span></label>
              <input
                type="file"
                className="file-input file-input-bordered w-full"
                onChange={handleFileChange}
              />
            </div>

            {previewUrl && (
              <div className="flex items-center gap-4 p-2 bg-base-200 rounded-lg">
                <img src={previewUrl} className="w-12 h-12 object-cover rounded shadow" alt="Preview" />
                <span className="text-xs truncate grow">{productFile?.name}</span>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  onClick={() => {
                    setProductFile(null);
                    setPreviewUrl(null);
                  }}
                >
                  ✕
                </button>
              </div>
            )}

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
                disabled={createProductMutation.isPending}
              >
                Create Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProductPage;
