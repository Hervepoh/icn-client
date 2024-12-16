"use client";
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
import { BiExport } from 'react-icons/bi';
import { useBrouillard } from '@/features/requests/hooks/use-brouillard';
import { Button } from '@/components/ui/button';


type Props = {}

export default function TransactionsPage(props: Props) {

    const brouillard = useBrouillard();
    const getTransactionsQuery = useGetRequests(); //useGetRequests("?status=validated");

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

    const transactions = getTransactionsQuery.data || [];
    const transactionsfiltered = transactions.filter((item: any) => item.status !== "draft" && !item.deleted);

    return (
        <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
            <Card className='border-none drop-shadow-sm'>
                <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
                    <CardTitle className='text-xl line-clamp-1'>ALL TRANSACTIONS </CardTitle>
                    <Button
                        onClick={brouillard.onOpen}
                        className='w-full lg:w-auto'>
                        <BiExport className='size-4 mr-2' />
                        Generated Brouillard
                    </Button>
                </CardHeader>
                <CardContent>
                    
                    <DataTableReadOnly
                        columns={columns}
                        data={transactionsfiltered}
                        filterKey='reference'
                        disabled={isDisabled}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

