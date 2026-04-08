import { useState } from "react";
import { useTraderActions } from "../hooks/useTradersActions";

const SSLBuildSection = ({ traders = [], isLoading }) => {
  const actions = useTraderActions();
  const [selectedTrader, setSelectedTrader] = useState(null);
  const [sslFile, setSslFile] = useState(null);

  const handleSslUpload = (e) => {
    e.preventDefault();
    if (!selectedTrader || !sslFile) return;
    actions.uploadSsl({ id: selectedTrader.id, file: sslFile });
  };

  const traderId = selectedTrader?.id || "";

  return (
    <div className="card bg-base-100 shadow-sm border rounded-lg">
      <div className="card-body space-y-4">
        <h2 className="card-title">SSL Upload & Package Build</h2>

        <form className="space-y-3" onSubmit={handleSslUpload}>
          <select
            disabled={isLoading}
            className="select select-bordered w-full"
            value={traderId}
            onChange={(e) => {
              const trader = traders.find(
                (t) => String(t.id) === e.target.value,
              );
              setSelectedTrader(trader || null);
            }}
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
            type="file"
            className="file-input file-input-bordered w-full"
            onChange={(e) => setSslFile(e.target.files?.[0] || null)}
          />

          <button
            type="submit"
            className={`btn btn-outline w-full ${actions.isUploadingSsl ? "loading" : ""}`}
            disabled={!selectedTrader || !sslFile || actions.isUploadingSsl}
          >
            Upload SSL certificate
          </button>
        </form>

        <div className="divider text-xs opacity-50 uppercase">
          Build Actions
        </div>

        <button
          className={`btn btn-secondary btn-block ${actions.isBuilding ? "loading" : ""}`}
          disabled={!selectedTrader || actions.isBuilding}
          onClick={() => actions.triggerBuild({ id: traderId })}
        >
          Trigger Storefront Build
        </button>

        <button
          className={`btn btn-accent btn-block ${actions.isBuilding ? "loading" : ""}`}
          disabled={!selectedTrader || actions.isBuilding}
          onClick={() => actions.buildPackage({ id: traderId })}
        >
          Build Trader Package
        </button>

        <button
          className={`btn btn-accent btn-block ${actions.isDownloading ? "loading" : ""}`}
          disabled={!selectedTrader || actions.isDownloading}
          onClick={() => actions.downloadPackage({ id: traderId })}
        >
          Download Trader Package
        </button>
      </div>
    </div>
  );
};

export default SSLBuildSection;
