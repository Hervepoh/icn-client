import axios from 'axios';
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NEXT_PUBLIC_SERVER_URI } from '@/secret';


type ResponseType = any

export const useDeleteCategory = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error
  >({
    mutationFn: async () => {
      const  config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${NEXT_PUBLIC_SERVER_URI}/categories/${id}`,
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Set this to true
        data: ""
      };
      const response = await axios.request(config);
      return response.data?.data;
    },
    onSuccess: () => {
      toast.success("Category deleted.")
      queryClient.invalidateQueries({ queryKey: ["category", { id }] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Failed to delete category.")
    },
  });

  return mutation;
};
