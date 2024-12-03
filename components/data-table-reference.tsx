"use client"

import * as React from "react"
import { Trash } from "lucide-react"

import {
    ColumnDef,
    ColumnFiltersState,
    Row,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DataTablePagination } from "@/components/data-table-pagination"
import { DataTableToolbar } from "@/components/data-table-toolbar"

import { useConfirm } from "@/hooks/use-confirm"




interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    filterKey: string,
    filterColumns?: {title?:string,key:string;}[],
    deletable?: boolean
    onDelete: (rows: Row<TData>[]) => void,
    disabled?: boolean
}

export function DataTable<TData, TValue>({
    columns,
    data,
    filterKey,
    filterColumns,
    deletable=false,
    onDelete,
    disabled
}: DataTableProps<TData, TValue>) {

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
        supply_ref: false, 
        meter_no: false, 
        contact: false, 
        updatedAt: false,  
    })
    const [rowSelection, setRowSelection] = React.useState({})
    const [pagination, setPagination] = React.useState({
        pageIndex: 0, //initial page index
        pageSize: 100, //default page size
      });


    const [ConfirmationDialog, confirm] = useConfirm({
        title: "Are you sure?",
        message: "You are about to perform a bulk delete",
    });

    const table = useReactTable({
        data,
        columns,
        state: {
            pagination,
          sorting,
          columnVisibility,
          rowSelection,
          columnFilters,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
      })

    return (
        <div>
            <ConfirmationDialog />
            <div className="flex items-center py-4">
                <div className="flex items-center gap-x-3">
                    <DataTableToolbar table={table} filterKey={filterKey}  filterColumns={filterColumns} filterStatus={false}/>
                </div>
                {
                    deletable && table.getFilteredSelectedRowModel().rows.length > 0 && (
                        <Button
                            onClick={async () => {
                                const ok = await confirm();
                                if (ok) {
                                    // Logique for delete
                                    onDelete(table.getFilteredSelectedRowModel().rows);
                                    table.resetRowSelection();
                                }
                            }}
                            disabled={disabled}
                            size="sm"
                            variant="destructive"
                            className="ml-auto font-normal text-xs"
                        >
                            <Trash className="size-4 mr-2" />
                            Delete ({table.getFilteredSelectedRowModel().rows.length})
                        </Button>
                    )
                }
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    )
}
