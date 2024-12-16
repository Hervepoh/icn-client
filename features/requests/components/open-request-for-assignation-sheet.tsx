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
// import { useGetCommercialUsers } from "@/features/users/api/use-get-commercial-users";
// import { useGetSegments } from "@/features/segments/api/use-get-segments";
import { useGetRegions } from "@/features/regions/api/use-get-regions";
import { useGetUnits } from "@/features/unit/api/use-get-units";
import { useGetRequest } from "@/features/requests/api/use-get-request";
import { useEditRequest } from "@/features/requests/api/use-edit-request";
import { useOpenRequestAssignation } from "@/features/requests/hooks/use-open-request-for-assignation";
import { RequestFormForAssignation } from "@/features/requests/components/request-form-for-assignation";
import { status } from "@/config/status.config";


export function OpenRequestForAssignationSheet() {
    const { isOpen, onClose, id } = useOpenRequestAssignation();
    const [ConfirmationDialog, confirm] = useConfirm({
        title: "Are you sure?",
        message: "You are about to assign this transaction to a region/unit. Are you sure you want to perform this action?",
    });

    const regionsQuery = useGetRegions();
    const regionOptions = (regionsQuery.data ?? []).map(
        (item: { name: any; id: any; }) => ({
            label: item.name,
            value: item.id
        })
    );

    const unitsQuery = useGetUnits();
    const unitOptions = (unitsQuery.data ?? []).map(
        (item: { name: any; id: any; regionId: any; }) => ({
            label: item.name,
            value: item.id,
            regionId: item.regionId
        })
    );

    // const usersQuery = useGetCommercialUsers();
    // const usersOptions = (usersQuery.data ?? []).map(
    //     (item: { name: any; id: any; }) => ({
    //         label: item.name,
    //         value: item.id
    //     })
    // );
    const transactionQuery = useGetRequest(id);
    const editMutation = useEditRequest(id);

    const isPending = editMutation.isPending;
    const isLoading = transactionQuery.isLoading
        // || usersQuery.isLoading
        || regionsQuery.isLoading
        ;

    const defaultValues = transactionQuery.data
        ? {
            name: transactionQuery.data.name,
            amount: transactionQuery.data.amount?.toString(),
            bank: transactionQuery.data.bank?.name,
            payment_date: transactionQuery.data.paymentDate
                ? new Date(transactionQuery.data.paymentDate)
                : new Date(),
            payment_mode: transactionQuery.data.paymentMode?.name,
        }
        : {
            name: "",
            amount: "",
            bank: "",
            payment_date: new Date(),
            payment_mode: "",
        };

    const onAssign = async (value: { regionId: string; unitId?: string }) => {
        const ok = await confirm();
        if (ok) {
            editMutation.mutate({
                userId: "",
                regionId: value.regionId,
                unitId: value.unitId,
                status: status[5]
            }, {
                onSuccess: () => {
                    onClose();
                },
            });
        }
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
                            Assign an existing transaction to a Key Account Manager
                        </SheetDescription>
                    </SheetHeader>
                    {isLoading
                        ? (<div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="size-4 text-muted-foreground animate-spin" />
                        </div>)
                        : (
                            <RequestFormForAssignation
                                id={id}
                                defaultValues={defaultValues}
                                unitOptions={unitOptions}
                                regionOptions={regionOptions}
                                onAssign={onAssign}
                                disabled={isPending}
                            />
                        )
                    }

                </SheetContent>
            </Sheet>
        </>
    )
}
