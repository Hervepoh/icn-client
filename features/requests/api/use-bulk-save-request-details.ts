import axios from "axios";
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NEXT_PUBLIC_SERVER_URI } from "@/secret";
import Cookies from "js-cookie";

type RequestType = any;

export const useBulkSaveRequestDetails = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      // const response = await axios.put(`${NEXT_PUBLIC_SERVER_URI}/requests-details/bulk/${id}`, json, {
      //   headers: {
      //     'Authorization': Cookies.get('access_token')
      //   },
      //   withCredentials: true,
      // });
      const response = await axios.post('/api/save-request-details', { id: id, data: json ,accessToken: Cookies.get('access_token') });
      return response.data?.data;
    },
    onSuccess: () => {
      toast.success("Save successfully")
      queryClient.invalidateQueries({ queryKey: ["requests-details", { id }] });
      //queryClient.invalidateQueries({ queryKey: ["summary"] });

    },
    onError: () => {
      toast.error("Failed to Save.")
    },
  });

  return mutation;
};
