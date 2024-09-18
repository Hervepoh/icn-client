import axios from 'axios';
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteRequest = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error
  >({
    mutationFn: async () => {
      const response = await axios.delete(`http://localhost:8000/api/v1/requests/${id}`, {
        withCredentials: true,
      });
      return response.data;
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
