import React from "react";
import {
  RadarChart,
  Radar,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { CustomGraphTooltip } from "@/components/custom-graph-tooltip";

type Props = {
  data: {
    name: string;
    value: number;
  }[];
}


export const RadarVariant = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadarChart
        cx="50%"
        cy="50%"
        outerRadius="60%"
        data={data}
      >
        <PolarGrid />
        <PolarAngleAxis style={{ fontSize: "12px" }} dataKey="name" />
        <PolarRadiusAxis style={{ fontSize: "12px" }} />
        <Radar
          dataKey="value"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.6}
          className="drop-shadow-sm"
        />
        <Tooltip content={<CustomGraphTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  )
};