import axios from 'axios';
import { toast } from "sonner"
import Cookies from 'js-cookie';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NEXT_PUBLIC_SERVER_URI } from '@/secret';

type RequestType = any

export const useCreateUser= () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await axios.post('/api/users/create', { data: json, accessToken: Cookies.get('access_token') });
      return response.data?.data;
    },
    onSuccess: () => {
      toast.success("User has been created.")
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users-list"] });
    },
    onError: (error: any) => {
      // Retrieve the error message from the error response
      const errorMessage = error.response?.data?.message || "Failed to create User.";
      toast.error(errorMessage);
    },
  });

  return mutation;
};
