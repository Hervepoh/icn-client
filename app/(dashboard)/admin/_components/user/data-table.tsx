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
import { DataTableToolbar } from "@/components/data-table-toolbar"
import { DataTablePagination } from "@/components/data-table-pagination"

import { useConfirm } from "@/hooks/use-confirm"
import { MdDownload } from "react-icons/md"


interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    filterKey: string,
    filterColumns?: { title?: string, key: string; }[]
    exportable?: boolean
    deletable?: boolean
    onDelete: (rows: Row<TData>[]) => void,
    disabled?: boolean,
    exportFile: string
}

export function DataTable<TData, TValue>({
    columns,
    data,
    filterKey,
    filterColumns,
    deletable = false,
    exportable= false,
    onDelete,
    disabled,
    exportFile
}: DataTableProps<TData, TValue>) {

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const [ConfirmationDialog, confirm] = useConfirm({
        title: "Are you sure?",
        message: "You are about to perform a bulk delete",
    });

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
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


    const saveAsExcelFile = (buffer: BlobPart, fileName: string) => {
        import('file-saver').then((module) => {
            if (module && module.default) {
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const dataList = new Blob([buffer], {
                    type: EXCEL_TYPE
                });

                module.default.saveAs(dataList, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    };


    const exportExcel = (data: any[]) => {
        const exportData = data.map((item) => {
            const { __v, ...rest } = item.original
            return rest;
        });
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(exportData);
            const workbook = { Sheets: { dataList: worksheet }, SheetNames: ['dataList'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, exportFile);
        });
    };

    return (
        <div>
            <ConfirmationDialog />
            <div className="flex items-center py-4 justify-between">
                <div className="flex items-center gap-x-3">
                    <DataTableToolbar table={table} filterKey={filterKey} filterColumns={filterColumns} filterStatus={true} />
                </div>
                <div className="flex gap-3" >
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
                    {
                        exportable && table.getFilteredSelectedRowModel().rows.length > 0 && (
                            <div className='flex flex-col lg:flex-row items-center gap-x-2 gap-y-2'>
                                <div className='flex items-center gap-2'>
                                    <span className='text-bold'>Export</span>
                                    <div className="flex align-items-center justify-content-end gap-2">
                                        <Button
                                            onClick={async () => {
                                                // exportCSV(table.getFilteredSelectedRowModel().rows);
                                                table.resetRowSelection();
                                            }}
                                            disabled={disabled}
                                            size="sm"
                                            variant="default"
                                            className="h-8 px-2 lg:px-3 ml-auto font-normal hover:bg-gray-800"
                                        >
                                            <MdDownload className="size-4 mr-2" />.csv ({table.getFilteredSelectedRowModel().rows.length})
                                        </Button>
                                        <Button
                                            onClick={async () => {
                                                exportExcel(table.getFilteredSelectedRowModel().rows);
                                                table.resetRowSelection();
                                            }}
                                            disabled={disabled}
                                            size="sm"
                                            variant="default"
                                            className="h-8 px-2 lg:px-3 ml-auto font-normal bg-green-700 hover:bg-green-900">
                                            <MdDownload className="size-4 mr-2" />.xls ({table.getFilteredSelectedRowModel().rows.length})
                                        </Button>
                                    </div>
                                </div>
                            </div>

                        )
                    }
                </div>

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
