"use client";

import React from 'react';
import { File, Loader2, Plus } from 'lucide-react';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import DataTable, { ApiFilters } from '@/components/data-table-with-advance-filter';

import { columns as columnsUsers , columnsFilters as filterUsers } from './_components/user/columns';
import { columns as columnsAudits, columnsFilters as filterAudits } from './_components/audit/columns';
import { columns as columnsRolesPermissions, columnsFilters as filterolesPermissions } from './_components/permission/columns';

import { useNewUser } from '@/features/users/hooks/use-new-user';
import { useGetUsers } from '@/features/users/api/use-get-users-list';
import { useUserStore } from '@/features/users/hooks/use-user-store';
import { useGetAudits } from '@/features/audits/use-get-audits';
import { useGetRolesPermissions } from '@/features/roles/use-get-roles-permissions';


type Props = {}

export default function AdminPage(props: Props) {
    const { user } = useUserStore()

    if (user?.role?.name.toUpperCase() !== 'ADMIN') return null;

    return (
        <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
            <Tabs defaultValue="account">
                <TabsList>
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="audit">Audit</TabsTrigger>
                    <TabsTrigger value="permission">Permission</TabsTrigger>
                    <TabsTrigger value="bank">Bank</TabsTrigger>
                </TabsList>
                <TabsContent value="account" >
                    <UsersCard />
                </TabsContent>

                <TabsContent value="audit" >
                    <AuditsCard />
                </TabsContent>

                <TabsContent value="permission">
                    <PermissionCard />
                </TabsContent>

                <TabsContent value="bank">
                  
                </TabsContent>
            </Tabs>

        </div>
    )
}


const UsersCard = () => {

    const newUser = useNewUser();

    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const [apiFilters, setApiFilters] = React.useState<ApiFilters | null>(null);

    // const deleteUsersQuery = useBulkDeleteUsers();
    const getUsersQuery = useGetUsers(page, limit, apiFilters);
    const users = getUsersQuery.data?.data || [];
    const isDisabled = getUsersQuery.isLoading //|| deleteUsersQuery.isPending

    const totalItems = getUsersQuery.data?.totalItems || 0;
    const getExportQuery = useGetUsers(page, totalItems, null);
    const exportData = getExportQuery.data?.data || [];

    // if (getUsersQuery.isLoading) {
    //     return (
    //         <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
    //             <Card className='border-none drop-shadow-sm'>
    //                 <CardHeader>
    //                     <Skeleton className="w-48 h-8" />
    //                 </CardHeader>
    //                 <CardContent className='h-[500px] w-full flex items-center justify-center'>
    //                     <Loader2 className='size-6 text-slate-300 animate-spin' />
    //                 </CardContent>
    //             </Card>
    //         </div>
    //     )
    // }

    return (
        <Card className='border-none drop-shadow-sm'>
            <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
                <CardTitle className='text-xl line-clamp-1'>User management</CardTitle>
                <div className='gap-x-2 flex items-center'>
                    <Button onClick={newUser.onOpen} size="sm">
                        <Plus className='size-4 mr-2' />
                        Add New
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <DataTable
                    label={"Users"}
                    columns={columnsUsers}
                    data={users}
                    isLoading={getUsersQuery.isLoading}
                    isError={getUsersQuery.isError}
                    disabled={isDisabled}
                    totalItems={totalItems}
                    page={page}
                    limit={limit}
                    setPage={setPage}
                    setLimit={setLimit}
                    setApiFilters={setApiFilters}
                    // filter feature
                    isFilterable={true}
                    filterColumns={filterUsers}
                    // Full Export feature
                    isExportable={true}
                    exportData={exportData}
                    // Delete feature
                    isDeletable={false}
                    onDelete={(row) => { }}
                />
            </CardContent>
        </Card>
    )
}


const AuditsCard = () => {

    const newUser = useNewUser();

    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const [apiFilters, setApiFilters] = React.useState<ApiFilters | null>(null);

    const getAuditsQuery = useGetAudits(page, limit, apiFilters);
    const audits = getAuditsQuery.data?.data || [];
    const totalItems = getAuditsQuery.data?.totalItems || 0;
    const isLoading = getAuditsQuery.isLoading;
    const isError = getAuditsQuery.isError;
    const isDisabled = getAuditsQuery.isLoading
    const getExportAuditsQuery = useGetAudits(page, totalItems, null);
    const exportAudits = getExportAuditsQuery.data?.data || [];

    // if (getAuditsQuery.isLoading) {
    //     return (
    //         <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
    //             <Card className='border-none drop-shadow-sm'>
    //                 <CardHeader>
    //                     <Skeleton className="w-48 h-8" />
    //                 </CardHeader>
    //                 <CardContent className='h-[500px] w-full flex items-center justify-center'>
    //                     <Loader2 className='size-6 text-slate-300 animate-spin' />
    //                 </CardContent>
    //             </Card>
    //         </div>
    //     )
    // }

    return (
        <Card className='border-none drop-shadow-sm'>
            <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
                <CardTitle className='text-xl line-clamp-1'>Audit management</CardTitle>
            </CardHeader>
            <CardContent>
                <DataTable
                    label={"Audits"}
                    columns={columnsAudits}
                    data={audits}
                    isLoading={isLoading}
                    isError={isError}
                    disabled={isDisabled}
                    totalItems={totalItems}
                    page={page}
                    limit={limit}
                    setPage={setPage}
                    setLimit={setLimit}
                    setApiFilters={setApiFilters}
                    // filter feature
                    isFilterable={true}
                    filterColumns={filterAudits}
                    // Full Export feature
                    isExportable={true}
                    exportData={exportAudits}
                    // Delete feature
                    isDeletable={true}
                    onDelete={(row) => {
                        const ids = row.map((r) => r.original.id);
                        console.log("ids", ids)
                        // deleteUsersQuery.mutate({ ids });
                    }}
                />
            </CardContent>
        </Card>
    )
}


const PermissionCard = () => {

    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const [apiFilters, setApiFilters] = React.useState<ApiFilters | null>(null);

    const getQuery = useGetRolesPermissions(page, limit, apiFilters);
    const data = getQuery.data?.data || [];
    const totalItems = getQuery.data?.totalItems || 0;
    const isLoading = getQuery.isLoading;
    const isError = getQuery.isError;
    const isDisabled = getQuery.isLoading
    const getExportAuditsQuery = useGetAudits(page, totalItems, null);
    const exportData = getExportAuditsQuery.data?.data || [];

    return (
        <CardComponent
            title="Permission"
            data={data}
            columns={columnsRolesPermissions}
            columnsFilters={filterolesPermissions}
            isLoading={isLoading}
            isError={isError}
            totalItems={totalItems}
            exportData={exportData}
            page={page}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
            setApiFilters={setApiFilters}
            isDeletable={false}
            onDelete={() => { }}
        />
    );
}


type CardComponentProps = {
    title: string;
    data: any[];
    columns: any[];
    isLoading: boolean;
    isError: boolean;
    totalItems: number;
    columnsFilters: any[];
    exportData: any[];
    page: number;
    setPage: {
        (updater: (prev: number) => number): void; // For functional updates
        (page: number): void; // For direct number updates
    };
    limit: number;
    setLimit: (limit: number) => void;
    setApiFilters: (filters: ApiFilters | null) => void;
    isDeletable: boolean;
    onDelete: (row: any[]) => void;
};


const CardComponent: React.FC<CardComponentProps> = ({
    title,
    data,
    columns,
    isLoading,
    columnsFilters,
    isError,
    totalItems,
    exportData,
    page,
    setPage,
    limit,
    setLimit,
    setApiFilters,
    isDeletable,
    onDelete }) => (
    <Card className='border-none drop-shadow-sm'>
        <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
            <CardTitle className='text-xl line-clamp-1'>{title} management</CardTitle>
        </CardHeader>
        <CardContent>
            <DataTable
                label={title}
                columns={columns}
                data={data}
                isLoading={isLoading}
                isError={isError}
                totalItems={totalItems}
                page={page} 
                limit={limit}
                setPage={setPage}
                setLimit={setLimit}
                setApiFilters={setApiFilters}
                isFilterable={true}
                filterColumns={columnsFilters}
                isExportable={true}
                exportData={exportData}
                isDeletable={isDeletable}
                onDelete={onDelete}
            />
        </CardContent>
    </Card>
);
