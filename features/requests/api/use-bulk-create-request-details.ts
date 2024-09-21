import axios from "axios";
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NEXT_PUBLIC_SERVER_URI } from "@/secret";
import Cookies from "js-cookie";

type RequestType = any;

export const useBulkRequestDetails = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await axios.post(`${NEXT_PUBLIC_SERVER_URI}/request-details-bulk/${id}`, json, {
        headers: {
          'Authorization': Cookies.get('access_token')
        },
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