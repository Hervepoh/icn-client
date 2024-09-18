import { z } from "zod"
import { Loader2 } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

import { RejectRequestForm } from "@/features/requests/components/reject-request-form";
import { useRejectRequest } from "@/features/requests/hooks/use-reject-request";
import { useValidateRequest } from "@/features/requests/hooks/use-validate-request";
import { useGetRequest } from "@/features/requests/api/use-get-request";
import { useEditRequest } from "@/features/requests/api/use-edit-request";

import { RejectSchema } from "@/schemas";


type FormValues = z.input<typeof RejectSchema>;


export function RejectRequestSheet() {
    const { isOpen, onClose, onOpen, id } = useRejectRequest();
    const request = useValidateRequest();  

    const transactionQuery = useGetRequest(id);
    const editMutation = useEditRequest(id);

    const isPending = editMutation.isPending
    const isLoading = transactionQuery.isLoading

    const onSubmit = (values: FormValues) => {
        console.log("RejectRequestSheet",values)
        editMutation.mutate(values, {
            onSuccess: () => {
                onClose();
                request.onClose();
            },
        });
    }

    return (
        <>
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="space-y-4" side="bottom">
                    <SheetHeader>
                        <SheetTitle>Reject this Application</SheetTitle>
                        <SheetDescription>
                            Reason of reject. Click save when you re done.
                        </SheetDescription>
                    </SheetHeader>
                    {isLoading
                        ? (<div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="size-4 text-muted-foreground animate-spin" />
                        </div>)
                        : (
                            <RejectRequestForm
                                id={id}
                                defaultValues={{reason_for_refusal: ""}}
                                onSubmit={onSubmit}
                                disabled={isPending}
                            />
                        )
                    }

                </SheetContent>
            </Sheet>
        </>
    )
}
