"use client";
import { useNewBank } from '@/features/banks/hooks/use-new-bank';
import { useGetBanks } from '@/features/banks/api/use-get-banks';
import { useBulkDeleteBanks } from '@/features/banks/api/use-bulk-delete-banks';

import { Loader2, Plus } from 'lucide-react';
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


type Props = {}

export default function BanksPage(props: Props) {
    const newBank = useNewBank();
    // const deleteBanksQuery = useBulkDeleteBanks();
    const getBanksQuery = useGetBanks();
   
    const banks = getBanksQuery.data || [];
    const isDisabled = getBanksQuery.isLoading //|| deleteBanksQuery.isPending

    if (getBanksQuery.isLoading) {
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
                    <CardTitle className='text-xl line-clamp-1'>Banks Page</CardTitle>
                    <Button onClick={newBank.onOpen} size="sm">
                        <Plus className='size-4 mr-2' />
                        Add New
                    </Button>
                </CardHeader>
                <CardContent>
                     <DataTable
                        columns={columns}
                        data={banks}
                        filterKey='name'
                        onDelete={(row) => {
                            // const ids = row.map((r) => r.original.id);
                            // deleteBanksQuery.mutate({ ids });
                        }}
                        disabled={isDisabled}
                    /> 
                </CardContent>
            </Card>
        </div>
    )
}

