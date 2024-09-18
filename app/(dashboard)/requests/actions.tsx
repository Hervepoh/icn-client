"use client"
import React, { useEffect, useState } from 'react'

import { useOpenRequest } from '@/features/requests/hooks/use-open-request';
import { useEditRequest } from '@/features/requests/api/use-edit-request';
import { useDeleteRequest } from '@/features/requests/api/use-delete-request';

import { Edit, MoreHorizontal, Send, Trash } from 'lucide-react';
import { useConfirm } from '@/hooks/use-confirm';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';

import { status } from '@/config/status.config';


type Props = {
    id: string;
}

export const Actions = ({ id }: Props) => {
    const { onOpen, onClose } = useOpenRequest();
    const [ConfirmationDialog, confirm] = useConfirm({
        title: "Are you sure?",
        message: "You are about to delete this transaction",
    });

    const editMutation = useEditRequest(id);
    const deleteMutation = useDeleteRequest(id);
    const isPending = editMutation.isPending || deleteMutation.isPending

    const handleSubmit = async () => {
        // Initiate a new transaction in the validation process
        editMutation.mutate({ status: status[2] }, {
            onSuccess: () => {
                onClose();
                //window.location.reload();
            },
        });

    }

    const handleDelete = async () => {
        const ok = await confirm();
        if (ok) {
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    onClose();
                },
            });
        }

    }

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
                        onClick={handleSubmit}
                    >
                        <Send className="mr-2 size-4" />
                        <span>Submit</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        disabled={isPending}
                        onClick={() => onOpen(id)}
                    >
                        <Edit className="mr-2 size-4" />
                        <span>Edit</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        disabled={isPending}
                        onClick={handleDelete}
                    >
                        <Trash className="mr-2 size-4" />
                        <span>Delete</span>
                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>

        </>
    )
}
