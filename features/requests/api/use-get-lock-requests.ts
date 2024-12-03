import axios from "axios";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";

export const useGetLockRequests = () => {

  const query = useQuery({
    queryKey: ["requests-lock"],
    queryFn: async () => {

      try {
        const response = await axios.get('/api/requests/lock');
        return response.data?.data;
      } catch (error) {
        console.error("[useGetLockRequests]");
        return [];
      }

    },
  });

  return query;
};
