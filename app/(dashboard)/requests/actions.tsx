"use client"
import React, { useState } from 'react'
import { Edit, MoreHorizontal, Send, Trash } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';

import { useOpenRequest } from '@/features/requests/hooks/use-open-request';
import { useEditRequest } from '@/features/requests/api/use-edit-request';
import { useDeleteRequest } from '@/features/requests/api/use-delete-request';
import { useUserStore } from '@/features/users/hooks/use-user-store';

import { useConfirm } from '@/hooks/use-confirm';
import { status } from '@/config/status.config';
import { hasPermission } from '@/lib/utils';
import { unicityById } from '@/lib/qa';


type Props = {
    id: string;
}

export const Actions = ({ id }: Props) => {
    const { user } = useUserStore();

    // Hook to manage the open/close state of the request modal
    const { onOpen, onClose } = useOpenRequest();

    // State to capture message comming from the server 
    const [message, setMessage] = useState("");

    // Hook to handle confirmation dialogs with a specific title and message
    const [ConfirmationDialog, confirm] = useConfirm({
        title: "Are you sure?",
        message
    });

    const editMutation = useEditRequest(id);
    const deleteMutation = useDeleteRequest(id);
    const isPending = editMutation.isPending || deleteMutation.isPending

    const handleSubmit = async () => {
        // Perform QA on the data before submitting it to the server
        const QA = await unicityById(id);

        // Function to handle data submission
        const submitData = (advice: boolean = false) => {
            // Execute the mutation to edit the data to Initiate a new transaction in the validation process
            editMutation.mutate({ status: status[2] }, {
                // Callback function to execute on successful mutation
                onSuccess: () => {
                    // Close the form or modal on success
                    onClose();
                    //window.location.reload();
                },
            });
        };

        if (QA.status) {
            submitData(); // Directly submit if QA passes
        } else {
            setMessage(`You are about to record a transaction that matches an existing entry in our system.
     ${QA.transactions} . Please confirm if you wish to proceed with this action, as it may result in duplicate records.`); // Set QA message

            // Prompt for confirmation before proceeding
            const confirmed = await confirm();
            if (confirmed) {
                submitData(true); // Submit data if confirmed
            }
        }
    }

    const handleDelete = async () => {
        // Set a confirmation message 
        setMessage("You are about to delete this transaction.");

        const ok = await confirm();
        if (ok) {
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    onClose();
                },
            });
        }

    }

    if (user && hasPermission(user, "TRANSACTION-PUBLISH")) {
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

    return
}
