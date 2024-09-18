"use client";
import { ArrowUpDown, ClipboardCheck, TriangleAlert } from "lucide-react";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { formatCurrency } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { Actions } from "./actions";
import { status, statuses, statusStyles } from "@/config/status.config";
import { ActionsValidations } from "./actions-validation";
import { ActionsInvoicesAdd } from "./actions-invoiceAdd";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
// import { AccountColumn } from "./account-column";
// import { CategoryColumn } from "./category-column";

interface ResponseType {
  _id: string;
  reference: string;
  name: string;
  amount: string;
  bank: string;
  payment_date: Date;
  payment_mode: string;
  status: string;
  categoryId: string;
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
    accessorKey: "reference",
    // header: ({ column }) => {
    //   return (
    //     <Button
    //       variant="ghost"
    //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //       className="-ml-4"
    //     >
    //       Reference
    //       <ArrowUpDown className="ml-2 h-4 w-4" />
    //     </Button>
    //   );
    // },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Reference' />
    ),
    enableHiding: false,
  },

  // {
  //   accessorKey: "status",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         className="-ml-4"
  //       >
  //         Status
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     const rowStatus: string = row.getValue("status");

  //     const statusIcons: { [key: string]: React.ReactNode } = {
  //       "draft": <TriangleAlert className="mr-2 size-4 shrink-0" />,
  //       "initiated": <LuCopyCheck className="mr-2 size-4 shrink-0" />,
  //       "validated": <ClipboardCheck className="mr-2 size-4 shrink-0" />,
  //       "pending_commercial_input": <TriangleAlert className="mr-2 size-4 shrink-0" />,
  //       "pending_finance_validation": <TriangleAlert className="mr-2 size-4 shrink-0" />,
  //     };

  //     return <Badge
  //       variant={statusStyles[rowStatus] || "primary"}
  //       className="text-md font-bold px-3.5 py-2.5">
  //       {statusIcons[rowStatus]}
  //       {rowStatus.toUpperCase()}
  //     </Badge>
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  // },
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
            className="px-3.5 py-2.5">
            {status.icon && (
              <status.icon className='mr-2 h-4 w-4 text-muted-foreground text-white' />
            )}
            <span>{status.label}</span>
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
    // header: ({ column }) => {
    //   return (
    //     <Button
    //       variant="ghost"
    //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //       className="-ml-4"
    //     >
    //       Customer
    //       <ArrowUpDown className="ml-2 h-4 w-4" />
    //     </Button>
    //   );
    // },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Customer' />
    ),
  },

  {
    accessorKey: "amount",
    // header: ({ column }) => {
    //   return (
    //     <Button
    //       variant="ghost"
    //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //       className="-ml-4"
    //     >
    //       Amount
    //       <ArrowUpDown className="ml-2 h-4 w-4" />
    //     </Button>
    //   );
    // },
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
    // header: ({ column }) => {
    //   return (
    //     <Button
    //       variant="ghost"
    //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //       className="-ml-4"
    //     >
    //       Bank
    //       <ArrowUpDown className="ml-2 h-4 w-4" />
    //     </Button>
    //   );
    // },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Bank' />
    ),
  },

  {
    accessorKey: "payment_date",
    // header: ({ column }) => {
    //   return (
    //     <Button
    //       variant="ghost"
    //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //       className="-ml-4"
    //     >
    //       Date
    //       <ArrowUpDown className="ml-2 h-4 w-4" />
    //     </Button>
    //   );
    // },
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
    // header: ({ column }) => {
    //   return (
    //     <Button
    //       variant="ghost"
    //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //       className="-ml-4"
    //     >
    //       Mode
    //       <ArrowUpDown className="ml-2 h-4 w-4" />
    //     </Button>
    //   );
    // },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Mode' />
    ),
    // cell: ({ row }) => {
    //   return (
    //     <CategoryColumn id={row?.original?._id} category={row?.original?.mode} categoryId={row?.original?.categoryId} />
    //   )
    // },
  },

  {
    id: "actions",
    header: ({ column }) => ( "Actions "),
    cell: ({ row }) => row.original.status === status[1] && <Actions id={row.original._id} />
      || row.original.status === status[2] && <ActionsValidations id={row.original._id} />
      || row.original.status === status[3] && <ActionsInvoicesAdd id={row.original._id} />
      || row.original.status === status[4] && (""),
    enableSorting: false,
  },
];
