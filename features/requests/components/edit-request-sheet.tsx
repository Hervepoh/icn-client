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

import { useGetBanks } from "@/features/banks/api/use-get-banks";
import { useCreateBank } from "@/features/banks/api/use-create-bank";

import { useGetBranches } from "@/features/bankAgencies/api/use-get-branchs";

import { useGetPayModes } from "@/features/payModes/api/use-get-payModes";
import { useCreatePayMode } from "@/features/payModes/api/use-create-payMode";

import { useOpenRequest } from "@/features/requests/hooks/use-open-request";
import { RequestForm } from "@/features/requests/components/request-form";
import { useGetRequest } from "@/features/requests/api/use-get-request";
import { useEditRequest } from "@/features/requests/api/use-edit-request";
import { useDeleteRequest } from "@/features/requests/api/use-delete-request";

import { useConfirm } from "@/hooks/use-confirm";
import { unicity } from "@/lib/qa";
import { useState } from "react";


// Define the validation schema for the form using zod 
const formSchema = z.object({
    name: z.string(),     // Name of the transaction (required)
    payment_date: z.coerce.date(),  // Payment date (converted to Date object)
    payment_mode: z.string(),       // Payment mode (required)
    bank: z.string(),                // Associated bank (required)
    amount: z.string(),              // Amount of the transaction (required)
    description: z.string().nullable().optional(),  // Description (optional, can be null)
});

// Type definition for the form values based on the schema
type FormValues = z.input<typeof formSchema>;


export function EditRequestSheet() {
    // Hook to manage the open/close state of the request modal
    const { isOpen, onClose, id } = useOpenRequest();
    
    // State to capture message comming from the server 
    const [message, setMessage] = useState("");

    // Hook to handle confirmation dialogs with a specific title and message
    const [ConfirmationDialog, confirm] = useConfirm({
        title: "Are you sure?",
        message,
    });

    // Fetch the transaction details using the request ID
    const transactionQuery = useGetRequest(id);

    // Mutation hook for editing the request, initialized with the request ID
    const editMutation = useEditRequest(id);

    // Mutation hook for deleting the request, initialized with the request ID
    const deleteMutation = useDeleteRequest(id);

    // Fetch available payment modes
    const payModeQuery = useGetPayModes();

    // Mutation hook for creating a new payment mode
    const payModeMutation = useCreatePayMode();

    // Function to handle the creation of a new payment mode
    const onCreatePayMode = (name: string) => payModeMutation.mutate({ name });

    // Map fetched payment modes to options suitable for a select input
    const payModeOptions = (payModeQuery.data ?? []).map(
        (payMode: { name: any; id: any; }) => ({
            label: payMode.name,  // Display name for the payment mode option
            value: payMode.id     // Corresponding value for the payment mode option
        })
    );

    // Fetch available banks
    const bankQuery = useGetBanks();

    // Mutation hook for creating a new bank
    const bankMutation = useCreateBank();

    // Function to handle the creation of a new bank
    const onCreateBank = (name: string) => bankMutation.mutate({ name });

    // Map fetched banks to options suitable for a select input
    const bankOptions = (bankQuery.data ?? []).map(
        (bank: { name: any; id: any; }) => ({
            label: bank.name,
            value: bank.id
        })
    );

    // Fetch available branches
    const branchQuery = useGetBranches();

    // Map fetched branches to options suitable for a select input, including associated bank ID
    const branchOptions = (branchQuery.data ?? []).map(
        (item: { name: any; id: any; bankId: any; }) => ({
            label: item.name,    // Display name for the branch
            value: item.id,      // Corresponding value for the branch
            bankId: item.bankId  // Associated bank ID for the branch
        })
    );


    // Determine if any mutations are currently pending
    const isPending =
        editMutation.isPending ||
        deleteMutation.isPending ||
        payModeMutation.isPending ||
        bankMutation.isPending

    // Determine if any queries are currently loading
    const isLoading =
        transactionQuery.isLoading ||
        bankQuery.isLoading ||
        payModeQuery.isLoading

    // Set default values for the form based on the transaction query data
    const defaultValues = transactionQuery.data
        ? {
            name: transactionQuery.data.name,         // Transaction name
            amount: transactionQuery.data.amount,     // Transaction amount
            bank: transactionQuery.data.bankId,       // Associated bank ID
            branch: transactionQuery.data.branchId,  // Associated branch ID
            payment_date: transactionQuery.data.paymentDate
                ? new Date(transactionQuery.data.paymentDate)
                : new Date(),   // Parse the payment date; if it exists, convert it to a Date object, otherwise use the current date

            payment_mode: transactionQuery.data.paymentModeId, // Payment mode ID
            description: transactionQuery.data.description, // Transaction description
        }
        : {
            // If no transaction data exists, provide empty/default valu
            name: "",      // Default name
            amount: "",    // Default amount
            bank: "",      // Default bank ID
            branch: "",    // Default branch ID
            payment_date: new Date(), // Default to the current date
            payment_mode: "",  // Default payment mode ID
            description: "",   // Default description
        };

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
            const finaldata = { ...data, advice_duplication: advice }; // add advice warning snapshot
            // Execute the mutation to edit the data
            editMutation.mutate(finaldata, {
                // Callback function to execute on successful mutation
                onSuccess: () => {
                    // Close the form or modal on success
                    onClose();
                },
            });
        };

        if (QA.status) {
            submitData(); // Directly submit if QA passes
        } else {
            setMessage(`You are about to record a transaction that matches an existing entry in our system.
     ${QA.transactions} . Please confirm if you wish to proceed with this action, as it may result in duplicate records.`); // Set QA message
    
            // Prompt for confirmation before proceeding
            const confirmed = await confirm();
            if (confirmed) {
                submitData(true); // Submit data if confirmed
            }
        }
    }

    const onDelete = async () => {
        // Set a confirmation message 
        setMessage("You are about to delete this request.");

        // Prompt the user for confirmation before proceeding with deletion
        const ok = await confirm();

        // Proceed with deletion only if the user confirmed
        if (ok) {
            // Execute the mutation to delete the data
            deleteMutation.mutate(undefined, {
                // Callback function to execute on successful deletion
                onSuccess: () => {
                    // Close the form or modal on success
                    onClose();
                },
            });
        }
    }

    return (
        <>
            {/* Confirmation dialog component for user prompts */}
            <ConfirmationDialog />

            {/* Sheet component that serves as a modal or side panel */}
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="space-y-4" side="right_special">
                    <SheetHeader>
                        {/* Title for the sheet */}
                        <SheetTitle>Edit Transaction</SheetTitle>

                        {/* Description of the sheet's purpose */}
                        <SheetDescription>
                            Edit an existing transaction
                        </SheetDescription>
                    </SheetHeader>

                    {/* Conditional rendering based on loading state */}
                    {isLoading
                        ? (
                            // Show a loader while data is being fetched or processed
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="size-4 text-muted-foreground animate-spin" />
                            </div>
                        )
                        : (
                            // Render the request form when not loading
                            <RequestForm
                                id={id}   // Unique identifier for the transaction
                                defaultValues={defaultValues} // Default values for the form fields
                                onSubmit={onSubmit} // Handler for form submission
                                onDelete={onDelete} // Handler for deletion of the transaction
                                disabled={isPending} // Disable form during pending operations
                                bankOptions={bankOptions} // Options for bank selection
                                onCreateBank={onCreateBank} // Handler for creating a new bank
                                payModeOptions={payModeOptions}  // Options for payment modes
                                onCreatePayMode={onCreatePayMode} // Handler for creating a new payment mode
                                branchOptions={branchOptions} // Options for branch selection

                            />
                        )
                    }

                </SheetContent>
            </Sheet>
        </>
    )
}
