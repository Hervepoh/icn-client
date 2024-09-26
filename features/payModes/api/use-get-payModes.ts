import { NEXT_PUBLIC_SERVER_URI } from "@/secret";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import Cookies from "js-cookie";

export const useGetPayModes = () => {

  const query = useQuery({
    queryKey: ["payModes"],
    queryFn: async () => {

      const config: AxiosRequestConfig = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${NEXT_PUBLIC_SERVER_URI}/pay-modes`,
        headers: {
          'Authorization': Cookies.get('access_token')
        },
        withCredentials: true, // Set this to true
        data: ''
      };

      try {
       // const response = await axios.request(config);
       const response = await axios.post('/api/payModes', { enpoint: '/list', accessToken: Cookies.get('access_token') });
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
