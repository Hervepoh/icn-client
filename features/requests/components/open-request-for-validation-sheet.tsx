import { z } from "zod";

import { Loader2 } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

import { useConfirm } from "@/hooks/use-confirm";
import { useGetRequest } from "@/features/requests/api/use-get-request";
import { useEditRequest } from "@/features/requests/api/use-edit-request";
import { useOpenRequestValidation } from "@/features/requests/hooks/use-open-request-for-validation";
import { RequestFormForValidation } from "@/features/requests/components/request-form-for-validation";
import { status } from "@/config/status.config";


export function OpenRequestForValidationSheet() {
    const { isOpen, onClose, id } = useOpenRequestValidation();
    const [ConfirmationDialog, confirm] = useConfirm({
        title: "Are you sure?",
        message: "You are about to validate this transaction , Are you sure you want to perform this action?",
    });

    const transactionQuery = useGetRequest(id);
    const editMutation = useEditRequest(id);

    const isPending = editMutation.isPending
    const isLoading = transactionQuery.isLoading

    const defaultValues = transactionQuery.data
        ? {
            name: transactionQuery.data.name,
            amount: transactionQuery.data.amount?.toString(),
            bank: transactionQuery.data.bank,
            branch: transactionQuery.data.branch,
            town: transactionQuery.data.town,
            advice: transactionQuery.data.advice_duplication,
            payment_date: transactionQuery.data.paymentDate
                ? new Date(transactionQuery.data.paymentDate)
                : new Date(),
            payment_mode: transactionQuery.data.paymentMode,
        }
        : {
            name: "",
            amount: "",
            bank: "",
            branch: "",
            town: "",
            advice: false,
            payment_date: new Date(),
            payment_mode: "",
        };

    const onValidate = async () => {
        const ok = await confirm();
        if (ok) {
            editMutation.mutate({ status: status[3] }, {
                onSuccess: () => {
                    onClose();
                },
            });
        }

    }
    const onReject = async (value: any) => {
        editMutation.mutate(value, {
            onSuccess: () => {
                onClose();
            },
        });
    }

    if (!id) return

    return (
        <>
            <ConfirmationDialog />
            <Sheet open={isOpen} onOpenChange={onClose} >
                <SheetContent className="space-y-4" side="right_special2">
                    <SheetHeader >
                        <SheetTitle className="text-center"> Transaction validation workflow</SheetTitle>
                        <SheetDescription className="text-center">
                            Validate an existing transaction
                        </SheetDescription>
                    </SheetHeader>
                    {isLoading
                        ? (<div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="size-4 text-muted-foreground animate-spin" />
                        </div>)
                        : (
                            <RequestFormForValidation
                                id={id}
                                defaultValues={defaultValues}
                                onValidate={onValidate}
                                onReject={onReject}
                                disabled={isPending}
                            />
                        )
                    }

                </SheetContent>
            </Sheet>
        </>
    )
}
