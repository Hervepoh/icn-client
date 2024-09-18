import { useQuery } from "@tanstack/react-query";
// import { useSearchParams } from "next/navigation";
import { convertAmountFromMilliunits } from "@/lib/utils";
import axios, { AxiosRequestConfig, AxiosError } from "axios";


export const useGetRequests = (filter:string="") => {
  // const params = useSearchParams();

  // const from = params.get('from') || "";
  // const to = params.get('to') || "";
  // const accountId = params.get('accountId') || "";
  const from = undefined;
  const to = undefined;
  const accountId = undefined;

  const query = useQuery({
    queryKey: ["requests"+filter, { from, to, accountId }],
    queryFn: async () => {
      const config: AxiosRequestConfig = {
        method: 'get',
        maxBodyLength: Infinity,
        url: process.env.NEXT_PUBLIC_SERVER_URI+'/requests'+filter,
        headers: {
        },
        withCredentials: true, // Set this to true
        data: ''
      };

      try {
        const response = await axios.request(config);
        return response.data?.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw error;
        } else {
          throw new Error('Une erreur inconnue s\'est produite');
        }
      }

    },
  });

  return query;
};
