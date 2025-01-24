import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";


// Custom hook to fetch a specific request by ID
export const useGetRequest = (id?: string) => {
  // Use the useQuery hook to manage the request fetching
  const query = useQuery({
    enabled: !!id,                 // Fetch only if we have the id
    queryKey: ["request", { id }], // Unique key for the query
    queryFn: async () => {
      try {
        // Make a POST request to fetch the request data
        const response = await axios.post('/api/get-request', {
          id: id,                                   // Request ID
          accessToken: Cookies.get('access_token')  // Access token for authentication
        });

        // Return the data from the response
        return response.data.data;
      } catch (error) {
        // Handle any errors that occur during the request
        if (axios.isAxiosError(error)) {
          // Rethrow Axios errors
          throw error;
        } else {
          // Throw a generic error for other cases
          throw new Error('Une erreur inconnue s\'est produite');
        }
      }

    },
  });

  return query;  // Return the query object for use in components
};
