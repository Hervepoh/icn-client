import { z } from "zod";
import { Loader2 } from "lucide-react";
import axios from 'axios';

import { useOpenBank } from "@/features/banks/hooks/use-open-bank";
import { BankForm } from "@/features/banks/components/bank-form";
import { useGetBank } from "@/features/banks/api/use-get-bank";
import { useUpdateBank } from "@/features/banks/api/use-edit-bank";
import { useDeleteBank } from "@/features/banks/api/use-delete-bank";

import { useConfirm } from "@/hooks/use-confirm";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";


/* Form validation */
const formSchema = z.object({
    name: z.string(),
});
type FormValues = z.input<typeof formSchema>;
/* Form validation */


export function EditBankSheet() {
    const { isOpen, onClose, onOpen, id } = useOpenBank();
    const [ConfirmationDialog, confirm] = useConfirm({
        title: "Are you sure?",
        message: "You are about to delete this bank",
    });

    const bankQuery = useGetBank(id);
    const editMutation = useUpdateBank(id);
    const deleteMutation = useDeleteBank(id);

    const isPending = editMutation.isPending
        || deleteMutation.isPending;
    const isLoading = bankQuery.isLoading;

    const defaultValues = bankQuery.data
        ? { name: bankQuery.data.name }
        : { name: "" };

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
                        <SheetTitle>Edit Bank</SheetTitle>
                        <SheetDescription>
                            Edit an existing bank
                        </SheetDescription>
                    </SheetHeader>
                    {isLoading
                        ? (<div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="size-4 text-muted-foreground animate-spin" />
                        </div>)
                        : (
                            <BankForm
                                onSubmit={onSubmit}
                                disabled={isPending}
                                id={id}
                                defaultValues={defaultValues}
                                onDelete={onDelete}
                            />
                        )
                    }

                </SheetContent>
            </Sheet>
        </>
    )
}
