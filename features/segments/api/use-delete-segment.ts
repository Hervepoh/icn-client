import axios from 'axios';
import { toast } from "sonner"
import Cookies from 'js-cookie';
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ResponseType = any

export const useDeleteSegment = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error
  >({
    mutationFn: async () => {
      const response = await axios.post('/api/segments', { enpoint: '/delete', id: id, accessToken: Cookies.get('access_token') });
      return response.data?.data;
    },
    onSuccess: () => {
      toast.success("segment deleted.")
      queryClient.invalidateQueries({ queryKey: ["segment", { id }] });
      queryClient.invalidateQueries({ queryKey: ["segments"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Failed to delete segment.")
    },
  });

  return mutation;
};
