import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../../../auth/useAuthStore";

const ProfilePage = () => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || user?.username || "",
    email: user?.email || "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Name is required");
      return;
    }
    toast.success("Profile updated successfully (Mock)");
    setFormData({ ...formData, password: "" });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="opacity-70 text-sm">Manage your personal settings.</p>
      </div>

      <div className="card bg-base-100 shadow-sm border border-base-200">
        <div className="card-body">
          <div className="flex items-center gap-4 mb-6">
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-16">
                <span className="text-xl">
                  {formData.name.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold">{formData.name || "User"}</h2>
              <div className="badge badge-primary badge-outline mt-1">
                {user?.role || "User"}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name / Username</span>
              </label>
              <input
                type="text"
                name="name"
                className="input input-bordered w-full"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email Address</span>
              </label>
              <input
                type="email"
                name="email"
                className="input input-bordered w-full"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Update Password</span>
              </label>
              <input
                type="password"
                name="password"
                className="input input-bordered w-full"
                placeholder="Leave blank to keep current password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="mt-6 flex justify-end">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
