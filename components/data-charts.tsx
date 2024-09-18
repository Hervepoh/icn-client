"use client";

import { Chart, ChartLoading } from "@/components/chart";
import { Pie, PieLoading } from "@/components/graph";
import { useGetSummary } from "@/features/summary/api/use-get-summary";


export const DataCharts = () => {

   const { data, isLoading } = useGetSummary();
  console.log(data);
  // const isLoading = true;
  //  const datas = {
  //   days: [
  //     { date: '2024-08-01', income: 1500, expenses: 800 },
  //     { date: '2024-08-02', income: 1700, expenses: 600 },
  //     { date: '2024-08-03', income: 1600, expenses: 900 },
  //     { date: '2024-08-04', income: 1800, expenses: 700 },
  //     { date: '2024-08-05', income: 1400, expenses: 750 },
  //     { date: '2024-08-06', income: 1900, expenses: 850 },
  //     { date: '2024-08-07', income: 2000, expenses: 950 },
  //   ],
  //   categories: [
  //     { name: 'Revenus', value: 11900 }, // Somme totale des revenus
  //     { name: 'Dépenses', value: 5550 }, // Somme totale des dépenses
  //   ],
  // };
  // const totalIncome = datas.days.reduce((acc, day) => acc + day.income, 0);
  // const totalExpenses = datas.days.reduce((acc, day) => acc + day.expenses, 0);

  // datas.categories = [
  //   { name: 'Revenus', value: totalIncome },
  //   { name: 'Dépenses', value: totalExpenses },
  // ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
        <div className="col-span-1 lg:col-span-3 xl:col-span-4">
          <ChartLoading />
        </div>
        <div className="col-span-1 lg:col-span-3 xl:col-span-2">
          <PieLoading />
        </div>
      </div>
    )
  }

  return (
    //Send the days data recieved from the summary Endpoint
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
      <div className="col-span-1 lg:col-span-3 xl:col-span-4">
        <Chart
          data={data?.days ?? []}
        />
      </div>
      <div className="col-span-1 lg:col-span-3 xl:col-span-2">
        <Pie
          data={data?.categories.nber ?? []}
        />
      </div>
    </div>
  )
}
