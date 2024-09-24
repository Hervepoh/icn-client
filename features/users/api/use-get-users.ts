import { toast } from "sonner";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosRequestConfig } from "axios";
import { NEXT_PUBLIC_SERVER_URI } from "@/secret";


export const useGetUsers = () => {
  const query = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      // const config: AxiosRequestConfig = {
      //   method: 'get',
      //   maxBodyLength: Infinity,
      //   url: `${NEXT_PUBLIC_SERVER_URI}/users/commercial`,
      //   headers: {
      //     'Authorization': Cookies.get('access_token')
      //   },
      //   withCredentials: true, // Set this to true
      //   data: ''
      // };

      try {
        // const response = await axios.request(config);
        const response = await axios.post('/api/users' ,{ accessToken : Cookies.get('access_token')});
        return response.data;
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
