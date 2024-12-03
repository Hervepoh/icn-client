import { useQuery } from "@tanstack/react-query";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import Cookies from "js-cookie";

export const useGetSegments = () => {

  const query = useQuery({
    queryKey: ["segments"],
    queryFn: async () => {

      try {
        const response = await axios.post('/api/segments' ,{ enpoint: '/list' , accessToken : Cookies.get('access_token') });
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
