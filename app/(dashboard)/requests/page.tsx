"use client";

import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Plus, Upload } from 'lucide-react';

import { useNewRequest } from '@/features/requests/hooks/use-new-request';
import { useGetRequests } from '@/features/requests/api/use-get-requests';
import { useBulkCreateRequests } from '@/features/requests/api/use-bulk-create-requests';;
// import { useBulkDeleteTransactions } from '@/features/transactions/api/use-bulk-delete-transactions';


import { useSelectBank } from '@/features/banks/hooks/use-select-bank';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Skeleton } from "@/components/ui/skeleton"
import { DataTable } from '@/components/data-table';

import { columns } from './columns';
import { UploadButton } from './upload-button';
import { ImportCard } from './import-card';
import { useSelector } from 'react-redux';

enum VARIANTS {
    LIST = "LIST",
    IMPORT = "IMPORT",
}

const INITIAL_IMPORT_RESULTS = {
    data: [],
    errors: [],
    meta: {},
};

type Props = {}

export default function TransactionsPage(props: Props) {
    const { user } = useSelector((state: any) => state.auth);
    const newRequest = useNewRequest()
    const createTransactionsQuery = useBulkCreateRequests();
    // const deleteTransactionsQuery = useBulkDeleteTransactions();
    const getTransactionsQuery = useGetRequests();
    const transactions = getTransactionsQuery.data || [];

    const isDisabled = getTransactionsQuery.isLoading // || deleteTransactionsQuery.isPending

    // Import features
    const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
    const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS)

    // Import Select Account to continue importing
    const [BankDialog, confirm] = useSelectBank();

    const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
        setImportResults(results);
        setVariant(VARIANTS.IMPORT);
    };
    const onCancelImport = () => {
        setImportResults(INITIAL_IMPORT_RESULTS);
        setVariant(VARIANTS.LIST);
    };

    const onSubmitImport = async (
        values: any[]
    ) => {

        const bankId = await confirm();

        if (!bankId) {
            return toast.error("Please select a bank to continue.");
        }

        const data = values.map((value: any) => ({
            ...value,
            bank: bankId as string,
        }))

        console.log("data", data);

        createTransactionsQuery.mutate(data, {
            onSuccess: () => {
                toast.success("Import ok.")
                onCancelImport();

            }
        });

    };
    // Import features end



    if (getTransactionsQuery.isLoading) {
        return (
            <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
                <Card className='border-none drop-shadow-sm'>
                    <CardHeader>
                        <Skeleton className="w-48 h-8" />
                    </CardHeader>
                    <CardContent className='h-[500px] w-full flex items-center justify-center'>
                        <Loader2 className='size-6 text-slate-300 animate-spin' />
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (variant === VARIANTS.IMPORT) {
        return (
            <>
                <BankDialog />
                <ImportCard
                    data={importResults.data}
                    onCancel={onCancelImport}
                    onSubmit={onSubmitImport}
                />
            </>
        )
    }

    return (
        <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
            <Card className='border-none drop-shadow-sm'>
                <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
                    <CardTitle className='text-xl line-clamp-1'>Transactions History</CardTitle>
                    {
                        (user.role === 'user' || user.role === 'admin') &&
                        <div className='flex flex-col lg:flex-row items-center gap-x-2 gap-y-2'>
                            <Button
                                onClick={newRequest.onOpen}
                                size="sm"
                                className='w-full lg:w-auto'>
                                <Plus className='size-4 mr-2' />
                                Add New
                            </Button>
                            <UploadButton
                                onUpload={onUpload}
                            />
                        </div>
                    }

                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={transactions}
                        filterKey='reference'
                        onDelete={(row) => {
                            ""
                            // const ids = row.map((r) => r.original.id);
                            // deleteTransactionsQuery.mutate({ ids });
                        }}
                        disabled={isDisabled}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

