"use client"
import React, { use } from 'react'
import { Edit3Icon, Loader2 } from 'lucide-react';

import { hasPermission } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import { useUserStore } from '@/features/users/hooks/use-user-store';
import { useOpenRequestValidation } from '@/features/requests/hooks/use-open-request-for-validation';


type Props = {
    id: string;
}

export const ActionsValidations = ({ id }: Props) => {
    const { user } = useUserStore();
    const { onOpen } = useOpenRequestValidation();

    if (user && hasPermission(user, "TRANSACTION-VALIDATE")) {
        return (
            <>
                <Button
                    // variant={"blue"}
                    onClick={() => onOpen(id)}
                    disabled={!user}
                >
                    Validation {!user ? <Loader2 /> : <Edit3Icon className="ml-2 size-4" />}
                </Button>
            </>
        )
    }

    return null

}
