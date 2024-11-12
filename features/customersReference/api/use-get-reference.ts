import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { NEXT_PUBLIC_SERVER_URI } from "@/secret";


export const useGetReference = (id?: string) => {
  const query = useQuery({
    enabled: !!id,   // Fetch only if we have the id
    queryKey: ["customers-reference", { id }],
    queryFn: async () => {
      const response = await axios.get(`/api/customers-reference/${id}`, {
        withCredentials: true,
      });
      return response.data;
    },
  });

  return query;
};
