"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, ShieldCheck, ShieldX, TriangleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

import { columnsFilter } from "@/components/data-table-with-advance-filter"
import { Actions } from "./actions";

import { cn } from "@/lib/utils"


export const columnsFilters: columnsFilter[] = [
  { accessorKey: 'role', title: 'Name' },
  { accessorKey: 'permissions', title: 'Permissions' },
];

interface ResponseType {
  id: string;
  role: string;
  permissions?: string;
}

export const columns: ColumnDef<ResponseType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "role",
    header: "Name",
  },
  {
    accessorKey: "permissions",
    header: "Permissions",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Actions id={row.original.id} />
    ),
    enableSorting: false,
  }
]
