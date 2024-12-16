import axios from "axios";
import { toast } from "sonner"
import Cookies from "js-cookie";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type RequestType = any

export const useUpdateUser= (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await axios.put(`/api/users/${id}/update`, { data: json, accessToken: Cookies.get('access_token') });
      return response.data?.data;
    },
    onSuccess: () => {
      toast.success("User updated.")
      queryClient.invalidateQueries({ queryKey: ["user", { id }] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users-list"] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to edit User.";
      toast.error(errorMessage);
    },
  });

  return mutation;
};
