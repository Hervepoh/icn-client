import { useQuery } from "@tanstack/react-query";

import { convertAmountFromMilliunits } from "@/lib/utils";
import axios, { AxiosRequestConfig, AxiosError } from "axios";

export const useGetRequest = (id?: string) => {
  const query = useQuery({
    enabled: !!id,   // Fetch only if we have the id
    queryKey: ["request", { id }],
    queryFn: async () => {
      const config: AxiosRequestConfig = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://localhost:8000/api/v1/requests/${id}`,
        headers: {
        },
        withCredentials: true, // Set this to true
        data: ''
      };

      try {
        const response = await axios.request(config);
        return response.data?.data;
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
