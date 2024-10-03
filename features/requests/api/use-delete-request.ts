import axios from 'axios';
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from 'js-cookie';
import { NEXT_PUBLIC_SERVER_URI } from '@/secret';

export const useDeleteRequest = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error
  >({
    mutationFn: async () => {
      // const response = await axios.delete(`${NEXT_PUBLIC_SERVER_URI}/requests/${id}`, {
      //   headers: {
      //     'Authorization': Cookies.get('access_token'), // Ajouter le token dans l'en-tête
      //   },
      //   withCredentials: true, // Assurer l'envoi des cookies
      // });
      const response = await axios.post('/api/delete-request', { enpoint: '/delete', id: id, accessToken: Cookies.get('access_token') });
      return response.data?.data;
    },
    onSuccess: () => {
      toast.success("Requests deleted.")
      queryClient.invalidateQueries({ queryKey: ["request", { id }] });
      queryClient.invalidateQueries({ queryKey: ["requests?status=validated"] });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Failed to delete requests.")
    },
  });

  return mutation;
};
