import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../../../auth/useAuthStore";
import api from "../../../api/http";
import { getErrorMessage } from "../../../api/error";

const fetchProfile = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

const ProfilePage = () => {
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const { data: profileData, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: fetchProfile,
  });

  useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData.fullName || profileData.name || "",
        email: profileData.email || "",
      });
    } else if (!isLoading && user) {
      setFormData({
        name: user.name || user.fullName || "",
        email: user.email || "",
      });
    }
  }, [profileData, user, isLoading]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateProfileMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post("/auth/update-profile", payload);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      if (setUser && data) {
        // optionally update local store if the store supports modifying user
        setUser({ ...user, name: data.fullName || data.name, email: data.email });
      }
    },
    onError: (e) => toast.error(getErrorMessage(e, "Failed to update profile")),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Name is required");
      return;
    }
    updateProfileMutation.mutate({ fullName: formData.name });
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
                  {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
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
                <span className="label-text">Name / FullName</span>
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
              <p className="px-1 py-2 font-medium opacity-80">{formData.email || "—"}</p>
            </div>

            <div className="mt-6 flex justify-between items-center bg-base-200 p-4 rounded-lg">
              <div>
                <p className="font-bold text-sm">Security</p>
                <p className="opacity-60 text-xs mt-1">Keep your account secure by rotating keys.</p>
              </div>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => navigate("/profile/change-password")}
              >
                Change Password
              </button>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className={`btn btn-primary w-full md:w-auto ${updateProfileMutation.isPending ? "loading" : ""}`}
                disabled={updateProfileMutation.isPending}
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
