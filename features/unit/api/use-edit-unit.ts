import axios from "axios";
import { toast } from "sonner"
import Cookies from "js-cookie";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NEXT_PUBLIC_SERVER_URI } from "@/secret";

type RequestType = any

export const useUpdateUnit = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await axios.post('/api/units', { enpoint: '/put', id: id, data: json, accessToken: Cookies.get('access_token') });
      return response.data?.data;
    },
    onSuccess: () => {
      toast.success("unit updated.")
      queryClient.invalidateQueries({ queryKey: ["unit", { id }] });
      queryClient.invalidateQueries({ queryKey: ["units"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Failed to edit unit.")
    },
  });

  return mutation;
};
