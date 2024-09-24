"use client";

import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Plus, Upload } from 'lucide-react';

import { useUserStore } from '@/features/users/hooks/use-user-store';
import { useSelectBank } from '@/features/banks/hooks/use-select-bank';
import { useNewRequest } from '@/features/requests/hooks/use-new-request';
import { useGetRequests } from '@/features/requests/api.old/use-get-requests';
import { useBulkCreateRequests } from '@/features/requests/api.old/use-bulk-create-requests';;
// import { useBulkDeleteTransactions } from '@/features/transactions/api/use-bulk-delete-transactions';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Skeleton } from "@/components/ui/skeleton"
import { DataTable } from '@/components/data-table';

import { columns } from './columns';
import { ImportCard } from './import-card';
import { UploadButton } from './upload-button';
import { hasPermission } from '@/lib/utils';


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
    const { user } = useUserStore();

    const newRequest = useNewRequest()
    const getTransactionsQuery = useGetRequests();
    const createTransactionsQuery = useBulkCreateRequests();
    // const deleteTransactionsQuery = useBulkDeleteTransactions();

    let transactions = getTransactionsQuery.data || [];
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

        createTransactionsQuery.mutate(data, {
            onSuccess: () => {
                toast.success("Import ok.")
                onCancelImport();

            }
        });

    };
    // Import features end



    if (!user || getTransactionsQuery.isLoading) {
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

    if (!hasPermission(user, "TRANSACTION-VALIDATE", "TRANSACTION-ASSIGN")) {
        transactions = transactions.filter((transaction: any) => transaction.userId === user.id)
    }
    if (hasPermission(user, "TRANSACTION-VALIDATE")) {
        transactions = transactions.filter((transaction: any) => transaction.statusId == 3)
    }
    if (hasPermission(user, "TRANSACTION-ASSIGN")) {
        transactions = transactions.filter((transaction: any) => ( (transaction.statusId == 4) && (transaction.userId === transaction.createdById)))
    }


    return (
        <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
            <Card className='border-none drop-shadow-sm'> 
                <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
                    <CardTitle className='text-xl line-clamp-1'>Transactions History</CardTitle>

                    <div className='flex flex-col lg:flex-row items-center gap-x-2 gap-y-2'>
                        {

                            (hasPermission(user, "TRANSACTION-CREATE", "TRANSACTION-WRITE")) &&
                            <Button
                                onClick={newRequest.onOpen}
                                size="sm"
                                className='w-full lg:w-auto'>
                                <Plus className='size-4 mr-2' />
                                Add New
                            </Button>
                        }
                        {
                            (hasPermission(user, "TRANSACTION-BULKCREATE")) &&
                            <UploadButton
                                onUpload={onUpload}
                            />
                        }
                    </div>


                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={transactions}
                        filterKey='reference'
                        deletable={hasPermission(user, "TRANSACTION-BULKDELETE")}
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

