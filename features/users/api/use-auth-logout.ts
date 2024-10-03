import { useMutation, useQuery } from "@tanstack/react-query";

import { convertAmountFromMilliunits } from "@/lib/utils";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { NEXT_PUBLIC_SERVER_URI } from "@/secret";
import Cookies from "js-cookie";
import { toast } from "sonner";

export const useAuthLogout = () => {
  const query = useMutation({
    mutationFn: async () => {
      try {
        const response = await axios.post('/api/auth/logout' ,{ accessToken : Cookies.get('access_token')});
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
