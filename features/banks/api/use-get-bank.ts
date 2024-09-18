import { useQuery } from "@tanstack/react-query";
import axios, { AxiosRequestConfig, AxiosError } from "axios";

export const useGetBank = (id?: string) => {
  const query = useQuery({
    enabled: !!id,   // Fetch only if we have the id
    queryKey: ["bank", { id }],
    queryFn: async () => {
      const config: AxiosRequestConfig = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://localhost:8000/api/v1/banks',
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
