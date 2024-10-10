"use client"
import React from 'react'

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/features/users/hooks/use-user-store';
import { hasPermission } from '@/lib/utils';
import { LuMoreHorizontal } from 'react-icons/lu';
import {  BiSolidEdit } from 'react-icons/bi';


type Props = {
    id: string;
    show: boolean;
}

export const ActionsInvoicesAdd = ({ id, show = false }: Props) => {
    const { user } = useUserStore();
    const router = useRouter();
    const handleSellTask = async () => {
        router.push(`/requests/${id}`)
    }

    if (user && hasPermission(user, "TRANSACTIONDETAIL-READ")) {
        return (
            <>
                <Button
                    variant={show ? "ghost" : "default"}
                    onClick={handleSellTask}
                >
                    {show ?
                        <HoverCard>
                            <HoverCardTrigger><LuMoreHorizontal /></HoverCardTrigger>
                            <HoverCardContent>
                                View details
                            </HoverCardContent>
                        </HoverCard>
                        : <span className='flex'><BiSolidEdit className="mr-2 size-4" />Completed Commercial Task</span>}
                </Button>
            </>
        )
    }

    return
}
