import Cookies from "js-cookie";;
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { NEXT_PUBLIC_SERVER_URI } from "@/secret"

export const useGetRegion = (id?: string) => {
  const query = useQuery({
    enabled: !!id,   // Fetch only if we have the id
    queryKey: ["region", { id }],
    queryFn: async () => {

      try {
        // const response = await axios.request(config);
        const response = await axios.post('/api/regions' ,{ enpoint: '/get' , id: id , accessToken : Cookies.get('access_token') });
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
