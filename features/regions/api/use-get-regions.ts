import { useQuery } from "@tanstack/react-query";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import Cookies from "js-cookie";

export const useGetRegions = () => {

  const query = useQuery({
    queryKey: ["regions"],
    queryFn: async () => {

      try {
        const response = await axios.post('/api/regions' ,{ enpoint: '/list' , accessToken : Cookies.get('access_token') });
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
