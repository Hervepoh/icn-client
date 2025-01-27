import axios from "axios";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";

import { ApiFilters } from "@/components/data-table-with-advance-filter";

export const useGetUsers = (page = 1, limit = 10, filters: ApiFilters | null = null) => {
  const query = useQuery({
    queryKey: ['users-list', page, limit, filters],
    queryFn: async () => {

      try {
        // Prepare the request body
        const requestData = {
          accessToken: Cookies.get('access_token'),
          page,
          limit,
          filters: filters ? filters : {}, // Include filters if provided
        };
        // Call the internal API with pagination and filters
        const response = await axios.post('/api/users/list', requestData);
        return response.data;
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          return []
        }
        //toast.error(error?.response?.data.message || "Something went wrong");
        return []
      }

    },
  });

  return query;
};
