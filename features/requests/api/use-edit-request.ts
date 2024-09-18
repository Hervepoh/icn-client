import axios from 'axios';
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query";

type RequestType = any

export const useEditRequest = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (payload) => {
      const response = await axios.put(`http://localhost:8000/api/v1/requests/${id}`, payload, {
        withCredentials: true,
      });
      return response.data;
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
