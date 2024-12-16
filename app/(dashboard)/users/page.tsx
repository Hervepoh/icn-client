"use client";

import { Loader2, Plus } from 'lucide-react';
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

import { useNewUser } from '@/features/users/hooks/use-new-user';
import { useGetUsers } from '@/features/users/api/use-get-users-list';
import { useUserStore } from '@/features/users/hooks/use-user-store';

type Props = {}

export default function UsersPage(props: Props) {
    const newUser = useNewUser();
    const { user } = useUserStore();

    // const deleteUsersQuery = useBulkDeleteUsers();
    const getUsersQuery = useGetUsers();
    const users = getUsersQuery.data || [];
    const isDisabled = getUsersQuery.isLoading //|| deleteUsersQuery.isPending

    if (getUsersQuery.isLoading) {
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
                    <CardTitle className='text-xl line-clamp-1'>User management</CardTitle>
                    {user?.role?.name.toUpperCase() === 'ADMIN' && <Button onClick={newUser.onOpen} size="sm">
                        <Plus className='size-4 mr-2' />
                        Add New
                    </Button>}

                </CardHeader>
                <CardContent>
                    {user?.role?.name.toUpperCase() === 'ADMIN' &&
                        <DataTable
                            columns={columns}
                            data={users}
                            filterKey='name'
                            onDelete={(row) => {
                                // const ids = row.map((r) => r.original.id);
                                // deleteUsersQuery.mutate({ ids });
                            }}
                            disabled={isDisabled}
                        />
                    }
                </CardContent>
            </Card>
        </div>
    )
}

