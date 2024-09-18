import { format } from "date-fns";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
  Bar,
  YAxis
} from "recharts";

import CustomTooltip from "./custom-tooltip";


type Props = {
  data: {
    date: string;
    number: number;
    amount: number;
  }[];
}


export const LineVariant = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey="date"
          tickFormatter={(value) => format(value, "dd MMM")}
          style={{ fontSize: "12px" }}
          tickMargin={16}
          padding={{ left: 30, right: 30 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          dot={true}
          dataKey="number"
          stroke="#3d82f6"
          strokeWidth={2}
          className="drop-shadow-sm"
          type="monotone"
          activeDot={{ r: 8 }}
        />
        <Line
          dot={true}
          dataKey="amount"
          stroke="#f43f5e"
          strokeWidth={2}
          className="drop-shadow-sm"
          type="monotone"
          activeDot={{ r: 8 }}
        />
        <Legend  wrapperStyle={{bottom:-15}}/>
      </LineChart>
    </ResponsiveContainer>
  )
};



export const ComposedVariant = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(value) => format(new Date(value), "dd MMM")}
          style={{ fontSize: "12px" }}
          tickMargin={16}
          padding={{ left: 30, right: 30 }}
        />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ bottom: -15 }} />

        <Bar
          dataKey="number"
          fill="#f43f5e"
          barSize={30}
          className="drop-shadow-sm"
        />
        <Line
          dot={true}
          dataKey="amount"
          stroke="#3d82f6"
          strokeWidth={2}
          className="drop-shadow-sm"
          type="monotone"
          activeDot={{ r: 8 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
