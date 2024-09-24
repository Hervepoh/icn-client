import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";


export const useAuthMe = () => {
  const query = useQuery({
    queryKey: [Cookies.get('access_token')],
    queryFn: async () => {
      try {
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
