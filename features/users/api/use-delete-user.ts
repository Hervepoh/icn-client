import axios from 'axios';
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from 'js-cookie';

export const useDeleteUser = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error
  >({
    mutationFn: async () => {
      const response = await axios.post(`/api/users/${id}/delete`, {  accessToken: Cookies.get('access_token') });
      return response.data?.data;
    },
    onSuccess: () => {
      toast.success("User deleted.")
      queryClient.invalidateQueries({ queryKey: ["user", { id }] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users-list"] });

    },
    onError: (error: any) => {
      // Retrieve the error message from the error response
      const errorMessage = error.response?.data?.message || "Failed to delete user.";
      toast.error(errorMessage);
    },
  });

  return mutation;
};
