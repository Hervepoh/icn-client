import axios from 'axios';
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NEXT_PUBLIC_SERVER_URI } from '@/secret';

type RequestType = any;

export const useDeleteRequestDetails = (requestId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (id) => {
      const response = await axios.delete(`${NEXT_PUBLIC_SERVER_URI}/request-details`, {
        data: {id:id},
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Invoice deleted.")
      queryClient.invalidateQueries({ queryKey: ["request-details", { requestId }] });
    },
    onError: () => {
      toast.error("Failed to delete Invoice.")
    },
  });

  return mutation;
};
