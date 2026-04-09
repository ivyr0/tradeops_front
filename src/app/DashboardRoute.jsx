import { Users, ShoppingCart, Activity } from "lucide-react";
import { fetchTradersCount, fetchOrdersCount } from "../modules/traders/api/traders";
import { useQuery } from "@tanstack/react-query";

const DashboardRoute = () => {
  const { data: tradersCount = 0 } = useQuery({
    queryKey: ["admin", "traders", "count"],
    queryFn: fetchTradersCount
  });

  const { data: ordersCount = 0 } = useQuery({
    queryKey: ["admin", "orders", "count"],
    queryFn: fetchOrdersCount
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="opacity-70">
          Welcome to Company Admin. Use the sidebar to manage traders, catalog,
          inventory, orders, couriers, and audit logs.
        </p>
      </div>

      <div className="stats shadow w-full bg-base-100 border border-base-200">
        <div className="stat">
          <div className="stat-figure text-primary">
            <Users size={32} />
          </div>
          <div className="stat-title">Total Traders</div>
          <div className="stat-value text-primary">{tradersCount || 0}</div>
          <div className="stat-desc">100% more than last month</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <ShoppingCart size={32} />
          </div>
          <div className="stat-title">Active Orders</div>
          <div className="stat-value text-secondary">{ordersCount || 0}</div>
          <div className="stat-desc">0 awaiting processing</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-accent">
            <Activity size={32} />
          </div>
          <div className="stat-title">System Health</div>
          <div className="stat-value text-accent">99.9%</div>
          <div className="stat-desc">All services operational</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardRoute;
