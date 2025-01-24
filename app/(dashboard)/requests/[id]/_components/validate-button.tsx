import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { CircleCheckBig, CircleOff, Loader2 } from "lucide-react"
import { useState } from "react"

type Props = {
    message: string
    disable: boolean
    onSubmit: boolean
    handle: () => void
}

export function VerifierValidateButton({ message, disable, onSubmit, handle }: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false); // State to control dialog visibility

    // Function to close the dialog
    const handleClose = () => {
        setIsDialogOpen(false);
    };

    // Function to handle confirmation
    const handleConfirm = () => {
        handle(); // Call the parent handler
        handleClose(); // Close the dialog
    };

    // Function to handle cancellation
    const handleCancel = () => {
        handleClose(); // Close the dialog
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="success"
                    size="sm"
                    className='w-full lg:w-auto'
                >
                    <CircleCheckBig className='size-4 mr-2' />Validate
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                        {message}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        onClick={handleCancel}
                        variant="outline"
                        size="sm"
                        className='w-full'
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="success"
                        disabled={disable && onSubmit}
                        onClick={handleConfirm}
                        size="sm"
                        className='w-full'
                    >
                        {
                            disable ?
                                (<><Loader2 className='animate-spin size-4 mr-2' /> Loading</>) :
                                (<><CircleCheckBig className='size-4 mr-2' /> Confirm </>)
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
