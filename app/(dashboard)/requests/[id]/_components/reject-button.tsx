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
import { CircleOff, Loader2 } from "lucide-react"
import { useState } from "react"

type Props = {
    message: string
    disable: boolean
    onSubmit: boolean
    handle: (input: string) => void
}

export function VerifierRejectButton({ message, disable, onSubmit, handle }: Props) {
    const [reason, setReason] = useState("");

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="destructive"
                    size="sm"
                    className='w-full lg:w-auto'
                >
                    <CircleOff className='size-4 mr-2' />Reject
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Reason for refusal</DialogTitle>
                    <DialogDescription>
                        Provide a clear and concise explanation for the rejection.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="text-red-400 col-span-4">{message}</span>
                        <Textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} className="col-span-4" />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="destructive"
                        disabled={disable && onSubmit}
                        onClick={() => handle(reason)}
                        size="sm"
                        className='w-full'>
                        {
                            disable ?
                                (<><Loader2 className='animate-spin size-4 mr-2' /> Loading</>) :
                                (<><CircleOff className='size-4 mr-2' />Reject</>)
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
