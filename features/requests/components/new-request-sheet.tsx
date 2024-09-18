import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useNewRequest } from "@/features/requests/hooks/use-new-request";
// import { useNewTransaction } from "@/features/transactions/hooks/use-new-request";
// import { useCreateTransaction } from "@/features/transactions/api/use-create-transaction";
import { RequestForm } from "@/features/requests/components/request-form";

import { useCreateBank } from "@/features/banks/api/use-create-bank";
import { useGetBanks } from "@/features/banks/api/use-get-banks";

import { useCreatePayMode } from "@/features/payModes/api/use-create-payMode";
import { useGetPayModes } from "@/features/payModes/api/use-get-payModes";

// import { insertTransactionsSchema } from "@/db/schema";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useCreateRequest } from "../api/use-create-request";
import { formatDate } from "date-fns";




/* Form validation */
// const formSchema = insertTransactionsSchema.omit({
//     id: true,
//     createdBy: true,
//     createdAt: true,
//     updatedAt: true
// });
const formSchema :any = {}
type FormValues = z.input<typeof formSchema>;
/* Form validation */


export function NewRequestSheet() {
    const { isOpen, onClose } = useNewRequest();

    const mutation = useCreateRequest();

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
        mutation.isPending ||
        payModeMutation.isPending ||
        bankMutation.isPending

    const isLoading =
        bankQuery.isLoading ||
        payModeQuery.isLoading

    const onSubmit = (values: FormValues) => {
        const datas = { ...values , payment_date: formatDate(values.payment_date, "dd/MM/yyyy") };

        mutation.mutate(datas, {
            onSuccess: () => {
                onClose();
            },
        });
    }


    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className=" sm:w-[540px] space-y-4" side="right_special">
                <SheetHeader>
                    <SheetTitle>New ACI application</SheetTitle>
                    <SheetDescription>
                        Add a new request.
                    </SheetDescription>
                </SheetHeader>
                {
                    isLoading
                        ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="size-4 text-muted-foreground animate-spin" />
                            </div>
                        )
                        : ( 
                            <RequestForm
                                onSubmit={onSubmit}
                                disabled={isPending}
                                payModeOptions={payModeOptions}
                                onCreatePayMode={onCreatePayMode}
                                bankOptions={bankOptions}
                                onCreateBank={onCreateBank}
                            />
                        )
                }

            </SheetContent>
        </Sheet>
    )
}
