import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../../api/error";
import {
  createTrader,
  uploadTraderSsl,
  triggerPackageBuild,
  buildTraderPackage,
  downloadTraderPackage,
  createTraderUser,
  updateTraderStatus,
} from "../api/traders";

export const useTraderActions = () => {
  const queryClient = useQueryClient();

  const invalidateTraders = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "traders"] });
  };

  const createMutation = useMutation({
    mutationFn: createTrader,
    onSuccess: () => {
      toast.success("Trader created");
      invalidateTraders();
    },
    onError: (err) =>
      toast.error(getErrorMessage(err, "Failed to create trader")),
  });

  const sslMutation = useMutation({
    mutationFn: ({ id, file }) => uploadTraderSsl(id, file),
    onSuccess: () => toast.success("SSL uploaded"),
    onError: (err) => toast.error(getErrorMessage(err, "Failed to upload SSL")),
  });

  const buildMutation = useMutation({
    mutationFn: ({ id }) => triggerPackageBuild(id),
    onSuccess: (res) => {
      const artifactId = res.artifact_id || res.id;
      toast.success(`Build triggered (artifact ${artifactId || "created"})`);
    },
    onError: (err) =>
      toast.error(getErrorMessage(err, "Failed to trigger build")),
  });

  const packageBuildMutation = useMutation({
    mutationFn: ({ id }) => buildTraderPackage(id),
    onSuccess: (res) => {
      const artifactId = res?.artifact_id || res?.id;
      toast.success(
        `Package build started ${artifactId ? `(artifact ${artifactId})` : ""}`,
      );
    },
    onError: (err) =>
      toast.error(getErrorMessage(err, "Failed to build package")),
  });

  const downloadMutation = useMutation({
    mutationFn: ({ id }) => downloadTraderPackage(id),
    onSuccess: (blob, variables) => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.body.appendChild(document.createElement("a"));
      link.href = url;
      link.setAttribute("download", `trader-${variables.id}-package.zip`);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Package downloaded!");
    },
    onError: () => toast.error("Failed to download zip file"),
  });

  const personnelMutation = useMutation({
    mutationFn: ({ traderId, payload }) => createTraderUser(traderId, payload),
    onSuccess: () => toast.success("Trader user created"),
    onError: (err) =>
      toast.error(getErrorMessage(err, "Failed to create trader user")),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateTraderStatus(id, status),
    onSuccess: () => {
      toast.success("Status updated");
      invalidateTraders();
    },
    onError: (err) =>
      toast.error(getErrorMessage(err, "Failed to update status")),
  });

  return {
    createTrader: createMutation.mutate,
    uploadSsl: sslMutation.mutate,
    triggerBuild: buildMutation.mutate,
    buildPackage: packageBuildMutation.mutate,
    downloadPackage: downloadMutation.mutate,
    createPersonnel: personnelMutation.mutate,
    updateStatus: statusMutation.mutate,

    isCreating: createMutation.isPending,
    isUploadingSsl: sslMutation.isPending,
    isBuilding: buildMutation.isPending || packageBuildMutation.isPending,
    isDownloading: downloadMutation.isPending,
    isCreatingPersonnel: personnelMutation.isPending,
    isUpdatingStatus: statusMutation.isPending,
  };
};
