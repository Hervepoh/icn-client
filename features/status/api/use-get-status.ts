import axios from "axios";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";


export const useGetStatus = () => {
  const query = useQuery({
    queryKey: ['status'],
    queryFn: async () => {
      try {
        const response = await axios.post('/api/status' ,{ accessToken : Cookies.get('access_token')});
        return response.data?.data;
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
            return []
        }
        return []
      }

    },
  });

  return query;
};
