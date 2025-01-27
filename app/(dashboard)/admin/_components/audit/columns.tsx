"use client"

import { ColumnDef } from "@tanstack/react-table"
import { columnsFilter } from "@/components/data-table-with-advance-filter"

export const columnsFilters:columnsFilter[] = [
  { accessorKey: 'action', title: 'Audit Name' },
  { accessorKey: 'userId', title: 'User' },
  { accessorKey: 'ipAddress', title: 'IP Address' },
  { accessorKey: 'source',  title: 'Source' },
  { accessorKey: 'endpoint', title: 'Endpoint' },
  { accessorKey: 'createdAt',  title: 'Created At' },
  { accessorKey: 'details', title: "Details"},
];

interface ResponseType {
  id: string;
  action: string;
  userId: string;
  ipAddress: string;
  source: string;
  endpoint: string;
  details: string,
  createdAt: string,
}

export const columns: ColumnDef<ResponseType>[] = [
  {
    accessorKey: 'action',
    header: 'Audit Name'
  },
  {
    accessorKey: 'userId',
    header: 'User'
  },
  {
    accessorKey: 'ipAddress',
    header: 'IP Address'
  },
  {
    accessorKey: 'source', 
    header: 'Source'
  },
  {
    accessorKey: 'endpoint',
    header: 'Endpoint'
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At'
  },
  {
    accessorKey: 'details',
    header: 'Details',
    size: 200,  
    minSize: 100
  }
]


