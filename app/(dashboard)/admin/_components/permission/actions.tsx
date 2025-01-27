"use client"
import React, { useState } from 'react'

import { Edit, MoreHorizontal, Power, PowerOff, Trash, Trash2, User, UserRoundPen } from 'lucide-react';
import { useConfirm } from '@/hooks/use-confirm';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useOpenUser } from '@/features/users/hooks/use-open-user';
import { useDisReactiveUser } from '@/features/users/api/use-dis-reactivate-user';
import { useDeleteUser } from '@/features/users/api/use-delete-user';


type Props = {
    id: string;
}

export const Actions = ({ id }: Props) => {
    const { onOpen, onClose } = useOpenUser();

    const [confirmMessage, setconfirmMessage] = useState("Are you sure?");

    const [ConfirmationDialog, confirm] = useConfirm({
        title: "Are you sure?",
        message: confirmMessage,
    });

    const mutation = useDisReactiveUser(id);

    const handleAction = async () => {
        const action = status ? "Deactivation" : "Reactivation";
        setconfirmMessage(`You are about to ${action.toLowerCase()} this user. Are you sure you want to proceed?`)
        const ok = await confirm();
        if (ok) {
            mutation.mutate(undefined, {
                onSuccess: () => {
                    onClose();
                },
            });
        }
    }

    const mutationDelete = useDeleteUser(id);
    
    const handleDelete = async () => {
        setconfirmMessage(`You are about to delete this user.`)
        const ok = await confirm();
        if (ok) {
            mutationDelete.mutate(undefined, {
                onSuccess: () => {
                    onClose();
                },
            });
        }
    }

    const isPending = mutation.isPending || mutationDelete.isPending

    return (
        <>
            <ConfirmationDialog />
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button variant="ghost" className='size-8 p-0'>
                        <MoreHorizontal className='size-4' />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                    <DropdownMenuItem
                        disabled={isPending}
                        onClick={() => onOpen(id)}
                    >
                        <UserRoundPen className="mr-2 size-4" />
                        <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        disabled={isPending}
                        onClick={handleAction}
                    >
                        {status ? <PowerOff className="mr-2 size-4" /> : <Power className="mr-2 size-4" />}
                        <span>{status ? "Deactivation" : "Reactivation"}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        disabled={isPending}
                        onClick={handleDelete}
                    >
                        <Trash className="mr-2 size-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

        </>
    )
}
