import {
  LayoutDashboard,
  Store,
  Package,
  Boxes,
  Truck,
  History,
  User,
} from "lucide-react";

import DashboardRoute from "./DashboardRoute.jsx";
import {
  TradersPage,
  CatalogPage,
  InventoryPage,
  OrdersPage,
  OrderDetailPage,
  CouriersPage,
  AuditLogsPage,
  ProfilePage,
  CreateProductPage,
  EditProductPage,
} from "../modules";

export const appRoutes = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["ROLE_SUPER_ADMIN", "ROLE_MANAGER"],
    component: DashboardRoute,
  },
  {
    path: "/traders",
    label: "Traders",
    icon: Store,
    roles: ["ROLE_SUPER_ADMIN", "ROLE_MODERATOR"],
    component: TradersPage,
  },
  {
    path: "/catalog",
    label: "Catalog",
    icon: Package,
    roles: ["ROLE_SUPER_ADMIN", "ROLE_MANAGER"],
    component: CatalogPage,
  },
  {
    path: "/catalog/create",
    roles: ["ROLE_SUPER_ADMIN", "ROLE_MANAGER"],
    component: CreateProductPage,
    hidden: true,
  },
  {
    path: "/catalog/:id/edit",
    roles: ["ROLE_SUPER_ADMIN", "ROLE_MANAGER"],
    component: EditProductPage,
    hidden: true,
  },
  {
    path: "/inventory",
    label: "Inventory",
    icon: Boxes,
    roles: ["ROLE_SUPER_ADMIN", "ROLE_MANAGER"],
    component: InventoryPage,
  },
  {
    path: "/orders",
    label: "Orders",
    icon: Boxes,
    roles: ["ROLE_SUPER_ADMIN", "ROLE_MANAGER"],
    component: OrdersPage,
  },
  {
    path: "/orders/:orderId",
    roles: ["ROLE_SUPER_ADMIN", "ROLE_MANAGER"],
    component: OrderDetailPage,
    hidden: true,
  },
  {
    path: "/couriers",
    label: "Couriers",
    icon: Truck,
    roles: ["ROLE_SUPER_ADMIN"],
    component: CouriersPage,
  },
  {
    path: "/audit",
    label: "Audit Logs",
    icon: History,
    roles: ["ROLE_SUPER_ADMIN"],
    component: AuditLogsPage,
  },
  {
    path: "/profile",
    label: "Profile",
    icon: User,
    roles: ["ROLE_SUPER_ADMIN", "ROLE_MANAGER", "ROLE_MODERATOR"],
    component: ProfilePage,
  },
];

