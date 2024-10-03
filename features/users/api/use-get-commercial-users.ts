import { toast } from "sonner";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosRequestConfig } from "axios";

export const useGetCommercialUsers = () => {
  const query = useQuery({
    queryKey: ['users-commercial'],
    queryFn: async () => {

      try {
        const response = await axios.post('/api/users-commercial' ,{ accessToken : Cookies.get('access_token')});
        return response.data?.data;
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
            return []
        }
        //toast.error(error?.response?.data.message || "Something went wrong");
        return []
      }

    },
  });

  return query;
};