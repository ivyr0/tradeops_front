import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../auth/useAuthStore";
import {
  Boxes,
  Truck,
  LogOut,
} from "lucide-react";
import { appRoutes } from "../../app/routes";
import { hasAnyRole } from "../../auth/roles";

const Sidebar = ({ user, closeDrawer }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const displayName = user?.username || "Admin";
  const role = user?.role;
  const menuItems = appRoutes.filter((r) => !r.hidden);

  return (
    <div className="drawer-side z-40">
      <label htmlFor="my-drawer" className="drawer-overlay"></label>
      <div className="menu p-4 w-72 min-h-full bg-base-100 text-base-content flex flex-col">
        <div className="flex items-center gap-4 px-4 py-8">
          <div className="bg-primary text-primary-content p-2 rounded-lg">
            <Boxes size={24} />
          </div>
          <h1 className="textarea-lg font-black tracking-tight uppercase">
            Company-admin
          </h1>
        </div>

        <ul className="space-y-2 flex-1 pt-3.5">
          {menuItems
            .filter((item) => hasAnyRole({ role }, item.roles))
            .map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={closeDrawer}
                  className={`flex items-center gap-4 py-3 px-4 rounded-xl transition-all ${
                    location.pathname === item.path
                      ? "bg-primary text-primary-content shadow-lg"
                      : "hover:bg-base-200"
                  }`}
                >
                  {item.icon ? <item.icon size={20} /> : null}
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
        </ul>

        <div className="border-t border-base-300 pt-6 mt-6">
          <div className="flex items-center gap-3 px-4 mb-6">
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-10">
                <span className="font-bold text-sm">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold leading-none">{displayName}</p>
              <p className="text-xs opacity-50 mt-1">{role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-outline btn-error btn-block gap-2 border-none"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
