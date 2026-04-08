import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchOrders } from "../api/orders";
import { getErrorMessage } from "../../../api/error";

const OrdersPage = () => {
  const [statusFilter, setStatusFilter] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin", "orders", statusFilter],
    queryFn: () => fetchOrders(statusFilter ? { status: statusFilter } : {}),
  });

  if (isLoading) {
    return <div className="loading loading-spinner" />;
  }

  if (isError) {
    return (
      <div className="alert alert-error">
        <span>{getErrorMessage(error, "Failed to load orders")}</span>
      </div>
    );
  }

  const orders = data?.content || data?.items || data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="opacity-70 text-sm">
            Manage customer orders and assignments.
          </p>
        </div>
        <select
          className="select select-bordered"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="NEW">New</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-base-100 shadow-sm">
        <table className="table table-zebra border">
          <thead>
            <tr>
              <th>#</th>
              <th>Status</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Courier</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.order_number || o.id}</td>
                <td>{o.status}</td>
                <td>{o.customer_name || o.customer_external_id}</td>
                <td>{o.total}</td>
                <td>{o.courier_name || "-"}</td>
                <td>
                  <Link className="btn btn-ghost btn-xs" to={`/orders/${o.id}`}>
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {!orders.length && (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;

