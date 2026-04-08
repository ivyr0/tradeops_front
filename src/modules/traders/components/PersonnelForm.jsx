import { useState } from "react";
import { useTraderActions } from "../hooks/useTradersActions";

const PersonnelForm = ({ traders = [], isLoading }) => {
  const { createPersonnel, isCreatingPersonnel } = useTraderActions();

  const [traderId, setTraderId] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "ROLE_TRADER_ADMIN",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    createPersonnel(
      { traderId, payload: form },
      {
        onSuccess: () =>
          setForm({
            name: "",
            email: "",
            password: "",
            role: "ROLE_TRADER_ADMIN",
          }),
      },
    );
  };

  return (
    <section className="card bg-base-100 shadow-sm border rounded-lg">
      <div className="card-body space-y-3">
        <h2 className="card-title">Create Trader Personnel</h2>
        <form className="grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
          <select
            disabled={isLoading}
            className="select select-bordered w-full"
            value={traderId}
            onChange={(e) => setTraderId(e.target.value)}
            required
          >
            <option>
              {isLoading ? "Fetching Traders..." : "Select Trader"}
            </option>
            {!isLoading &&
              traders.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.displayName} ({t.domain})
                </option>
              ))}
          </select>

          <input
            className="input input-bordered w-full"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="email"
            className="input input-bordered w-full"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            className="input input-bordered w-full"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <select
            className="select select-bordered w-full"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="ROLE_TRADER_ADMIN">ROLE_TRADER_ADMIN</option>
            <option value="ROLE_TRADER_STAFF">ROLE_TRADER_STAFF</option>
            <option value="ROLE_WAREHOUSE_OPS">ROLE_WAREHOUSE_OPS</option>
          </select>

          <button
            type="submit"
            className={`btn btn-primary w-full md:w-auto ${isCreatingPersonnel ? "loading" : ""}`}
            disabled={isCreatingPersonnel}
          >
            Create user
          </button>
        </form>
      </div>
    </section>
  );
};

export default PersonnelForm;
