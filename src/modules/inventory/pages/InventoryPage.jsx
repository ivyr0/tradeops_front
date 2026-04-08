import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { fetchInventory, adjustStock } from "../api/inventory";
import { fetchProducts } from "../../catalog/api/catalog";
import { getErrorMessage } from "../../../api/error";

const InventoryPage = () => {
  const queryClient = useQueryClient();
  const [adjustValue, setAdjustValue] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin", "inventory"],
    queryFn: fetchInventory,
  });

  const {
    data: catalogProducts = [],
    isLoading: catalogLoading,
  } = useQuery({
    queryKey: ["admin", "products", "all"],
    queryFn: () => fetchProducts({ size: 1000 }),
  });

  const adjustMutation = useMutation({
    mutationFn: ({ id, delta }) => adjustStock(id, delta),
    onSuccess: () => {
      toast.success("Stock adjusted");
      setErrorMessage(null);
      setAdjustValue("");
      queryClient.invalidateQueries({ queryKey: ["admin", "inventory"] });
    },
    onError: (err) => {
      setErrorMessage(getErrorMessage(err, "Failed to adjust"));
    },
  });

  if (isLoading) {
    return <div className="loading loading-spinner" />;
  }

  if (isError) {
    return (
      <div className="alert alert-error">
        <span>{getErrorMessage(error, "Failed to load inventory")}</span>
      </div>
    );
  }

  const rows = data?.content || data?.items || data || [];

  const handleAdjustSubmit = (e) => {
    e.preventDefault();
    if (!selectedId) return;
    const newQty = Number(adjustValue);
    if (Number.isNaN(newQty)) return;
    adjustMutation.mutate({ id: selectedId, delta: newQty });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Inventory</h1>
        <p className="opacity-70 text-sm">
          View stock levels and adjust quantities.
        </p>
      </div>

      <section className="card bg-base-100 shadow-sm">
        <div className="card-body border rounded-lg">
          <h2 className="card-title">Adjust stock</h2>
          {errorMessage && (
            <div className="alert alert-error mb-3">
              <span>{errorMessage}</span>
            </div>
          )}
          <form
            className="flex flex-col md:flex-row gap-3"
            onSubmit={handleAdjustSubmit}
          >
            <select
              className="select select-bordered flex-1"
              value={selectedId || ""}
              onChange={(e) => setSelectedId(e.target.value || null)}
            >
              <option value="">Select item</option>
              {catalogProducts.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.name} (ID: {prod.id})
                </option>
              ))}
            </select>
            <input
              className="input input-bordered w-full md:w-40"
              placeholder="New qty on hand"
              value={adjustValue}
              onChange={(e) => setAdjustValue(e.target.value)}
            />
            <button
              type="submit"
              className={`btn btn-primary ${adjustMutation.isPending ? "loading" : ""
                }`}
              disabled={adjustMutation.isPending}
            >
              Apply
            </button>
          </form>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Inventory list</h2>
        <div className="overflow-x-auto bg-base-100 shadow-sm">
          <table className="table table-zebra border">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product</th>
                <th>On hand</th>
                <th>Reserved</th>
                <th>Available</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => {
                const id = row.productId || row.id || idx;
                const catalogProduct = catalogProducts.find(p => p.id === id);

                const name = catalogProduct?.name || row.productName || row.product_name || `Product #${id}`;
                const sku = catalogProduct?.sku || row.sku || "-";

                const qtyOnHand = row.qtyOnHand !== undefined ? row.qtyOnHand : (row.qty_on_hand || 0);
                const qtyReserved = row.qtyReserved !== undefined ? row.qtyReserved : (row.qty_reserved || 0);
                const available = row.available !== undefined ? row.available : (qtyOnHand - qtyReserved);

                return (
                  <tr key={id}>
                    <td>{sku}</td>
                    <td>{name}</td>
                    <td>{qtyOnHand}</td>
                    <td>{qtyReserved}</td>
                    <td>{available}</td>
                  </tr>
                );
              })}
              {!rows.length && (
                <tr>
                  <td colSpan={5} className="text-center py-6">
                    No inventory records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default InventoryPage;

