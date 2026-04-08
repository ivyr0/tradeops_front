import { Menu } from "lucide-react";

const Navbar = () => {
  return (
    <div className="navbar bg-base-100 lg:hidden shadow-sm">
      <div className="flex-none">
        <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
          <Menu />
        </label>
      </div>
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">Company Admin</a>
      </div>
    </div>
  );
};

export default Navbar;
