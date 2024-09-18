"use client";
import React, { useEffect, useState } from 'react'
import { CalendarIcon, ChevronDown } from 'lucide-react';
import { format, subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import qs from "query-string"

import {
  useRouter,
  usePathname,
  useSearchParams
} from "next/navigation";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose
} from "@/components/ui/popover"
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

// import { useGetAccounts } from '@/features/accounts/api/use-get-accounts';
import { useGetSummary } from '@/features/summary/api/use-get-summary';

import { cn, formatDateRange } from '@/lib/utils';



type Props = {}

export const DateFilter = (props: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const params = useSearchParams();
  //const accountId = params.get('accountId');
  const [from, setFrom] = useState(params.get('from') || '');
  const [to, setTo] = useState(params.get('to') || '');

  // Fonction pour récupérer les filtres du localStorage
  const fetchFiltersFromLocalStorage = () => {
    const storedFilterQuery = localStorage.getItem('icn-filter-data-query');
    if (storedFilterQuery) {
      const result = JSON.parse(storedFilterQuery);
      setFrom(result.from ?? "");
      setTo(result.to ?? "");
    }
  };

  useEffect(() => {
    fetchFiltersFromLocalStorage();
    const defaultDate = new Date();
    if (!from || !to) {
      setFrom(format(subDays(defaultDate, 30), "yyyy-MM-dd"));
      setTo(format(defaultDate, "yyyy-MM-dd"));
    }
  }, [from, to]);
  
  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  const paramState = {
    from: from ? new Date(from) : defaultFrom,
    to: to ? new Date(to) : defaultTo,
  }

  const [date, setDate] = useState<DateRange | undefined>(
    paramState
  );

  const pushToUrl = (dateRange: DateRange | undefined) => {
    const query = {
      from: format(dateRange?.from || defaultFrom, "yyyy-MM-dd"),
      to: format(dateRange?.to || defaultTo, "yyyy-MM-dd"),
    }
    localStorage.setItem('icn-filter-data-query', JSON.stringify({ from: query.from, to: query.to }));
    const url = qs.stringifyUrl({
      url: pathname,
      query
    }, { skipNull: true, skipEmptyString: true })

    router.push(url);
  }

  const onReset = () => {
    setDate(undefined);
    pushToUrl(undefined);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={false}
          size="sm"
          variant={"outline"}
          className={cn(
            "lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 transition")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>
            {formatDateRange(paramState)}
          </span>
          <ChevronDown className='ml-2 size-4 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="lg:w-auto w-full p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
        />
        <div className='p-4 w-full flex items-center gap-x-2'>
          <PopoverClose asChild>
            <Button
              onClick={onReset}
              disabled={!date?.from || !date?.to}
              className='w-full'
              variant="outline"
            >
              Reset
            </Button>
          </PopoverClose>
          <PopoverClose asChild>
            <Button
              onClick={() => pushToUrl(date)}
              disabled={!date?.from || !date?.to}
              className='w-full'
            >
              Apply
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  )
}