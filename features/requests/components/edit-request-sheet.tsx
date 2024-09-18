import { z } from "zod";

import { useGetBanks } from "@/features/banks/api/use-get-banks";
import { useCreateBank } from "@/features/banks/api/use-create-bank";

import { useGetPayModes } from "@/features/payModes/api/use-get-payModes";
import { useCreatePayMode } from "@/features/payModes/api/use-create-payMode";

import { useOpenRequest } from "@/features/requests/hooks/use-open-request";
import { RequestForm } from "@/features/requests/components/request-form";
import { useGetRequest } from "@/features/requests/api/use-get-request";
import { useEditRequest } from "@/features/requests/api/use-edit-request";
import { useDeleteRequest } from "@/features/requests/api/use-delete-request";

import { useConfirm } from "@/hooks/use-confirm";

import { Loader2 } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";


// Form validation 
const formSchema = z.object({
    name: z.string(),
    payment_date: z.coerce.date(),
    payment_mode: z.string(),
    bank: z.string(),
    amount: z.string(),
    //description: z.string().nullable().optional(),
});
type FormValues = z.input<typeof formSchema>;


export function EditRequestSheet() {
    const { isOpen, onClose, onOpen, id } = useOpenRequest();
    const [ConfirmationDialog, confirm] = useConfirm({
        title: "Are you sure?",
        message: "You are about to delete this request.",
    });

    const transactionQuery = useGetRequest(id);
    const editMutation = useEditRequest(id);
    const deleteMutation = useDeleteRequest(id);


    const payModeQuery = useGetPayModes();
    const payModeMutation = useCreatePayMode();
    const onCreatePayMode = (name: string) => payModeMutation.mutate({ name });
    const payModeOptions = (payModeQuery.data ?? []).map(
        (payMode: { name: any; _id: any; }) => ({
            label: payMode.name,
            value: payMode._id
        })
    );

    const bankQuery = useGetBanks();
    const bankMutation = useCreateBank();
    const onCreateBank = (name: string) => bankMutation.mutate({ name });
    const bankOptions = (bankQuery.data ?? []).map(
        (bank: { name: any; _id: any; }) => ({
            label: bank.name,
            value: bank._id
        })
    );

    const isPending =
         editMutation.isPending ||
         deleteMutation.isPending ||
         payModeMutation.isPending ||
         bankMutation.isPending 

    const isLoading =
        transactionQuery.isLoading ||
        bankQuery.isLoading ||
        payModeQuery.isLoading

    const defaultValues = transactionQuery.data
        ? {
            name: transactionQuery.data.name,
            amount: transactionQuery.data.amount.toString(),
            bank: transactionQuery.data.bank._id,
            payment_date: transactionQuery.data.payment_date
                ? new Date(transactionQuery.data.payment_date)
                : new Date(),
            
            payment_mode: transactionQuery.data.payment_mode._id,
            // categoryId: transactionQuery.data.categoryId,
            // notes: transactionQuery.data.notes,
        }
        : {
            name: "",
            amount: "",
            bank: "",
            payment_date: new Date(),
            payment_mode: "",
            // accountId: "",
            // categoryId: "",
            // notes:""
        };

    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, {
            onSuccess: () => {
                onClose();
            },
        });
    }
    const onDelete = async () => {
        const ok = await confirm();
        deleteMutation.mutate(undefined, {
            onSuccess: () => {
                onClose();
            },
        });
    }

    return (
        <>
            <ConfirmationDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="space-y-4" side="right_special">
                    <SheetHeader>
                        <SheetTitle>Edit Transaction</SheetTitle>
                        <SheetDescription>
                            Edit an existing transaction
                        </SheetDescription>
                    </SheetHeader>
                    {isLoading
                        ? (<div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="size-4 text-muted-foreground animate-spin" />
                        </div>)
                        : (
                            <RequestForm
                                id={id}
                                defaultValues={defaultValues}
                                onSubmit={onSubmit}
                                onDelete={onDelete}
                                disabled={isPending}
                                bankOptions={bankOptions}
                                onCreateBank={onCreateBank}
                                payModeOptions={payModeOptions}
                                onCreatePayMode={onCreatePayMode}

                            />
                        )
                    }

                </SheetContent>
            </Sheet>
        </>
    )
}
