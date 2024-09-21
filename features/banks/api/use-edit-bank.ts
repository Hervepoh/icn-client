import axios  from "axios";
import { toast } from "sonner"
import Cookies from "js-cookie";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NEXT_PUBLIC_SERVER_URI } from "@/secret";

type RequestType = any

export const useUpdateBank = (id?: string) => {
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
        url: `${NEXT_PUBLIC_SERVER_URI}/banks`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': Cookies.get('access_token')
        },
        withCredentials: true, // Set this to true
        data: json
      };
      const response = await axios.request(config);
      return response.data?.data;
    },
    onSuccess: () => {
      toast.success("Category updated.")
      queryClient.invalidateQueries({ queryKey: ["bank", { id }] });
      queryClient.invalidateQueries({ queryKey: ["banks"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Failed to edit bank.")
    },
  });

  return mutation;
};
