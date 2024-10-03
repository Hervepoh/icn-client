"use client"
import React from 'react'

import { useOpenCategory } from '@/features/categories/hooks/use-open-category';
import { useDeleteCategory } from '@/features/categories/api/use-delete-category';

import { Edit, MoreHorizontal, Trash, Trash2, User } from 'lucide-react';
import { useConfirm } from '@/hooks/use-confirm';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';


type Props = {
    id: string;
}

export const Actions =  ({ id }: Props) => {
    const { onOpen, onClose } = useOpenCategory();
    const [ConfirmationDialog, confirm] = useConfirm({
        title: "Are you sure?",
        message: "You are about to delete this category",
    });

    const deleteMutation = useDeleteCategory(id);
    const isPending = deleteMutation.isPending
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
