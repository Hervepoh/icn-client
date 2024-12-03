import { useState } from "react";
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
import { Separator } from "@/components/ui/separator";

type Props = {
    title: string;
    message: string;
};

export const useAlert = ({
    title,
    message,
}: Props): [() => JSX.Element, () => Promise<unknown>] => {
    const [promise, setPromise] = useState<{
        resolve: (value: boolean) => void;
    } | null>(null);

    const confirm = () => new Promise((resolve, reject) => {
        setPromise({ resolve });
    });

    const handleClose = () => {
        setPromise(null);
    };

    const handleConfirm = () => {
        promise?.resolve(true);
        handleClose();
    };

    const handleCancel = () => {
        promise?.resolve(false);
        handleClose();
    };

    const ConfirmationDialog = () => (
        <Dialog open={promise !== null} >
            <DialogContent className="custom-dialog">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center text-destructive">
                        {title}
                    </DialogTitle>
                    <DialogDescription className="mt-2 text-lg text-center text-gray-800">
                        <div className="mt-5" />
                        <div
                            dangerouslySetInnerHTML={{ __html: message }}
                            className="message-container"
                        />
                        {/* {message} */}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="pt-4 flex justify-center">
                    <Button
                        onClick={handleCancel}
                        variant="destructive"
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )

    return [ConfirmationDialog, confirm];
};
