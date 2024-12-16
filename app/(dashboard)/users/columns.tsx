"use client"

import { ArrowUpDown, MoreHorizontal, ShieldCheck, ShieldX, TriangleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

import { ColumnDef } from "@tanstack/react-table"
import { Actions } from "./actions";
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ResponseType {
  id: string;
  name: string;
  email: string;
  status: string;
  deleted: boolean;
  ldap: boolean;
  roles: string;
  unit: string,
  createdAt: string,
  updatedAt: string,
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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "unit",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4"
        >
          Unit
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const unit: string|null|undefined =  row.getValue("unit");
      return (
        <div
            // onClick={onClick}
            className={cn('flex items-center cursor-pointer hover:underline',
            !unit && "text-rose-500 hover:no-underline"
            )}>
            { !unit && <TriangleAlert className='mr-2 size-4 shrink-0' />}
            { unit || "OutsideOrganization"}
        </div>
      )
    },
  },
  // {
  //   accessorKey: "roles",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         className="-ml-4"
  //       >
  //         Roles
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     )
  //   },
  //   cell: ({ row }) => {
  //     const roles: string = row.getValue("roles");
  //     const roleList = roles.split(',').map((role: string) => role.trim().toLocaleUpperCase());
  //     if (!roles) {
  //       return (
  //         <div
  //             // onClick={onClick}
  //             className={cn('flex items-center cursor-pointer hover:underline',
  //              "text-rose-500 hover:no-underline"
  //             )}>
  //             <TriangleAlert className='mr-2 size-4 shrink-0' />
  //             No role
  //         </div>
  //       )
  //     }
  //     return (
  //       <div className='flex w-[100px] items-center gap-2'>
  //         {roleList.map((role, index) => (
  //           <Badge
  //             key={index}
  //             className="px-3.5 py-2.5 text-center"
  //             variant="default"
  //           >
  //             {role}
  //           </Badge>
  //         ))}
  //       </div>
  //     )
  //   },
  // },
  {
    accessorKey: "roles",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4"
        >
          Roles
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const roles: string | null = row.getValue("roles");
      
      // Check if roles is a non-empty string
      if (!roles || roles.trim() === '') {
        return (
          <div className={cn('flex items-center cursor-pointer hover:underline', "text-rose-500 hover:no-underline")}>
            <TriangleAlert className='mr-2 size-4 shrink-0' />
            No role
          </div>
        );
      }
  
      // Split the roles into a list
      const roleList = roles.split(',').map((role: string) => role.trim().toUpperCase());
  
      return (
        <div className='flex  flex-wrap  max-w-[290px] items-center gap-2'>
          {roleList.map((role, index) => (
            <Badge key={index} className="px-3.5 py-2.5 text-center" variant="default">
              {role}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "ldap",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4"
        >
          LDAP
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div className='flex w-[100px] items-center'>
           <Checkbox checked={row.getValue("ldap")} /> <span className="ml-2"> { row.getValue("ldap") ? "ON" : "OFF" }</span>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div className='flex w-[100px] items-center'>
          {
            row.getValue("status") == "inactive" ? (<Badge
              className="px-3.5 py-2.5 text-center"
              variant="destructive"
            >
             <ShieldX className="mr-1 h-4 w-4" /> INACTIVE
            </Badge>) :(<Badge
              className="px-3.5 py-2.5 text-center"
              variant="success"
            >
              <ShieldCheck className="mr-1 h-4 w-4" /> ACTIVE
            </Badge>) 
          }
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Actions id={row.original.id} status={!row.original.deleted} />
    ),
    enableSorting: false,
  }
]
