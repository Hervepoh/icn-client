import axios from 'axios';
import { toast } from "sonner"
import Cookies from 'js-cookie';
import { useMutation, useQueryClient } from "@tanstack/react-query";

type RequestType = any

export const useCreateRegion = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await axios.post('/api/regions', { enpoint: '/post', data: json, accessToken: Cookies.get('access_token') });
      return response.data?.data;
      
    },
    onSuccess: () => {
      toast.success("Region has been created.")
      queryClient.invalidateQueries({ queryKey: ["regions"] });

    },
    onError: () => {
      toast.error("Failed to create region.")
    },
  });

  return mutation;
};
