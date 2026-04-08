export function getErrorMessage(err, fallback = "Something went wrong") {
  if (!err) return fallback;

  if (typeof err === "string") return err;

  const normalized = err?.normalized;
  if (normalized?.message) return normalized.message;

  const data = err?.response?.data || err?.data;
  if (typeof data?.message === "string" && data.message.trim()) return data.message;
  if (typeof data?.error === "string" && data.error.trim()) return data.error;
  if (typeof data?.error?.message === "string" && data.error.message.trim()) {
    return data.error.message;
  }

  if (typeof err?.message === "string" && err.message.trim()) return err.message;

  return fallback;
}

export function normalizeAxiosError(error) {
  const status = error?.response?.status;
  const data = error?.response?.data;

  const message =
    (typeof data?.message === "string" && data.message) ||
    (typeof data?.error === "string" && data.error) ||
    (typeof data?.error?.message === "string" && data.error.message) ||
    (typeof error?.message === "string" && error.message) ||
    "Request failed";

  return {
    ...error,
    normalized: {
      status,
      data,
      message,
    },
  };
}

