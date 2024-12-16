"use client";

import { Chart, ChartLoading } from "@/components/chart";
import { Pie, PieLoading } from "@/components/graph";
import { Tab } from "./table";


type DataType = {
  data: any;
  isLoading: boolean;
}

export const DataCharts = ({ data, isLoading }: DataType) => {


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
    <>
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
        <div className="col-span-1 lg:col-span-3 xl:col-span-4">
          <Chart
            data={data?.days ?? []}
          />
        </div>
        <div className="col-span-1 lg:col-span-3 xl:col-span-2">
          <Pie
            title={"By Status"}
            data={data?.categories.nber ?? []}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 mt-10">
        <div className="col-span-1 lg:col-span-3 xl:col-span-2">
          <Pie
            title={"By regions"}
            data={data?.regions ?? []}
            defaultValue={"radar"}
          />
        </div>
        <div className="col-span-1 lg:col-span-3 xl:col-span-4">
          <Tab
            title={"Repartition by region and status"}
            type="region"
            data={data?.group?.by_region ?? []}
          />
        </div>

      </div>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mt-10">
        <div className="col-span-1 lg:col-span-1 xl:col-span-1">
          <Tab
            type="unit"
            title={"Repartition by unit and status"}
            data={data?.group?.by_unit ?? []}
          />
        </div>

      </div>
    </>
  )
}
