import { Link } from "react-router-dom";
import { useAuthStore } from "../auth/useAuthStore";

const LandingPage = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-base-200">
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold text-primary">TradeOps</h1>
            <p className="py-6 text-lg opacity-80">
              The complete admin system for managing your e-commerce company.
              Monitor traders, manage catalog, track inventory, and handle orders smoothly.
            </p>
            {user ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Go to Dashboard
              </Link>
            ) : (
              <Link to="/login" className="btn btn-primary btn-lg">
                Login / Access System
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
