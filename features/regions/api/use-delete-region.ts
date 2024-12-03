import axios from 'axios';
import { toast } from "sonner"
import Cookies from 'js-cookie';
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ResponseType = any

export const useDeleteRegion = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error
  >({
    mutationFn: async () => {
      const response = await axios.post('/api/regions', { enpoint: '/delete', id: id, accessToken: Cookies.get('access_token') });
      return response.data?.data;
    },
    onSuccess: () => {
      toast.success("region deleted.")
      queryClient.invalidateQueries({ queryKey: ["region", { id }] });
      queryClient.invalidateQueries({ queryKey: ["regions"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Failed to delete region.")
    },
  });

  return mutation;
};
