import { useState } from "react";
import { useAuthStore } from "../auth/useAuthStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { User, KeyRound } from "lucide-react";
import { getErrorMessage } from "../api/error";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!credentials.email.trim()) {
      toast.error("User Name is required");
      return false;
    }

    if (!credentials.password) {
      toast.error("Password is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    const result = await login(credentials);

    if (result.success) {
      toast.success("Welcome back!");
      navigate("/dashboard");
    } else {
      toast.error(getErrorMessage(result.error, "Invalid credentials"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl">
        <div className="card-body">
          <div className="flex flex-col items-center mb-5">
            <h1 className="text-3xl font-bold text-primary">Company Admin</h1>
            <p className="text-base-content/60 pt-3">
              Enter your credentials to manage platform
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4.5">
            <div className="form-control">
              <label className="label pb-3">
                <span className="label-text font-bold text-gray-600">
                  User Name
                </span>
              </label>
              <label className="input input-bordered flex items-center gap-3 w-full focus-within:border-primary transition-all">
                <User />
                <input
                  type="text"
                  name="email"
                  className="grow border-none focus:ring-0 p-0 text-sm"
                  placeholder="Enter your username"
                  value={credentials.email}
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="form-control">
              <label className="label pb-3">
                <span className="label-text font-bold text-gray-600">
                  Password
                </span>
              </label>
              <label className="input input-bordered flex items-center gap-3 w-full focus-within:border-primary transition-all">
                <KeyRound />
                <input
                  type="password"
                  name="password"
                  className="grow border-none focus:ring-0 p-0 text-sm"
                  placeholder="••••••••"
                  value={credentials.password}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn btn-primary w-full ${isLoggingIn ? "loading" : ""}`}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "Authenticating..." : "Login"}
              </button>
            </div>
          </form>

          <div className="divider py-3">System Access Only</div>

          <p className="text-xs text-center text-base-content/50">
            Secure Master Admin Panel v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
