import { useState } from "react";
import { useTraderActions } from "../hooks/useTradersActions";

const CreateTraderForm = () => {
  const { createTrader, isCreating } = useTraderActions();
  const [form, setForm] = useState({
    name: "",
    domain: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createTrader(form, {
      onSuccess: () => setForm({ name: "", domain: "" }),
    });
  };

  return (
    <div className="card bg-base-100 shadow-sm border rounded-lg">
      <div className="card-body">
        <h2 className="card-title">Create trader</h2>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            className="input input-bordered w-full"
            placeholder="Display name"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
          <input
            className="input input-bordered w-full"
            placeholder="Domain"
            value={form.domain}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, domain: e.target.value }))
            }
            required
          />
          <button
            type="submit"
            className={`btn btn-primary ${isCreating ? "loading" : ""}`}
            disabled={isCreating}
          >
            Create trader
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTraderForm;
