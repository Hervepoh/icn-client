import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

type RequestType = any;

export const useAddLockRequest = () => {
    const queryClient = useQueryClient();
  
    const mutation = useMutation<
      ResponseType,
      Error, 
      RequestType
    >({
      mutationFn: async (json) => {
        const response = await axios.post('/api/requests/lock', {  data: json ,accessToken: Cookies.get('access_token') });
        return response.data?.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["requests-lock"] });
        queryClient.invalidateQueries({ queryKey: ["requests"] });
  
      },
      onError: () => {
        console.error("Failed to lock.")
      },
    });
  
    return mutation;
  };
  