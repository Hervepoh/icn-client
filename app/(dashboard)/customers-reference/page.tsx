"use client";
// import { useNewCategory } from '@/features/categories/hooks/use-new-category';
import { useGetReferences } from '@/features/customersReference/api/use-get-references';
// import { useBulkDeleteCategories } from '@/features/categories/api/use-bulk-delete-categories';

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

import { DataTable } from '@/components/data-table-reference';
import { columns } from './columns';



type Props = {}

export default function ReferencesPage(props: Props) {
    // const newCategory = useNewCategory();
    // const deleteCategoriesQuery = useBulkDeleteCategories();
    const getReferencesQuery = useGetReferences();
   
    const references = getReferencesQuery.data || [];
    const isDisabled = getReferencesQuery.isLoading //|| deleteReferencesQuery.isPending

    if (getReferencesQuery.isLoading) {
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
                    <CardTitle className='text-xl line-clamp-1'>Customers Reference</CardTitle>
                    {/* <Button onClick={newCategory.onOpen} size="sm">
                        <Plus className='size-4 mr-2' />
                        Add New
                    </Button> */}
                </CardHeader>
                <CardContent>
                     <DataTable
                        columns={columns}
                        data={references}
                        filterKey='client'
                        onDelete={(row) => {
                            // const ids = row.map((r) => r.original.id);
                            // deleteCategoriesQuery.mutate({ ids });
                        }}
                        disabled={isDisabled}
                    /> 
                </CardContent>
            </Card>
        </div>
    )
}

