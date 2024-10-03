import { format } from "date-fns";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  YAxis,
} from "recharts";

import CustomTooltip from "./custom-tooltip";


type Props = {
  data: {
    date: string;
    number: number;
    amount: number;
  }[];
}


export const BarVariant = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        {/* <defs>
          <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
            <stop offset="2%" stopColor="#3d82f6" stopOpacity={0.8} />
            <stop offset="98%" stopColor="#3d82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="amount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="2%" stopColor="#f43f5e" stopOpacity={0.8} />
            <stop offset="98%" stopColor="#f43f5e" stopOpacity={0} />
          </linearGradient>
        </defs> */}
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey="date"
          tickFormatter={(value) => format(value, "dd MMM")}
          style={{ fontSize: "12px" }}
          tickMargin={16}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="number"
          fill="#3d82f6"
          className="drop-shadow-sm"
        />
        <Bar
          dataKey="amount"
          fill="#f43f5e"
          className="drop-shadow-sm"
        />
        <Legend verticalAlign="bottom" wrapperStyle={{bottom:-15}} />
      </BarChart>
    </ResponsiveContainer>
  )
};
