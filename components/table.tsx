import React from 'react'
import { FileSearch, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { status } from '@/config/status.config';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';


type Props = {
    title: string
    type: "unit" | "region"
    data?: {
        region: string;
        unit?: string;
        status: string;
        number: number;
        amount: number;
    }[];
}

export const Tab = ({
    title,
    type,
    data = []
}: Props) => {

    return (
        <Card className='border-none drop-shadow-sm'>
            <CardHeader className='flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between'>
                <CardTitle className='text-xl line-clamp-1'>
                    {title}
                </CardTitle>
            </CardHeader>

            <CardContent>
                {
                    data.length === 0
                        ? (<div className='flex flex-col gap-y-4 items-center justify-center h-[350px] w-full '>
                            <FileSearch className='size-6 text-muted-foreground' />
                            <p className='text-muted-foreground text-sm'>
                                No data of the period
                            </p>
                        </div>)
                        : (
                            <>
                                {type === "unit" && (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Region</TableHead>
                                                <TableHead>unit</TableHead>
                                                <TableHead>Statut</TableHead>
                                                <TableHead>Number</TableHead>
                                                <TableHead>Amount</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {data.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{item.region}</TableCell>
                                                    <TableCell>{item.unit}</TableCell>
                                                    <TableCell>
                                                        <StatusBadge status={item.status} />
                                                    </TableCell>
                                                    <TableCell>{item.number}</TableCell>
                                                    <TableCell>{item.amount}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )
                                }
                                {type === "region" && (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Region</TableHead>
                                                <TableHead>Statut</TableHead>
                                                <TableHead>Number</TableHead>
                                                <TableHead>Amount</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {data.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{item.region}</TableCell>
                                                    <TableCell>
                                                        <StatusBadge status={item.status} />
                                                    </TableCell>
                                                    <TableCell>{item.number}</TableCell>
                                                    <TableCell>{item.amount}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )
                                }
                            </>)
                }
            </CardContent>


        </Card>
    )
}


export const ChartLoading = () => {

    return (
        <Card className='border-none drop-shadow-sm'>
            <CardHeader className='flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between'>
                <Skeleton className='h-8 w-48' />
                <Skeleton className='h-8 lg:w-[120px] w-full' />
            </CardHeader>
            <CardContent>
                <div className='h-[350px] w-full flex items-center justify-center'>
                    <Loader2 className='size-6 text-slate-300 animate-spin' />
                </div>
            </CardContent>
        </Card>
    )
}

interface StatusBadgeInterface {
    status: string
}

export const StatusBadge = ({
    status
}: StatusBadgeInterface) => {
    return (
        <span className={cn("px-2 py-1 rounded-full text-sm",
            status === status[2] && "bg-blue-100 text-blue-800",
            status === status[7] && "bg-cyan-100 text-cyan-800",
            status === status[7] && "bg-cyan-100 text-cyan-800",
            status === status[8] && "bg-green-100 text-green-800",
            "bg-yellow-100 text-yellow-800"
        )}>
            {status}
        </span>
    )
}