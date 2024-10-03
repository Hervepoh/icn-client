import { NEXT_PUBLIC_SERVER_URI } from "@/secret";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosRequestConfig  } from "axios";
import Cookies from "js-cookie";

export const useGetRequestDetails = (id?: string) => {
  const query = useQuery({
    enabled: !!id,   // Fetch only if we have the id
    queryKey: ["requests-details", { id }],
    queryFn: async () => {
      // const config: AxiosRequestConfig = {
      //   method: 'get',
      //   maxBodyLength: Infinity,
      //   url: `${NEXT_PUBLIC_SERVER_URI}/requests-details/${id}`,
      //   headers: {
      //     'Authorization': Cookies.get('access_token')
      //   },
      //   withCredentials: true, // Set this to true
      //   data: ''
      // };

      try {
        const response = await axios.post('/api/get-request-details', { id: id, accessToken: Cookies.get('access_token') });
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
