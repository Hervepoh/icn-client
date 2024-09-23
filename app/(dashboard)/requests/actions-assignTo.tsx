"use client"
import React from 'react'

import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/features/users/hooks/use-user-store';
import { useOpenRequestAssignation } from '@/features/requests/hooks/use-open-request-for-assignation';
import { hasPermission } from '@/lib/utils';

type Props = {
    id: string;
}

export const ActionsAssignTo = ({ id }: Props) => {
    const { user } = useUserStore();
    const { onOpen } = useOpenRequestAssignation();

    if (user && hasPermission(user, "TRANSACTION-ASSIGN")) {
        return (
            <Button
                disabled={!user}
                onClick={() => onOpen(id)}
            >
                <Send className="mr-2 size-4" />
                <span>Assign to KAM</span>

            </Button>
        )
    }

    return
}
