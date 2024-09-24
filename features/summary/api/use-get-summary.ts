"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { convertAmountFromMilliunits, formatDateRange } from "@/lib/utils";
import { formatDate,format, subDays } from 'date-fns';
import Cookies from 'js-cookie';
import { NEXT_PUBLIC_SERVER_URI } from '@/secret';

export const useGetSummary = () => {

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [dateRangeLabel, setDateRangeLabel] = useState("");

  useEffect(() => {
    const defaultTo = new Date();
    const defaultFrom = subDays(defaultTo, 30);
    // Récupération des données dans le localStorage au montage du composant
    const storedFilterQuery = localStorage.getItem('filter-query');
    if (storedFilterQuery) {
      const result = JSON.parse(storedFilterQuery);
      setFrom(result.from ??  format(defaultFrom, 'dd/MM/yyyy'));
      setTo(result.to ?? defaultTo);
      setDateRangeLabel(formatDateRange({ from, to }))
    }
    
  }, [from,to]);

  let filter = "";
  if (from && to) {
    filter = `?from=${from}&to=${to}`
  }
  const query = useQuery({
    queryKey: ["summary", { from, to }],
    queryFn: async () => {
      // const config: AxiosRequestConfig = {
      //   method: 'get',
      //   maxBodyLength: Infinity,
      //   url: `${NEXT_PUBLIC_SERVER_URI}/summary${filter}`,
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': Cookies.get('access_token')
      //   },
      //   withCredentials: true, // Set this to true
      // };
      try {
        //const response = await axios.request(config);
        const response = await axios.post('/api/summary' ,{ accessToken : Cookies.get('access_token') , filter: filter});
        return { ...response.data?.data, dateRangeLabel };
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
}
