import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../../api/http";
import { getErrorMessage } from "../../../api/error";

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post("/auth/change-password", {
        oldPassword: payload.oldPassword,
        newPassword: payload.newPassword,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Password changed successfully");
      navigate("/profile");
    },
    onError: (e) => toast.error(getErrorMessage(e, "Failed to change password")),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (!passwords.oldPassword || !passwords.newPassword) {
      toast.error("Please fill required fields");
      return;
    }
    changePasswordMutation.mutate(passwords);
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto p-4">
      <div>
        <h1 className="text-2xl font-bold">Change Password</h1>
        <p className="opacity-70 text-sm">Update your account security.</p>
      </div>
      <div className="card bg-base-100 shadow-sm border border-base-200">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label"><span className="label-text">Current Password</span></label>
              <input
                type="password"
                className="input input-bordered w-full"
                value={passwords.oldPassword}
                onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                required
              />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">New Password</span></label>
              <input
                type="password"
                className="input input-bordered w-full"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                required
              />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Confirm New Password</span></label>
              <input
                type="password"
                className="input input-bordered w-full"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                required
              />
            </div>

            <div className="flex gap-4 mt-6">
              <button
                type="button"
                className="btn btn-ghost flex-1"
                onClick={() => navigate("/profile")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-1"
                disabled={changePasswordMutation.isPending}
              >
                Change Security Key
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
