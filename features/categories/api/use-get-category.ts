import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { NEXT_PUBLIC_SERVER_URI } from "@/secret";


export const useGetCategory = (id?: string) => {
  const query = useQuery({
    enabled: !!id,   // Fetch only if we have the id
    queryKey: ["category", { id }],
    queryFn: async () => {
      const response = await axios.delete(`${NEXT_PUBLIC_SERVER_URI}/categories/${id}`, {
        withCredentials: true,
      });
      return response.data;
    },
  });

  return query;
};
