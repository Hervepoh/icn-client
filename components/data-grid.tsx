"use client";

import { FaPiggyBank } from "react-icons/fa";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { MdPendingActions } from "react-icons/md";
import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { DataCard, DataCardLoading } from "@/components/data-card";
import { statuses } from "@/config/status.config";


export const DataGrid= () => {

  
  const { data, isLoading } = useGetSummary();
   console.log("data DataGrid",data)
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pb-2 mb-8">
        {
          [1, 2, 3 , 4].map((i) => <DataCardLoading key={i} />)
        }
      </div >
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pb-2 mb-8">
      <DataCard
        title={statuses[2].label}
        value={data?.transactions?.nber[statuses[2].value] || 0}
        percentageChange={data?.remainingChange}
        icon={FaPiggyBank}
        variant="default"
        dateRange={data?.dateRangeLabel}
      />

      <DataCard
        title={statuses[3].label}
        value={data?.transactions?.nber[statuses[3].value] || 0}
        percentageChange={data?.remainingChange}
        icon={MdPendingActions}
        variant="danger"
        dateRange={data?.dateRangeLabel}
      />

      <DataCard
        title={statuses[5].label}
        value={data?.transactions?.nber[statuses[5].value] || 0}
        percentageChange={data?.expensesChange}
        icon={FaArrowTrendDown}
        variant="danger"
        dateRange={data?.dateRangeLabel}
      />

      <DataCard
        title={statuses[6].label}
        value={data?.transactions?.nber[statuses[6].label] || 0}
        percentageChange={data?.incomeChange}
        icon={FaArrowTrendUp}
        variant="success"
        dateRange={data?.dateRangeLabel}
      />


    </div>
  )
}

 