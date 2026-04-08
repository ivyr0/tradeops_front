import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import { useAuthStore } from "./auth/useAuthStore";
import Login from "./auth/Login"; 
import AdminLayout from "./layout/AdminLayout";
import LandingPage from "./app/LandingPage";
import NotFound from "./app/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  const { user } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            className: "alert shadow-lg border-1 border-primary bg-base-100",
            style: {
              borderRadius: "5px",
              background: "#333",
              color: "#fff",
            },
          }}
        />

        <Routes>
          <Route
            path="/"
            element={!user ? <LandingPage /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/*"
            element={user ? <AdminLayout /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter> 
    </QueryClientProvider>
  );
};

export default App;
