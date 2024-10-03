import axios from "axios";
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NEXT_PUBLIC_SERVER_URI } from "@/secret";
import Cookies from "js-cookie";

type RequestType = any;

export const useBulkCreateRequests = () => {
    const queryClient = useQueryClient();
  
    const mutation = useMutation<
      ResponseType,
      Error, 
      RequestType
    >({
      mutationFn: async (json) => {
        // const response = await axios.post(`${NEXT_PUBLIC_SERVER_URI}/requests-bulk`, json, {
        //   headers: {
        //     'Authorization': Cookies.get('access_token')
        //   },
        //   withCredentials: true,
        // });
        const response = await axios.post('/api/requests', { enpoint: '/create-bulk', data: json ,accessToken: Cookies.get('access_token') });
        return response.data?.data;
      },
      onSuccess: () => {
        toast.success("Transactions created successfully")
        queryClient.invalidateQueries({ queryKey: ["requests?status=validated"] });
        queryClient.invalidateQueries({ queryKey: ["requests"] });
        queryClient.invalidateQueries({ queryKey: ["summary"] });
  
      },
      onError: () => {
        toast.error("Failed to build create transactions.")
      },
    });
  
    return mutation;
  };
  