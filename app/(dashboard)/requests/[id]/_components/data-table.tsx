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

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { useConfirm } from "@/hooks/use-confirm"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    filterKey: string,
    onSubmit: (rows: Row<TData>[]) => void,
    disabled?: boolean
}

export function DataTable<TData, TValue>({
    columns,
    data,
    filterKey,
    onSubmit,
    disabled
}: DataTableProps<TData, TValue>) {

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const [ConfirmationDialog, confirm] = useConfirm({
        title: "Are you sure?",
        message: "You are about to add this item inside your ICN application",
    });

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div>
            <ConfirmationDialog />
            <div className="flex items-center justify-end  py-4">
                <div className="flex items-center gap-x-3">
                    <Input
                        placeholder={`Filter name...`}
                        value={(table.getColumn(filterKey)?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn(filterKey)?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                    {/* <Input
                        placeholder={`Filter amount...`}
                        value={(table.getColumn("5")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("5")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    /> */}
                 
                </div>

                {
                    table.getFilteredSelectedRowModel().rows.length > 0 && (
                        <Button
                            onClick={async () => {
                                const ok = await confirm();
                                if (ok) {
                                    // Logique for delete
                                    // console.log("Élément supprimé");
                                    onSubmit(table.getFilteredSelectedRowModel().rows);
                                    table.resetRowSelection();
                                }

                            }}
                            disabled={disabled}
                            size="sm"
                            variant="default"
                            className="ml-auto font-normal text-xs"
                        >
                            <Trash className="size-4 mr-2" />
                            Ajouter au panier ({table.getFilteredSelectedRowModel().rows.length})
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
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>

        </div>
    )
}
