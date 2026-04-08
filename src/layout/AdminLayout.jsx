import { Outlet, Routes, Route, Navigate } from "react-router-dom";
import { Navbar, Sidebar } from "./components"
import { useAuthStore } from "../auth/useAuthStore";
import RequireRole from "../auth/RequireRole";
import { appRoutes } from "../app/routes";
import NotFound from "../app/NotFound";

const AdminLayout = () => {
  const { user } = useAuthStore();

  const closeDrawer = () => {
    const drawer = document.getElementById("my-drawer");
    if (drawer) drawer.checked = false;
  };

  return (
    <div className="drawer lg:drawer-open bg-base-200 min-h-screen">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        <Navbar />
        <div className="p-6 lg:p-10">
          <main className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              {appRoutes.map((r) => (
                <Route
                  key={r.path}
                  path={r.path}
                  element={
                    <RequireRole roles={r.roles}>
                      {(() => {
                        const Component = r.component;
                        return <Component />;
                      })()}
                    </RequireRole>
                  }
                />
              ))}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
      <Sidebar user={user} closeDrawer={closeDrawer} />
    </div>
  );
};

export default AdminLayout;
