import axios from "axios";
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query";

type RequestType = any;

export const useBulkRequestDetails = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await axios.post(`http://localhost:8000/api/v1/request-details-bulk/${id}`, json, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Add successfully")
      queryClient.invalidateQueries({ queryKey: ["request-details", { id }] });
      //queryClient.invalidateQueries({ queryKey: ["summary"] });

    },
    onError: () => {
      toast.error("Failed to Add.")
    },
  });

  return mutation;
};
