import { useRef, useState } from "react";

import { useGetBanks } from "@/features/banks/api/use-get-banks";
import { useCreateBank } from "@/features/banks/api/use-create-bank";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/select";

export const useSelectBank = (): [() => JSX.Element, () => Promise<unknown>] => {
    
    const bankQuery = useGetBanks();
    const bankMutation = useCreateBank();
    const onCreateBank =  (name: string) => {
        bankMutation.mutate({ name })        
    }
    const bankOptions = (bankQuery.data ?? []).map(
        (bank: { name: any; _id: any; }) => ({
            label: bank.name,
            value: bank._id
        })
    );

    const [promise, setPromise] = useState<{
        resolve: (value: string | undefined ) => void;
    } | null>(null);

    const selectValue = useRef<string>();

    const confirm = () => new Promise((resolve, reject) => {
        setPromise({ resolve });
    });

    const handleClose = () => {
        setPromise(null);
    };

    const handleConfirm = () => {
        promise?.resolve(selectValue.current);
        handleClose();
    };

    const handleCancel = () => {
        promise?.resolve(undefined);
        handleClose();
    };

    const BankDialog = () => (
        <Dialog open={promise !== null}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Select Bank</DialogTitle>
                    <DialogDescription>
                        Please select a bank to continue
                    </DialogDescription>
                </DialogHeader>
                <Select 
                  onChange={(value) => selectValue.current = value}
                  onCreate={onCreateBank}
                  options={bankOptions}
                  disabled={bankQuery.isLoading || bankMutation.isPending}
                  placeholder="Select an bank"
                
                />
                <DialogFooter className="pt-2">
                    <Button
                        onClick={handleCancel}
                        variant="outline"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        variant="outline"
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )

    return [BankDialog, confirm];
};
