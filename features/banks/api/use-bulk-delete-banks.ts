import axios from 'axios';
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const useBulkDeleteBanks = () => {
    const queryClient = useQueryClient();
  
    const mutation = useMutation<
      ResponseType,
      Error//,
      // RequestType
    >({
      mutationFn: async (json) => {

        return JSON.parse("a");
      },
      onSuccess: () => {
        toast.success("Banks deleted successfully")
        queryClient.invalidateQueries({ queryKey: ["banks"] });
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
        queryClient.invalidateQueries({ queryKey: ["summary"] });
      },
      onError: () => {
        toast.error("Failed to delete banks.")
      },
    });
  
    return mutation;
  };
  