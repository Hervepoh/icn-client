import { NEXT_PUBLIC_SERVER_URI } from "@/secret";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

export const useGetUnpaidByInvoice = (value?: string) => {
  const query = useQuery({
    enabled: !!value,   // Fetch only if we have the id
    queryKey: ["unpaid", { value }],
    queryFn: async () => {
      const config: AxiosRequestConfig = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${NEXT_PUBLIC_SERVER_URI}/search-unpaid?by=invoice&value=${value}`,
        headers: {'Authorization': Cookies.get('access_token')},
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
