import React, { useState } from 'react'

import { format, parse } from 'date-fns';
import { convertAmountToMilliunits, getEntityIdByName, isValidDate } from '@/lib/utils';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';

import { ImportTable } from './import-table';
import { useGetBanks } from '@/features/banks/api/use-get-banks';
import { useGetPayModes } from '@/features/payModes/api/use-get-payModes';
import { toast } from 'sonner';
import { useGetBranches } from '@/features/bankAgencies/api/use-get-branchs';



const dateFormat = "yyyy-MM-dd"; //"yyyy-MM-dd HH:mm:ss";
const outputFormat = "yyyy-MM-dd";

const requredOptions = [
    "name",
    "amount",
    "payment_date",
    "bank",
    "branch",
    "mode",
];

interface SelectedColumnsState {
    [key: string]: string | null;
}


type Props = {
    data: string[][];
    onCancel: () => void;
    onSubmit: (data: any) => void;
}

export const ImportCard = ({
    data,
    onCancel,
    onSubmit
}: Props) => {

    const bankQuery = useGetBanks();
    const branchQuery = useGetBranches();
    const payModeQuery = useGetPayModes();

    const banks = bankQuery.data ?? [];
    const branches = branchQuery.data ?? [];
    const payModes = payModeQuery.data ?? [];

    const [selectedColumns, setSelectedColumns] = useState<SelectedColumnsState>({});
    // Headers of the file
    const headers = data[0];
    const body = data.slice(1);

    const onTableHeadSelectChange = (
        columnIndex: number,
        value: string | null
    ) => {
        setSelectedColumns((prev) => {
            const newSelectedColumns = { ...prev };

            for (let key in newSelectedColumns) {
                if (newSelectedColumns[key] === value) {
                    newSelectedColumns[key] = null;
                }

            }
            if (value === "skip") {
                value = null;
            }

            newSelectedColumns[`column_${columnIndex}`] = value
            return newSelectedColumns;
        })
    }

    const progress = Object.values(selectedColumns).filter(Boolean).length;

    const handleContinue = () => {
        const getColumnIndex = (column: string) => {
            return column.split("_")[1]; //`column_${columnIndex}`
        }

        const mappedData = {
            headers: headers.map((_header, index) => {
                const columnIndex = getColumnIndex(`column_${index}`);
                return selectedColumns[`column_${columnIndex}`] || null;
            }),
            body: body.map((row) => {
                const transformedRow = row.map((cell, index) => {
                    const columnIndex = getColumnIndex(`column_${index}`);
                    return selectedColumns[`column_${columnIndex}`] ? cell : null;
                });

                return transformedRow.every((item) => item === null)
                    ? []
                    : transformedRow;

            }).filter((row) => row.length > 0)
        };

        const arrayOfData = mappedData.body.map((row) => {
            return row.reduce((acc: any, cell, index) => {
                const header = mappedData.headers[index];
                if (header !== null) {
                    acc[header] = cell;
                }
                return acc;
            }, {});
        });

        const formatedData = arrayOfData.map((item) => ({
            ...item,
            bank: getEntityIdByName(item.bank?.trim().toUpperCase(), banks),
            branch: getEntityIdByName(item.branch?.trim().toUpperCase(), branches),
            mode: getEntityIdByName(item.mode?.trim().toUpperCase(), payModes),
            amount: convertAmountToMilliunits(parseFloat(item.amount)),
            // date: format(parse(item.date, dateFormat, new Date()), outputFormat)
        }));
        // formatedData.pop(); // remove the last element
          
        // Execute validation
        const validationErrors = validateTransactions(formatedData);
        if (validationErrors.length > 0) {
            // Send all errors to the user via toast notifications
            validationErrors.forEach(error => {
                toast.error(error); // Display each error as a toast notification
            });
            return; // Stop execution if there are validation errors     // Send all errors to the user via toast notifications
            validationErrors.forEach(error => {
                toast.error(error); // Display each error as a toast notification
            });
            return; // Stop execution if there are validation errors
        }
         
        // Proceed to submit if validation passes
        onSubmit(formatedData);
    }

    interface Transaction {
        name: string;
        amount: number;
        bank: string;
        branch: string;
        payment_date: string;
        mode: string;
        pay_mode: string;
    }

    // Function to validate transactions
    const validateTransactions = (transactions: Transaction[]): string[] => {
        const errors: string[] = [];
        for (const transaction of transactions) {
            if (typeof transaction.name !== 'string' || transaction.name.trim() === '') {
                errors.push(`Error: Transaction name cannot be empty.`);
            }
            if (typeof transaction.amount !== 'number' || isNaN(transaction.amount)) {
                errors.push(`Error: Amount must be a valid number.`);
            }
            if (!transaction.bank || transaction.bank.trim() === '') {
                errors.push(`Error: Some provided Bank are not valide please use the correct one`);
            }
            if (!transaction.branch || transaction.branch.trim() === '') {
                errors.push(`Error: Some provided Bank Branch are not valide please use the correct one`);
            }
            if (!transaction.mode || transaction.mode.trim() === '') {
                errors.push(`Error: Some payment mode are not valide please use the correct one.`);
            }
            if (!isValidDate(transaction.payment_date)) {
                errors.push(`Error: Payment date "${transaction.payment_date}" is not in the format DD/MM/YYYY.`);
            }
        }
        return errors;
    };


    return (
        <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
            <Card className='border-none drop-shadow-sm'>
                <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
                    <CardTitle className='text-xl line-clamp-1'>
                        Import Transaction
                    </CardTitle>
                    <div className='flex flex-col lg:flex-row items-center gap-y-2 gap-x-2'>
                        <Button
                            onClick={onCancel}
                            size="sm"
                            className='w-full lg:w-auto'
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={progress < requredOptions.length}
                            onClick={handleContinue}
                            size="sm"
                            className='w-full lg:w-auto'
                        >
                            Continue ({progress} / {requredOptions.length})
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <ImportTable
                        headers={headers}
                        body={body}
                        selectedColumns={selectedColumns}
                        onTableHeadSelectChange={onTableHeadSelectChange}
                    />
                </CardContent>
            </Card>
        </div>
    )
};


