import { useQuery } from "@tanstack/react-query";

import axios from "axios";
import Cookies from "js-cookie";

export const useGetRequest = (id?: string) => {
  const query = useQuery({
    enabled: !!id,   // Fetch only if we have the id
    queryKey: ["request", { id }],
    queryFn: async () => {

      try {
       const response = await axios.post('/api/get-request', { id:id, accessToken: Cookies.get('access_token') });
        return response.data.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw error;
        } else {
          throw new Error('Une erreur inconnue s\'est produite');
        }
      }

    },
  });

  return query;
};
