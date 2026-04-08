import { useQuery } from "@tanstack/react-query";

export const useFetchData = (queryKey, fetchFn, options = {}) => {
  const { data, isLoading, isError, error, isPlaceholderData } = useQuery({
    queryKey: [...queryKey], 
    queryFn: fetchFn,
    staleTime: 1000 * 60 * 5, 
    placeholderData: (prev) => prev, 
    ...options, 
  });

  const items = data?.content || data?.items || data || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;

  return {
    items,
    totalPages,
    totalElements,
    isLoading,
    isError,
    error,
    isPlaceholderData,
    rawData: data, 
  };
};
