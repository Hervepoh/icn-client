import { NEXT_PUBLIC_SERVER_URI } from "@/secret";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosRequestConfig, AxiosError } from "axios";

export const useGetCategories = () => {

  const query = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {

      const config: AxiosRequestConfig = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${NEXT_PUBLIC_SERVER_URI}/categories`,
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
