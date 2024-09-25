import axios from 'axios';
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from 'js-cookie';
import { NEXT_PUBLIC_SERVER_URI } from '@/secret';

type RequestType = any

export const useEditRequest = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (payload) => {
      // const response = await axios.put(`${NEXT_PUBLIC_SERVER_URI}/requests/${id}`, payload, {
      //   headers: {
      //     'Authorization': Cookies.get('access_token')
      //   },
      //   withCredentials: true,
      // });
      const response = await axios.post('/api/update-request', { enpoint: '/edit-request', id: id, data:payload ,accessToken: Cookies.get('access_token') });
        return response.data?.data;
    },
    onSuccess: () => {
      toast.success("Request updated.")
      queryClient.invalidateQueries({ queryKey: ["request", { id }] });
      queryClient.invalidateQueries({ queryKey: ["requests?status=validated"] });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });

    },
    onError: () => {
      toast.error("Failed to edit request.")
    },
  });

  return mutation;
};
