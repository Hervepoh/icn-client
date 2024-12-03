"use client"
import React from 'react'
import { useRouter } from 'next/navigation';
import { BiSolidEdit } from 'react-icons/bi';
import { Loader2 } from 'lucide-react';
import { FileSpreadsheet, FileText, MoreHorizontal, Send } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';

import { useUserStore } from '@/features/users/hooks/use-user-store';
import { useAddLockRequest } from '@/features/requests/api/use-add-lock-request';
import { useTransactionStore } from '@/features/requests/hooks/use-lockTransactions-store';

import { hasPermission } from '@/lib/utils';
import { useAlert } from '@/hooks/use-alert';
import { exportToExcel, exportToPDF } from '@/lib/export';


type Props = {
    id: string;
    show: boolean;
    exportable: boolean;
}

export const ActionsInvoicesAdd = ({ id, exportable, show }: Props) => {
    const router = useRouter();
    const { user } = useUserStore();
    const { lock } = useTransactionStore();

    const addLockTransactionsQuery = useAddLockRequest();
    const disabled = addLockTransactionsQuery.isPending;

    const isLock = (transactionId: string, userId: string): { status: boolean, user?: string } => {
        const transaction = lock.find(tx => tx.transactionId === transactionId);
        if (!transaction) {
            return { status: false };
        }
        if (transaction.userId === userId) {
            return { status: false };
        }
        return { status: true, user: transaction.users?.name };
    }

    const isLocked = isLock(id, user?.id || "");

    const [ConfirmationDialog, confirm] = useAlert({
        title: "You can not process this action",
        message: `This Transaction is currently being processed by another user . You cannot edit it until the user :  ${isLocked?.user} have completed their task.`,
    });

    const handleSellTask = async () => {
        // Verify that the transaction is not locked before proceeding
        if (isLocked.status) {
            const ok = await confirm(); //show a notification Transaction is already locked message
            return;
        }
        // Lock thee transaction and redirect to the detail page
        addLockTransactionsQuery.mutate({ transactionId: id }, {
            onSuccess: () => {
                router.push(`/requests/${id}`)
            },
            onError: (error) => {
                console.error("Error locking transaction:", error);
                // Optionally, handle error feedback to the user
            }
        });
    }

    if (user && hasPermission(user, "TRANSACTIONDETAIL-READ")) {
        console.log("ok");
        return (
            <>
                <ConfirmationDialog />
                {show ? (<DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="ghost" className='size-8 p-0'>
                            <MoreHorizontal className='size-4' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                        <DropdownMenuItem
                            disabled={false}
                            onClick={() => router.push(`/requests/${id}`)}
                        >
                            <Send className="mr-2 size-4" />
                            <span>View</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            disabled={!exportable}
                            onClick={() => exportToPDF(id)}
                        >
                            <FileText className="mr-2 size-4" />
                            <span>Generate Receipt PDF</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            disabled={!exportable}
                            onClick={() => exportToExcel(id)}
                        >
                            <FileSpreadsheet className="mr-2 size-4" />
                            <span>Generate Receipt Excel</span>
                        </DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>) : (
                    <Button
                        variant="default"
                        onClick={handleSellTask}
                        disabled={disabled}
                    >
                        {disabled ?
                            (<><Loader2 className='animate-spin size-4 mr-2' /> Loading</>) :
                            (<span className='flex'><BiSolidEdit className="mr-2 size-4" />Add Invoices</span>)
                        }
                    </Button>
                )}
            </>
        )
    }

    return
}
