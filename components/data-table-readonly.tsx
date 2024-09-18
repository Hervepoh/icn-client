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
import { BiBookReader } from "react-icons/bi"
import { MdDownload } from "react-icons/md"
import { format } from "date-fns"


interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    filterKey: string,
    disabled?: boolean
}

export function DataTableReadOnly<TData, TValue>({
    columns,
    data,
    filterKey,
    disabled
}: DataTableProps<TData, TValue>) {

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})


    // Function to convert JSON to CSV
    function jsonToCSV(jsonData: any[]): string {
        const delimiter = '|'
        const headers = [
            'id', 'index', '_id', 'reference', 'userId', 'name', 'amount',
            'bank', 'payment_date', 'payment_mode', 'status', 'createdBy',
            'modifiedBy', 'createdAt', 'updatedAt'
        ];

        const csvRows = [];
        csvRows.push(headers.join(delimiter)); // Add header row

        for (const item of jsonData) {
            const row = [
                item.id,
                item.index,
                item.original._id,
                item.original.reference,
                item.original.userId,
                item.original.name,
                item.original.amount,
                item.original.bank,
                item.original.payment_date ? format(item.original.payment_date, "dd/MM/yyyy") : null,
                item.original.payment_mode,
                item.original.status,
                item.original.updatedAt ? format(item.original.updatedAt, "dd/MM/yyyy HH:mm:ss") : null,
                item.original.modifiedBy,
                item.original.createdAt ? format(item.original.createdAt, "dd/MM/yyyy HH:mm:ss") : null,
                item.original.createdBy,

            ];
            csvRows.push(row.join(delimiter)); // Add data row
        }

        return csvRows.join('\n'); // Combine all rows into a single string
    }

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

    
    const exportCSV = (data: any) => {
        let fileName = 'transactions';
        let EXPORT_EXTENSION = '.csv';
        // Convert data to CSV format
        const csvString = jsonToCSV(data);

        // Create a CSV string
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        // Create a link element to trigger download
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download',  fileName + '_export_' + new Date().getTime() + EXPORT_EXTENSION);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // Clean up
    };


    const exportExcel = (data: any[]) => {
        const exportData = data.map((item)=> {
            const {__v , ...rest} = item.original 
            return rest;
        });
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(exportData);
            const workbook = { Sheets: { dataList: worksheet }, SheetNames: ['dataList'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, `transactions`);
        });
    };


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


    return (
        <div>
            <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-x-3">
                    <DataTableToolbar table={table} filterKey={filterKey} />
                </div>
                {
                    table.getFilteredSelectedRowModel().rows.length > 0 && (
                        <div className='flex flex-col lg:flex-row items-center gap-x-2 gap-y-2'>
                            <div className='flex items-center gap-2'>
                                <span className='text-bold'>Export</span>
                                <div className="flex align-items-center justify-content-end gap-2">
                                    <Button
                                        onClick={async () => {
                                            exportCSV(table.getFilteredSelectedRowModel().rows);
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
