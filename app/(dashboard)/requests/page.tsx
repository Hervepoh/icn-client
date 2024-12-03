"use client";

import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Plus, Upload } from 'lucide-react';

import { hasPermission } from '@/lib/utils';

import { useUserStore } from '@/features/users/hooks/use-user-store';
import { useSelectBank } from '@/features/banks/hooks/use-select-bank';
import { useGetUnits } from '@/features/unit/api/use-get-units';
import { useNewRequest } from '@/features/requests/hooks/use-new-request';
import { useGetRequests } from '@/features/requests/api/use-get-requests';
import { useBulkCreateRequests } from '@/features/requests/api/use-bulk-create-requests';;
// import { useBulkDeleteTransactions } from '@/features/transactions/api/use-bulk-delete-transactions';

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Skeleton } from "@/components/ui/skeleton"
import { DataTable } from '@/components/data-table';

import { UploadButton } from './upload-button';
import { ImportCard } from './import-card';
import { columns } from './columns';
import { columnsInit } from './columns-init';
import { columnsRegion } from './columns-region';
import { Lock } from './lock';


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

    const transactions_all = transactions;
    let transactions_per_region: any[] = [];
    let transactions_per_unit: any[] = [];

    const unitsQuery = useGetUnits();
    const units = unitsQuery.data || [];

    let region_id = "";
    let region_name = "";
    let unit_name = "";
    // TODO AMELERER POUR RECUPERER DANS USER DIRECTEMENT
    if (user?.unitId) {
        const unit = units.find((unit: { id: string; name: string; region: string, regionId: string }) => unit.id === user.unitId)
        unit_name = unit?.name;
        region_id = unit?.regionId;
        region_name = unit?.region;
    }

    const isDisabled = getTransactionsQuery.isLoading || unitsQuery.isLoading // || deleteTransactionsQuery.isPending

    // Import features
    const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
    const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS)

    // Import Select Account to continue importing
    // const [BankDialog, confirm] = useSelectBank();

    const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
        const data = results.data.filter((item:any) => !(item.length === 1 && item[0] === '')); // Remove remove empty line in the csv file
        const cleanResult = {...results,data:data}; 
        setImportResults(cleanResult);
        setVariant(VARIANTS.IMPORT);
    };
    const onCancelImport = () => {
        setImportResults(INITIAL_IMPORT_RESULTS);
        setVariant(VARIANTS.LIST);
    };

    const onSubmitImport = async (
        values: any[]
    ) => {

        // const bankId = await confirm();

        // if (!bankId) {
        //     return toast.error("Please select a bank to continue.");
        // }

        const data = values.map((value: any) => ({
            ...value,
            // bank: bankId as string,
        }))

        createTransactionsQuery.mutate(data, {
            onSuccess: () => {
                toast.success("Import ok.")
                onCancelImport();

            }
        });

    };
    // Import features end



    if (!user || getTransactionsQuery.isLoading || unitsQuery.isLoading) {
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
                {/* <BankDialog /> */}
                <ImportCard
                    data={importResults.data}
                    onCancel={onCancelImport}
                    onSubmit={onSubmitImport}
                />
            </>
        )
    }

    if (!hasPermission(user, "TRANSACTION-VALIDATE", "TRANSACTION-ASSIGN")) {
        transactions = transactions.filter((transaction: any) => transaction.userId === user.id);

        // list of transaction  of the connected user region with the action 
        const transactions_per_region_temp = transactions_all.filter((transaction: any) => transaction.regionId === region_id);
        transactions_per_region = transactions_per_region_temp.map((transaction: any) => {
            return {
                ...transaction,
                isUserAuthorizedForAction: (user.unitId === transaction.unitId || transaction.unitId === null)
            };
        });

        // list of transaction of the connected user unit 
        transactions_per_unit = transactions_all.filter((transaction: any) => transaction.unitId === user?.unitId)
    }
    if (hasPermission(user, "TRANSACTION-VALIDATE")) {
        transactions = transactions.filter((transaction: any) => transaction.statusId == 3)
    }
    if (hasPermission(user, "TRANSACTION-ASSIGN")) {
        transactions = transactions.filter((transaction: any) => ((transaction.statusId == 4) && (transaction.userId === transaction.createdById)))
    }


    return (
        <>
        <Lock />
        <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
            <Card className='border-none drop-shadow-sm'>
                <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
                    <CardTitle className='text-xl line-clamp-1'>MY TRANSACTIONS</CardTitle>

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
                    {user?.role?.name === "COMMERCIAL" && (
                        <Tabs defaultValue="me">
                            <TabsList className='bg-primary'>
                                <TabsTrigger value="me">{` `} USER : {` `} {`ME`}</TabsTrigger>
                                <TabsTrigger value="region">{` `} REGION : {` `} {region_name}</TabsTrigger>
                                <TabsTrigger value="unit">{` `} UNIT : {` `} {unit_name}</TabsTrigger>
                            </TabsList>
                            <TabsContent value="me">
                                <DataTable
                                    columns={columns}
                                    data={transactions ?? []}
                                    filterKey='reference'
                                    filterColumns={[{ key: "name", title: "customer" }, { key: "bank" }, { key: "payment_mode", title: "mode" }]}
                                    deletable={hasPermission(user, "TRANSACTION-BULKDELETE")}
                                    onDelete={(row) => {
                                        ""
                                        // const ids = row.map((r) => r.original.id);
                                        // deleteTransactionsQuery.mutate({ ids });
                                    }}
                                    disabled={isDisabled}
                                />
                            </TabsContent>
                            <TabsContent value="region">
                                <DataTable
                                    columns={columnsRegion}
                                    data={transactions_per_region ?? []}
                                    filterKey='reference'
                                    filterColumns={[{ key: "name", title: "customer" }, { key: "bank" }, { key: "payment_mode", title: "mode" }, { key: "unit" }]}
                                    deletable={hasPermission(user, "TRANSACTION-BULKDELETE")}
                                    onDelete={(row) => {
                                        ""
                                        // const ids = row.map((r) => r.original.id);
                                        // deleteTransactionsQuery.mutate({ ids });
                                    }}
                                    disabled={isDisabled}
                                />
                            </TabsContent>
                            <TabsContent value="unit">
                                <DataTable
                                    columns={columns}
                                    data={transactions_per_unit ?? []}
                                    filterKey='reference'
                                    filterColumns={[{ key: "name", title: "customer" }, { key: "bank" }, { key: "payment_mode", title: "mode" }]}
                                    deletable={hasPermission(user, "TRANSACTION-BULKDELETE")}
                                    onDelete={(row) => {
                                        ""
                                        // const ids = row.map((r) => r.original.id);
                                        // deleteTransactionsQuery.mutate({ ids });
                                    }}
                                    disabled={isDisabled}
                                />
                            </TabsContent>
                        </Tabs>
                    )}

                    {user?.role?.name !== "COMMERCIAL" && (
                        <DataTable
                            columns={columnsInit}
                            data={transactions}
                            filterKey='reference'
                            filterColumns={[{ key: "name", title: "customer" }]}
                            deletable={hasPermission(user, "TRANSACTION-BULKDELETE")}
                            onDelete={(row) => {
                                ""
                                // const ids = row.map((r) => r.original.id);
                                // deleteTransactionsQuery.mutate({ ids });
                            }}
                            disabled={isDisabled}
                        />
                    )
                    }

                </CardContent>
            </Card>
        </div>
        </>
    )
}

