import axios from 'axios';
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from 'js-cookie';
import { NEXT_PUBLIC_SERVER_URI } from '@/secret';

export const useDisReactiveUser = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error
  >({
    mutationFn: async () => {
      const response = await axios.post('/api/users/disactivate-reactivate', {  id: id, accessToken: Cookies.get('access_token') });
      return response.data?.data;
    },
    onSuccess: () => {
      toast.success("Action perform")
      queryClient.invalidateQueries({ queryKey: ["user", { id }] });
      queryClient.invalidateQueries({ queryKey: ["users-list"] });;
    },
    onError: () => {
      toast.error("Something went wrong")
    },
  });

  return mutation;
};
