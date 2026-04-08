import { fetchTraders } from "../api/traders";

import {
  CreateTraderForm,
  SSLBuildSection,
  PersonnelForm,
  TraderTable,
} from "../components";
import { useTraderActions } from "../hooks/useTradersActions";
import { useFetchData } from "../../../hooks/useFetchData";

const TradersPage = () => {
  const {
    items: traders,
    isLoading,
    isError,
    error,
  } = useFetchData(["admin", "traders"], fetchTraders);

  const { updateStatus, isUpdatingStatus } = useTraderActions();

  if (isLoading) {
    return (
      <div className="card bg-base-100 shadow-sm border rounded-lg animate-pulse">
        <div className="card-body space-y-4">
          <div className="h-6 bg-base-300 rounded w-1/2"></div>
          <div className="h-12 bg-base-300 rounded w-full"></div>
          <div className="h-12 bg-base-300 rounded w-full"></div>
          <div className="h-12 bg-base-300 rounded w-full mt-4"></div>
        </div>
      </div>
    );
  }

  if (isError)
    return <div className="alert alert-error">Error: {error.message}</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Traders</h1>
          <p className="opacity-70 text-sm">
            Manage trader domains, SSL certificates, storefront builds, and
            personnel.
          </p>
        </div>
      </div>

      <section className="grid gap-6 md:grid-cols-2">
        <CreateTraderForm />
        <SSLBuildSection traders={traders} isLoading={isLoading} />
      </section>

      <PersonnelForm traders={traders} isLoading={isLoading} />

      <section>
        <h2 className="text-lg font-semibold mb-2">All traders</h2>
        <TraderTable
          onStatusChange={updateStatus}
          isUpdating={isUpdatingStatus}
        />
      </section>
    </div>
  );
};

export default TradersPage;
