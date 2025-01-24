"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { cn, formatCurrency } from "@/lib/utils";
import { status, statuses, statusStyles } from "@/config/status.config";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table-column-header";

import { Actions } from "./actions";
import { ActionsValidations } from "./actions-validation";
import { ActionsInvoicesAdd } from "./actions-invoiceAdd";
import { ActionsAssignTo } from "./actions-assignTo";


interface ResponseType {
  id: string;
  reference: string;
  name: string;
  amount: string;
  bank: string;
  payment_date: Date;
  payment_mode: string;
  status: string;
  categoryId: string;
  isReceiptReady:boolean;
}

export const columnsInit: ColumnDef<ResponseType>[] = [
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
    accessorKey: "reference",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Reference' />
    ),
    enableHiding: false,
  },

  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue('status')
      )

      if (!status) {
        return null
      }
      const rowStatus: string = row.getValue("status");
      return (
        <div className='flex w-[100px] items-center'>
          <Badge
            variant={statusStyles[rowStatus] || "primary"}
            className="px-3.5 py-2.5 text-center">
            {status.icon && (
              <status.icon className={cn("mr-2 h-4 w-4 text-muted-foreground", status.iconColor)} />
            )}
            <span>{status.label.toLocaleUpperCase()}</span>
          </Badge>

        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },

  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Customer' />
    ),
  },

  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Amount' />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = formatCurrency(amount);

      return <Badge variant={amount < 0 ? "destructive" : "primary"} className="text-md font-medium px-3.5 py-2.5">{formatted}</Badge>
    },
  },

  {
    accessorKey: "bank",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Bank' />
    ),
  },

  {
    accessorKey: "payment_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date' />
    ),
    cell: ({ row }) => {
      const date = row.getValue("payment_date") as Date;

      return <span>{format(date, "dd/MM/yyyy")}</span>;
    },
  },

  {
    accessorKey: "payment_mode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Mode' />
    ),
  },


  {
    id: "actions",
    header: ({ column }) => ("Actions "),
    cell: ({ row }) => {
      //TODO : refactoring
      return row.original.status === status[1] && <Actions id={row.original.id} />
        || row.original.status === status[2] && <ActionsValidations id={row.original.id} />
        || row.original.status === status[3] && <ActionsAssignTo id={row.original.id} />
        || row.original.status === status[4] && ""
        || (
          row.original.status === status[5]
          || row.original.status === status[6]
          || row.original.status === status[7]
          || row.original.status === status[8]
        ) && <ActionsInvoicesAdd id={row.original.id} statusTransaction={row.original.status} show={ row.original.status === status[7] || row.original.status === status[8]} exportable={row.original.isReceiptReady} />
    },
    enableSorting: false,
  },
];
