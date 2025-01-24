import { NEXT_PUBLIC_SERVER_URI } from "@/secret";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import Cookies from "js-cookie";

export const useGetBranches = () => {

  const query = useQuery({
    queryKey: ["branchs"],
    queryFn: async () => {

      try {
        const response = await axios.post('/api/branches' ,{ accessToken : Cookies.get('access_token') });
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
