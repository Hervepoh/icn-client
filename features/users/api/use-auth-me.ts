import { useQuery } from "@tanstack/react-query";

import { convertAmountFromMilliunits } from "@/lib/utils";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { NEXT_PUBLIC_SERVER_URI } from "@/secret";
import Cookies from "js-cookie";
import { toast } from "sonner";


export const useAuthMe = () => {
  const query = useQuery({
    queryKey: [Cookies.get('access_token')],
    queryFn: async () => {
      // const config: AxiosRequestConfig = {
      //   method: 'get',
      //   maxBodyLength: Infinity,
      //   url: `/auth/me`,
      //   headers: {
      //     'Authorization': Cookies.get('access_token')
      //   },
      //   withCredentials: true, // Set this to true
      //   data: ''
      // };
     
      try {
        //const response = await axios.request(config);
        const response = await axios.post('/api/auth/me' ,{ accessToken : Cookies.get('access_token')});
        return response.data;
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          return null
        }

        toast.error(error?.response?.data.message || "Something went wrong");

      }

    },
  });

  return query;
};
