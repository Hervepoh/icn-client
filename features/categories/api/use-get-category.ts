import axios from "axios";
import { useQuery } from "@tanstack/react-query";


export const useGetCategory = (id?: string) => {
  const query = useQuery({
    enabled: !!id,   // Fetch only if we have the id
    queryKey: ["category", { id }],
    queryFn: async () => {
      const response = await axios.delete(`http://localhost:8000/api/v1/categories/${id}`, {
        withCredentials: true,
      });
      return response.data;
    },
  });

  return query;
};
