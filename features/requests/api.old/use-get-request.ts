import { useQuery } from "@tanstack/react-query";

import { convertAmountFromMilliunits } from "@/lib/utils";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import Cookies from "js-cookie";
import { NEXT_PUBLIC_SERVER_URI } from "@/secret";

export const useGetRequest = (id?: string) => {
  const query = useQuery({
    enabled: !!id,   // Fetch only if we have the id
    queryKey: ["request", { id }],
    queryFn: async () => {
      const config: AxiosRequestConfig = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${NEXT_PUBLIC_SERVER_URI}/requests/${id}`,
        headers: {
          'Authorization': Cookies.get('access_token')
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
