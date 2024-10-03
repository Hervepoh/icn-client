import { z } from "zod";
import React from "react";

import { useGetBanks } from "@/features/banks/api/use-get-banks";
import { useGetPayModes } from "@/features/payModes/api/use-get-payModes";

import { useViewRequest } from "@/features/requests/hooks/use-view-request";
import { ViewRequestForm } from "@/features/requests/components/view-request-form";
import { useGetRequest } from "@/features/requests/api/use-get-request";

import { Loader2 } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useGetUsers } from "@/features/users/api/use-get-users";
import { useGetStatus } from "@/features/status/api/use-get-status";



export function ViewRequestSheet() {
    const { isOpen, onClose, onOpen, id } = useViewRequest();

    const transactionQuery = useGetRequest(id);
   

    const payModeQuery = useGetPayModes();
    const payModeOptions = (payModeQuery.data ?? []).map(
        (payMode: { name: any; id: any; }) => ({
            label: payMode.name,
            value: payMode.id
        })
    );

    const bankQuery = useGetBanks();
    const bankOptions = (bankQuery.data ?? []).map(
        (bank: { name: any; id: any; }) => ({
            label: bank.name,
            value: bank.id
        })
    );

    const userQuery = useGetUsers();
    const userOptions = (userQuery.data ?? []).map(
        (item: { name: any; id: any; }) => ({
            label: item.name,
            value: item.id
        })
    );

    const statusQuery =  useGetStatus();
    const statusOptions = (statusQuery.data ?? []).map(
        (item: { name: any; id: any; }) => ({
            label: item.name,
            value: item.id
        })
    );

    const isLoading =
        transactionQuery.isLoading ||
        userQuery.isLoading ||
        bankQuery.isLoading ||
        payModeQuery.isLoading

    const defaultValues = transactionQuery.data
        ? {
            reference: transactionQuery.data.reference,
            userId: transactionQuery.data.userId,
            name: transactionQuery.data.name,
            amount: transactionQuery.data.amount,
            bank: transactionQuery.data.bankId,
            paymentDate: transactionQuery.data.paymentDate
                ? new Date(transactionQuery.data.paymentDate)
                : new Date(),
            paymentMode: transactionQuery.data.paymentModeId,
            status: transactionQuery.data.statusId,
            description: "",
            validatedBy: transactionQuery.data.validatorId,
            validatedAt: transactionQuery.data.validatedAt,
            refusal: transactionQuery.data.refusal,
            reasonForRefusal: transactionQuery.data.reasonForRefusal,
            createdBy: transactionQuery.data.createdBy,
            createdAt: transactionQuery.data.createdAt
                ? new Date(transactionQuery.data.createdAt)
                : new Date(),
            modifiedBy: transactionQuery.data.modifiedBy,
            updatedAt: transactionQuery.data.updatedAt
                ? new Date(transactionQuery.data.updatedAt)
                : new Date(),
        }
        : {
            reference: "",
            userId:  "",
            name: "",
            amount: "",
            bank: "",
            paymentDate: new Date(),
            paymentMode: "",
            status: "",
            description: "",
            validatedBy: "",
            validatedAt: "",
            refusal: false,
            reasonForRefusal: "",
            createdBy: "",
            modifiedBy: "",
            deleted: false,
            deletedBy: null,
            deletedAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };


    return (
        <>
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="space-y-4" side="right_special_50">
                    <SheetHeader>
                        <SheetTitle>View Transaction</SheetTitle>
                        <SheetDescription>
                            Transaction informations
                        </SheetDescription>
                    </SheetHeader>
                    {isLoading
                        ? (<div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="size-4 text-muted-foreground animate-spin" />
                        </div>)
                        : (
                            <ViewRequestForm
                                id={id}
                                defaultValues={defaultValues}
                                disabled={true}
                                bankOptions={bankOptions}
                                payModeOptions={payModeOptions}
                                userOptions={userOptions}
                                statusOptions={statusOptions}
                            />
                        )
                    }

                </SheetContent>
            </Sheet>
        </>
    )
}
