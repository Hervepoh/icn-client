import axios from 'axios';
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query";

type RequestType = any;

export const useUpdateCategory = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await axios.put(
        `http://localhost:8000/api/v1/requests/${id}`,
        json, 
        { withCredentials: true, }
      );
      return response.data;

    },
    onSuccess: () => {
      toast.success("Category updated.")
      queryClient.invalidateQueries({ queryKey: ["category", { id }] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Failed to edit category.")
    },
  });

  return mutation;
};
