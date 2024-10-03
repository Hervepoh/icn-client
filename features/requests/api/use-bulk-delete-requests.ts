import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { InferRequestType, InferResponseType } from "hono";

// import { client } from "@/lib/hono";

// type ResponseType = InferResponseType<typeof client.api.transactions["bulk-delete"]["$post"]>;
// type RequestType = InferRequestType<typeof client.api.transactions["bulk-delete"]["$post"]>["json"];

export const useBulkDeleteRequests = () => {
    const queryClient = useQueryClient();
  
    const mutation = useMutation<
      ResponseType,
       Error //,
      // RequestType
    >({
      mutationFn: async (json) => {
        // const response = await client.api.transactions["bulk-delete"]["$post"]({ json });
  
        // return await response.json();
        return JSON.parse("a");
      },
      onSuccess: () => {
        toast.success("Requests deleted successfully")
        queryClient.invalidateQueries({ queryKey: ["requests?status=validated"] });
        queryClient.invalidateQueries({ queryKey: ["requests"] });
        queryClient.invalidateQueries({ queryKey: ["summary"] });
        
      },
      onError: () => {
        toast.error("Failed to delete requests.")
      },
    });
  
    return mutation;
  };
  