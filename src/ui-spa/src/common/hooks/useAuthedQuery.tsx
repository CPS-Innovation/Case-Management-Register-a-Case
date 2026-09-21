import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ApiError } from "../errors/ApiError";
import { useEffect } from "react";

const useAuthedQuery = <TData, TError = Error>(
  options: UseQueryOptions<TData, TError>,
) => {
  const navigate = useNavigate();
  const query = useQuery({
    ...options,
    throwOnError: (error) => {
      if (error instanceof ApiError && error.code === 401) {
        return false;
      }
      return true;
    },
  });

  useEffect(() => {
    if (query.error instanceof ApiError && query.error.code === 401) {
      navigate("/unauthorised");
    }
  }, [query.error, navigate]);

  return query;
};

export default useAuthedQuery;
