"use client";
import { useRef } from 'react';
import { Loader2 } from 'lucide-react';

import { useGetRequests } from '@/features/requests/api/use-get-requests';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"
import { DataTableReadOnly } from '@/components/data-table-readonly';
import { columns } from './columns';


type Props = {}

export default function TransactionsPage(props: Props) {

    const getTransactionsQuery = useGetRequests("?status=validated");
    const transactions = getTransactionsQuery.data || [];

    const isDisabled = getTransactionsQuery.isLoading

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

    return (
        <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
            <Card className='border-none drop-shadow-sm'>
                <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
                    <CardTitle className='text-xl line-clamp-1'>Transactions Unpaids Or Not completed </CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTableReadOnly
                        columns={columns}
                        data={transactions}
                        filterKey='reference'
                        disabled={isDisabled}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

