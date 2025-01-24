import axios from 'axios';
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from 'js-cookie';


// Custom hook to delete a request by ID
export const useDeleteRequest = (id?: string) => {
  const queryClient = useQueryClient(); // Access the query client for managing cache

  // Define the mutation for deleting a request
  const mutation = useMutation<
    ResponseType,  // Type of the response from the mutation
    Error          // Type of error that may occur
  >({
     // Function that handles the mutation
    mutationFn: async () => {
       // Send a POST request to delete the request
      const response = await axios.post('/api/delete-request', { 
        enpoint: '/delete',                       // API endpoint for deleting the request
        id: id,                                   // ID of the request to be deleted
        accessToken: Cookies.get('access_token')  // Access token for authentication
      });

       // Return the data from the response
      return response.data?.data;
    },
    // Callback executed on a successful mutation
    onSuccess: () => {
      toast.success("Requests deleted.") // Show success message
       // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["request", { id }] });
      queryClient.invalidateQueries({ queryKey: ["requests?status=validated"] });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
     // Callback executed on an error during the mutation
    onError: () => {
      toast.error("Failed to delete requests.") // Show error message
    },
  });

  return mutation; // Return the mutation object for use in components
};
