import axios from 'axios';
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NEXT_PUBLIC_SERVER_URI } from '@/secret';


type RequestType = any

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {

      const  config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${NEXT_PUBLIC_SERVER_URI}/categories`,
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Set this to true
        data: json
      };
      const response = await axios.request(config);
      return response.data?.data;
    },
    onSuccess: () => {
      toast.success("Category has been created.")
      queryClient.invalidateQueries({ queryKey: ["categories"] });

    },
    onError: () => {
      toast.error("Failed to create category.")
    },
  });

  return mutation;
};