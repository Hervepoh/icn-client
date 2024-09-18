import { useQuery } from "@tanstack/react-query";
import axios, { AxiosRequestConfig, AxiosError } from "axios";

export const useGetPayModes = () => {

  const query = useQuery({
    queryKey: ["payModes"],
    queryFn: async () => {

      const config: AxiosRequestConfig = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://localhost:8000/api/v1/pay-modes',
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
