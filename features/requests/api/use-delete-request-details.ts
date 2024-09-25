import axios from 'axios';
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NEXT_PUBLIC_SERVER_URI } from '@/secret';
import Cookies from 'js-cookie';

type RequestType = any;

export const useDeleteRequestDetails = (requestId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (id) => {
      // const response = await axios.delete(`${NEXT_PUBLIC_SERVER_URI}/requests-details/${id}`, {
      //   headers: {
      //     'Authorization': Cookies.get('access_token')
      //   },
      //   data: {},
      //   withCredentials: true,
      // });
      const response = await axios.post('/api/delete-request-details', {id: id, accessToken: Cookies.get('access_token') });
      //return response.data?.data;
      return response.data;
    },
    onSuccess: () => {
      toast.success("Invoice removed successfully.")
      queryClient.invalidateQueries({ queryKey: ["requests-details", { requestId }] });
    },
    onError: () => {
      toast.error("Failed to remove Invoice in your card")
    },
  });

  return mutation;
};
