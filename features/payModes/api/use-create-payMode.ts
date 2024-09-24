import axios from 'axios';
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from 'js-cookie';
import { NEXT_PUBLIC_SERVER_URI } from '@/secret';


type RequestType = any

export const useCreatePayMode = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {

      // const  config = {
      //   method: 'post',
      //   maxBodyLength: Infinity,
      //   url: `${NEXT_PUBLIC_SERVER_URI}/pay-modes`,
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': Cookies.get('access_token')
      //   },
      //   withCredentials: true, // Set this to true
      //   data: json
      // };
      // const response = await axios.request(config);
      const response = await axios.post('/api/payModes', { enpoint: '/post', data: json, accessToken: Cookies.get('access_token') });
      return response.data?.data;
      
    },
    onSuccess: () => {
      toast.success("PayMode has been created.")
      queryClient.invalidateQueries({ queryKey: ["payModes"] });

    },
    onError: () => {
      toast.error("Failed to create payMode.")
    },
  });

  return mutation;
};
