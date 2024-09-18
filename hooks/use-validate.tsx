import { useState } from "react";
import { format } from "date-fns";
import { Loader2, ThumbsDown, ThumbsUp } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { useGetRequest } from "@/features/requests/api/use-get-request";
import { useRejectRequest } from "@/features/requests/hooks/use-reject-request";
import { useValidateRequest } from "@/features/requests/hooks/use-validate-request";

type Props = {
    id: string;
    title: string;
    message: string;
};

export const useValidate = ({
    id,
    title,
    message
}: Props): [() => JSX.Element, () => Promise<unknown>] => {
    
    const request = useValidateRequest();  // Zustant Store data
    const reject = useRejectRequest();   // Zustant Store data

    const [promise, setPromise] = useState<{
        resolve: (value: boolean) => void;
        reject: (reason?: any) => void;
    } | null>(null);

    const valid = () => new Promise((resolve, reject) => {
        setPromise({ resolve, reject });
    });

    const handleClose = () => {
        setPromise(null);
        request.onClose();
    };

    const handleConfirm = () => {
        promise?.resolve(true);
        handleClose();
    };

    const transactionQuery = useGetRequest(id);
    const isLoading = transactionQuery.isLoading;

    const ValidationDialog = () => (
        <Sheet open={request.isOpen} onOpenChange={request.onClose}>
            <SheetTrigger asChild>Open</SheetTrigger >
            <SheetContent className="space-y-4" side={"bottom"}>
                <SheetHeader>
                    <SheetTitle className="text-center">{title}</SheetTitle>
                    <SheetDescription className="text-center">
                        {message}
                    </SheetDescription>
                </SheetHeader>
                {isLoading ?
                    (<Loading />)
                    : (
                        <>
                            <div className="border-b lg:flex gap-5 m-5 items-center justify-center pb-4 mb-5">
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <p className="text-gray-500 font-medium">Noms & Prénoms du client</p>
                                        <p className="font-medium">{transactionQuery.data.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 font-medium">Montant</p>
                                        <p className="font-medium">{transactionQuery.data.amount}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 font-medium">Date de paiement</p>
                                        <p className="font-medium">{format(transactionQuery.data.payment_date, "dd/MM/yyyy")}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 font-medium">Mode de paiement</p>
                                        <p className="font-medium">{transactionQuery.data.payment_mode.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 font-medium">Banque</p>
                                        <p className="font-medium">{transactionQuery.data.bank.name}</p>
                                    </div>
                                    <div className="mb-5">
                                        <p className="text-gray-500 font-medium">Proof of payment</p>
                                        <p className="font-medium">...</p>
                                    </div>

                                </div>
                                <div className="grid grid-cols-2 gap-5 align-top">

                                </div>

                            </div>
                            <div className="flex flex-col-reverse items-center mt-5 p-6 pt-0 justify-between gap-5">
                                <div className="flex gap-5">
                                    <Button
                                        variant="destructive"
                                        onClick={ () => reject.onOpen(id) }
                                        className="mr-4"><ThumbsDown className="mr-2 h-4 w-4" /> Rejet ICN
                                    </Button>

                                    <Button
                                        onClick={handleConfirm}
                                        variant="success"
                                    >
                                        Approve ICN <ThumbsUp className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    )

                }
            </SheetContent>
        </Sheet>

    )

    return [ValidationDialog, valid];
};


export const Loading = () => {

    return (
        <Card className='border-none drop-shadow-sm'>
            <CardHeader className='flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between'>
                <Skeleton className='h-8 w-48' />
                <Skeleton className='h-8 lg:w-[120px] w-full' />
            </CardHeader>
            <CardContent>
                <div className='h-[350px] w-full flex items-center justify-center'>
                    <Loader2 className='size-6 text-slate-300 animate-spin' />
                </div>
            </CardContent>
        </Card>
    )
}

