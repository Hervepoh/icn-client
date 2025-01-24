import { useState } from "react";
import { z } from "zod";
import { formatDate } from "date-fns";
import { Loader2 } from "lucide-react";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

import { useNewRequest } from "@/features/requests/hooks/use-new-request";
import { useCreateRequest } from "@/features/requests/api/use-create-request";
import { RequestForm } from "@/features/requests/components/request-form";

import { useCreateBank } from "@/features/banks/api/use-create-bank";
import { useGetBanks } from "@/features/banks/api/use-get-banks";
import { useGetBranches } from "@/features/bankAgencies/api/use-get-branchs";

import { useCreatePayMode } from "@/features/payModes/api/use-create-payMode";
import { useGetPayModes } from "@/features/payModes/api/use-get-payModes";

import { unicity } from "@/lib/qa";
import { useConfirm } from "@/hooks/use-confirm";


// Define the form schema (currently set to any for flexibility)
const formSchema: any = {}

// Type for form values based on schema
type FormValues = z.input<typeof formSchema>;


export function NewRequestSheet() {
    // Custom hook for managing the new request sheet state
    const { isOpen, onClose } = useNewRequest();

    // State to capture message comming from the server 
    const [message, setMessage] = useState("");

    // Hook to handle confirmation dialogs with a specific title and message
    const [ConfirmationDialog, confirm] = useConfirm({
        title: "Are you sure?",
        message: `You are about to record a transaction that matches an existing entry in our system.
     ${message} . Please confirm if you wish to proceed with this action, as it may result in duplicate records.`,
    });

    // Mutation for creating a new request
    const mutation = useCreateRequest();

    // Fetch available payment modes
    const payModeQuery = useGetPayModes();

    // Function to handle the creation of a new payment mode
    const payModeMutation = useCreatePayMode();
    const onCreatePayMode = (name: string) => payModeMutation.mutate({ name });

    // Map fetched payment modes to options suitable for a select input
    const payModeOptions = (payModeQuery.data ?? []).map(
        (payMode: { name: any; id: any; }) => ({
            label: payMode.name,  // Display name for the payment mode
            value: payMode.id     // Corresponding value for the payment mode
        })
    );

    // Fetch available banks
    const bankQuery = useGetBanks();


    // Function to handle the creation of a new bank
    const bankMutation = useCreateBank();
    const onCreateBank = (name: string) => bankMutation.mutate({ name });

    // Map fetched banks to options suitable for a select input
    const bankOptions = (bankQuery.data ?? []).map(
        (bank: { name: any; id: any; }) => ({
            label: bank.name,  // Display name for the bank
            value: bank.id     // Corresponding value for the bank
        })
    );

    // Fetch available branche
    const branchQuery = useGetBranches();

    // Map fetched branches to options suitable for a select input, including associated bank ID
    const branchOptions = (branchQuery.data ?? []).map(
        (item: { name: any; id: any; bankId: any; }) => ({
            label: item.name,  // Display name for the branch
            value: item.id,    // Corresponding value for the branch
            bankId: item.bankId  // Associated bank ID for the branch
        })
    );

    // Check if any mutations are currently pending
    const isPending =
        mutation.isPending ||
        payModeMutation.isPending ||
        bankMutation.isPending

    // Check if any queries are currently loading
    const isLoading =
        bankQuery.isLoading ||
        payModeQuery.isLoading

    // Handle form submission
    const onSubmit = async (values: FormValues) => {
        // Prepare the data for submission by spreading the existing values 
        // and formatting the payment_date to "dd/MM/yyyy"
        const data = {
            ...values,
            payment_date: formatDate(values.payment_date, "dd/MM/yyyy")
        };

        // Perform QA on the data before submitting it to the server
        const QA = await unicity(data);

        // Function to handle data submission
        const submitData = (advice: boolean = false) => {
            const finaldata = { ...data , advice_duplication:advice }; // add advice warning snapshot
            mutation.mutate(finaldata, {
                onSuccess: onClose, // Close the sheet on successful submission
            });
        };

        if (QA.status) {
            submitData(); // Directly submit if QA passes
        } else {
            setMessage(QA.transactions); // Set QA message
    
            // Prompt for confirmation before proceeding
            const confirmed = await confirm();
            if (confirmed) {
                submitData(true); // Submit data if confirmed
            }
        }
    }


    return (
        <>
            {/* Confirmation dialog component for user prompts */}
            <ConfirmationDialog />

            {/* Sheet component that serves as a modal or side panel */}
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className=" sm:w-[540px] space-y-4" side="right_special">
                    <SheetHeader>
                        <SheetTitle>New ACI application</SheetTitle>
                        <SheetDescription>
                            Add a new request.
                        </SheetDescription>
                    </SheetHeader>
                    {/* Conditional rendering based on loading state */}
                    {
                        isLoading
                            ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Loader2 className="size-4 text-muted-foreground animate-spin" />
                                </div>
                            )
                            : (
                                // Render the request form when not loading
                                <RequestForm
                                    onSubmit={onSubmit}                // Handle form submission
                                    disabled={isPending}               // Disable form while pending
                                    payModeOptions={payModeOptions}    // Payment mode options
                                    onCreatePayMode={onCreatePayMode}  // Handler for creating payment modes
                                    bankOptions={bankOptions}          // Bank options
                                    onCreateBank={onCreateBank}        // Handler for creating banks
                                    branchOptions={branchOptions}      // Branch options
                                />
                            )
                    }

                </SheetContent>
            </Sheet>
        </>

    )
}
