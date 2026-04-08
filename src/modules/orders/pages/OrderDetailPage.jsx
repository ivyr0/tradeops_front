import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../../api/error";
import {
  fetchOrderById,
  updateOrderStatus,
  assignCourier,
  unassignCourier,
} from "../api/orders";
import { fetchCouriers } from "../../couriers/api/couriers";

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const queryClient = useQueryClient();

  const orderQuery = useQuery({
    queryKey: ["admin", "order", orderId],
    queryFn: () => fetchOrderById(orderId),
  });

  const couriersQuery = useQuery({
    queryKey: ["admin", "couriers"],
    queryFn: fetchCouriers,
  });

  const statusMutation = useMutation({
    mutationFn: ({ status }) => updateOrderStatus(orderId, status),
    onSuccess: () => {
      toast.success("Status updated");
      queryClient.invalidateQueries({ queryKey: ["admin", "order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
    onError: (e) => toast.error(getErrorMessage(e, "Failed to update status")),
  });

  const assignMutation = useMutation({
    mutationFn: ({ courierId }) => assignCourier(orderId, courierId),
    onSuccess: () => {
      toast.success("Courier assigned");
      queryClient.invalidateQueries({ queryKey: ["admin", "order", orderId] });
    },
    onError: (e) => toast.error(getErrorMessage(e, "Failed to assign courier")),
  });

  const unassignMutation = useMutation({
    mutationFn: () => unassignCourier(orderId),
    onSuccess: () => {
      toast.success("Courier unassigned");
      queryClient.invalidateQueries({ queryKey: ["admin", "order", orderId] });
    },
    onError: (e) => toast.error(getErrorMessage(e, "Failed to unassign courier")),
  });

  if (orderQuery.isLoading || couriersQuery.isLoading) {
    return <div className="loading loading-spinner" />;
  }

  if (orderQuery.isError) {
    return (
      <div className="alert alert-error">
        <span>{getErrorMessage(orderQuery.error, "Failed to load order")}</span>
      </div>
    );
  }

  const order = orderQuery.data;
  const couriers =
    couriersQuery.data?.content ||
    couriersQuery.data?.items ||
    couriersQuery.data ||
    [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Order #{order.order_number || order.id}
          </h1>
          <p className="opacity-70 text-sm">
            Customer: {order.customer_name || order.customer_external_id}
          </p>
        </div>
        <div>
          <select
            className="select select-bordered mr-2"
            value={order.status}
            onChange={(e) =>
              statusMutation.mutate({ status: e.target.value })
            }
          >
            <option value="NEW">New</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <section className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Items</h2>
          <ul className="space-y-1">
            {order.items?.map((item, idx) => (
              <li key={idx} className="flex justify-between text-sm">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{item.price}</span>
              </li>
            )) || <p>No items.</p>}
          </ul>
        </div>
      </section>

      <section className="card bg-base-100 shadow-sm">
        <div className="card-body space-y-3">
          <h2 className="card-title">Courier assignment</h2>
          <p className="text-sm">
            Current courier:{" "}
            <span className="font-semibold">
              {order.courier_name || order.courier_id || "Unassigned"}
            </span>
          </p>
          <div className="flex flex-col md:flex-row gap-3">
            <select
              className="select select-bordered flex-1"
              defaultValue=""
              onChange={(e) => {
                const id = e.target.value;
                if (id) assignMutation.mutate({ courierId: id });
              }}
            >
              <option value="">Select courier</option>
              {couriers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
            <button
              className={`btn btn-outline ${
                unassignMutation.isPending ? "loading" : ""
              }`}
              onClick={() => unassignMutation.mutate()}
            >
              Unassign courier
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderDetailPage;

