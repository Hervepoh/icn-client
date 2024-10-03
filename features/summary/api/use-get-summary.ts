"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { convertAmountFromMilliunits, formatDateRange } from "@/lib/utils";
import { formatDate,format, subDays } from 'date-fns';
import Cookies from 'js-cookie';
import { NEXT_PUBLIC_SERVER_URI } from '@/secret';
import { DATE_KEY } from '@/config/localstorage.config';

export const useGetSummary = (type?: string) => {
  const searchParams = useSearchParams();
  // Récupérez les paramètres de requête

  const [from, setFrom] = useState(searchParams.get("from"));
  const [to, setTo] = useState(searchParams.get("to"));

  useEffect(() => {
    const defaultTo = new Date();
    const defaultFrom = subDays(defaultTo, 30);
    // Récupération des données dans le localStorage au montage du composant
    const storedFilterQuery = localStorage.getItem(DATE_KEY);
    if (storedFilterQuery) {
      const result = JSON.parse(storedFilterQuery);
      setFrom(result.from ??  format(result.from, 'dd/MM/yyyy'));
      setTo(result.to ?? defaultTo);
    }
  }, [from,to]);

  let filter = createFilter(from, to, type);

  const query = useQuery({
    queryKey: ["summary", { from, to , type }],
    queryFn: async () => {

      try {
        const response = await axios.post('/api/summary' ,{ accessToken : Cookies.get('access_token') , filter: filter});
        return { ...response.data?.data };
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



const createFilter = (from:any, to:any, type:any) => {
  let filter = '';

  if (from) {
    filter += `?from=${from}`;
  }

  if (to) {
    filter += filter ? `&` : `?`;
    filter += `to=${to}`;
  }

  if (type) {
    filter += filter ? `&` : `?`;
    filter += `${type}`;
  }

  return filter;
};

