"use client"
import { DataCharts } from "@/components/data-charts";
import { DataGrid } from "@/components/data-grid";
import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { useUserStore } from "@/features/users/hooks/use-user-store";
import { hasPermission } from "@/lib/utils";

export default function DashboardPage() {
  const { user } = useUserStore();

  let filter='';
  if (user && !hasPermission(user, "SUMMARY-READ")) {
    const type = (user.role.name=='COMMERCIAL') ? 'assignTo': 'createdBy';
    filter = `type=${type}&user=${user.id}`
  }

  const { data, isLoading } = useGetSummary(filter);

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <DataGrid data={data} isLoading={isLoading} />
      <DataCharts data={data} isLoading={isLoading} />
    </div>
  );
}
