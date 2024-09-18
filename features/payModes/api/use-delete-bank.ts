import axios from 'axios';
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ResponseType = any

export const useDeleteBank = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error
  >({
    mutationFn: async () => {
      const  config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `http://localhost:8000/api/v1/banks/${id}`,
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
      toast.success("Bank deleted.")
      queryClient.invalidateQueries({ queryKey: ["bank", { id }] });
      queryClient.invalidateQueries({ queryKey: ["banks"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Failed to delete category.")
    },
  });

  return mutation;
};
