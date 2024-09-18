import axios from "axios";
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query";

type RequestType = any;

export const useBulkCreateRequests = () => {
    const queryClient = useQueryClient();
  
    const mutation = useMutation<
      ResponseType,
      Error, 
      RequestType
    >({
      mutationFn: async (json) => {
        const response = await axios.post(`http://localhost:8000/api/v1/requests-bulk`, json, {
          withCredentials: true,
        });
        return response.data;
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
  