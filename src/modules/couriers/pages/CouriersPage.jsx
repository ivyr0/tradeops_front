import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Trash } from "lucide-react";
import { getErrorMessage } from "../../../api/error";
import {
  fetchCouriers,
  createCourier,
  updateCourier,
  setCourierActive,
  deleteCourier,
} from "../api/couriers";

const CouriersPage = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    active: true,
  });
  const [editingCourier, setEditingCourier] = useState(null);
  const [courierToDelete, setCourierToDelete] = useState(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin", "couriers"],
    queryFn: fetchCouriers,
  });

  const createMutation = useMutation({
    mutationFn: createCourier,
    onSuccess: () => {
      toast.success("Courier created");
      setForm({ name: "", phone: "", password: "", active: true });
      queryClient.invalidateQueries({ queryKey: ["admin", "couriers"] });
    },
    onError: (e) => toast.error(getErrorMessage(e, "Failed to create courier")),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateCourier(id, payload),
    onSuccess: () => {
      toast.success("Courier updated");
      setEditingCourier(null);
      setForm({ name: "", phone: "", password: "", active: true });
      queryClient.invalidateQueries({ queryKey: ["admin", "couriers"] });
    },
    onError: (e) => toast.error(getErrorMessage(e, "Failed to update courier")),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, active }) => setCourierActive(id, active),
    onSuccess: () => {
      toast.success("Status updated");
      queryClient.invalidateQueries({ queryKey: ["admin", "couriers"] });
    },
    onError: (e) => toast.error(getErrorMessage(e, "Failed to change status")),
  });

  const deleteCourierMutation = useMutation({
    mutationFn: () => deleteCourier(courierToDelete),
    onSuccess: () => {
      toast.success("Courier deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "couriers"] });
      setCourierToDelete(null);
      document.getElementById('delete_courier_modal').close();
    },
    onError: (e) => toast.error(getErrorMessage(e, "Failed to delete courier")),
  });

  const couriers = data?.content || data?.items || data || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      phone: form.phone,
      isActive: form.active, 
      ...(form.password && { password: form.password }),
    };

    if (editingCourier) {
      updateMutation.mutate({ id: editingCourier.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const startEdit = (courier) => {
    setEditingCourier(courier);
    setForm({
      name: courier.name,
      phone: courier.phone,
      password: "",
      active: courier.isActive ?? courier.active,
    });
  };

  const confirmDelete = (id) => {
    setCourierToDelete(id);
    document.getElementById('delete_courier_modal').showModal();
  };

  if (isLoading) return <div className="loading loading-spinner" />;
  if (isError)
    return (
      <div className="alert alert-error">
        <span>{getErrorMessage(error, "Error")}</span>
      </div>
    );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Couriers</h1>
        <p className="opacity-70 text-sm">
          Manage accounts and quick-toggle status.
        </p>
      </header>

      <section className="card bg-base-100 shadow-sm border">
        <div className="card-body p-6">
          <h2 className="card-title text-sm uppercase tracking-widest opacity-60">
            {editingCourier ? "Edit Mode" : "New Courier"}
          </h2>
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            onSubmit={handleSubmit}
          >
            <input
              className="input input-bordered w-full"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
            <input
              className="input input-bordered w-full"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) =>
                setForm((p) => ({ ...p, phone: e.target.value }))
              }
              required
            />
            <input
              type="password"
              className="input input-bordered w-full"
              placeholder={
                editingCourier ? "New password (optional)" : "Password"
              }
              value={form.password}
              onChange={(e) =>
                setForm((p) => ({ ...p, password: e.target.value }))
              }
              required={!editingCourier}
            />
            <div className="flex items-center gap-4">
              <label className="label cursor-pointer gap-2">
                <span className="label-text">Active</span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={form.active}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, active: e.target.checked }))
                  }
                />
              </label>
              <div className="flex gap-2 ml-auto">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {editingCourier ? "Update" : "Create"}
                </button>
                {editingCourier && (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => {
                      setEditingCourier(null);
                      setForm({
                        name: "",
                        phone: "",
                        password: "",
                        active: true,
                      });
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </section>

      <div className="overflow-x-auto bg-base-100 rounded-xl shadow-sm border">
        <table className="table">
          <thead>
            <tr>
              <th>Courier</th>
              <th>Phone</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {couriers.map((c) => {
              const isCourierActive = c.isActive ?? c.active;

              return (
                <tr key={c.id} className="hover transition-colors">
                  <td className="font-medium">
                    <div className="flex flex-col">
                      <span>{c.name}</span>
                      <span className="text-xs opacity-50 md:hidden">
                        {c.phone}
                      </span>
                    </div>
                  </td>
                  <td className="hidden md:table-cell">{c.phone}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className={`toggle toggle-sm ${isCourierActive ? "toggle-success" : ""}`}
                        checked={isCourierActive}
                        disabled={statusMutation.isPending}
                        onChange={(e) =>
                          statusMutation.mutate({
                            id: c.id,
                            active: e.target.checked,
                          })
                        }
                      />
                      <span
                        className={`badge badge-sm font-semibold py-3 px-3 text${
                          isCourierActive
                            ? "badge-success bg-opacity-10 text-success border-none"
                            : "badge-error bg-opacity-10 text-error border-none"
                        }`}
                      >
                        {isCourierActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </div>
                  </td>
                  <td className="text-right">
                    <button
                      className="btn btn-ghost btn-sm text-primary hover:bg-primary hover:text-white transition-all"
                      onClick={() => startEdit(c)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-ghost btn-sm text-error ml-2"
                      onClick={() => confirmDelete(c.id)}
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {!couriers.length && (
              <tr>
                <td colSpan={4} className="text-center py-10 opacity-40 italic">
                  No couriers found in the system.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <dialog id="delete_courier_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-error">Confirm Deletion</h3>
          <p className="py-4">Are you sure you want to delete this courier? This action cannot be undone.</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn mr-2" onClick={() => setCourierToDelete(null)}>Cancel</button>
              <button 
                className="btn btn-error" 
                onClick={(e) => {
                  e.preventDefault();
                  deleteCourierMutation.mutate();
                }}
                disabled={deleteCourierMutation.isPending}
              >
                Delete
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setCourierToDelete(null)}>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default CouriersPage;
