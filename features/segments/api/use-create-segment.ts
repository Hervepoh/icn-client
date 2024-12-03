import axios from 'axios';
import { toast } from "sonner"
import Cookies from 'js-cookie';
import { useMutation, useQueryClient } from "@tanstack/react-query";

type RequestType = any

export const useCreateBank = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await axios.post('/api/segments', { enpoint: '/post', data: json, accessToken: Cookies.get('access_token') });
      return response.data?.data;
      
    },
    onSuccess: () => {
      toast.success("Segment has been created.")
      queryClient.invalidateQueries({ queryKey: ["segments"] });

    },
    onError: () => {
      toast.error("Failed to create segment.")
    },
  });

  return mutation;
};
