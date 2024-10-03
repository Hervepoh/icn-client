"use client"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Loader2, ThumbsDown, ThumbsUp } from 'lucide-react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/date-picker';
import { AmountInput } from '@/components/amount-input';
import { status } from "@/config/status.config";


const vInput = {
    name: z.string(),
    amount: z.string(),
    bank: z.string(),
    payment_date: z.coerce.date(),
    payment_mode: z.string(),
}

const defaultSchema = z.object(vInput);
const formSchema = z.object({
   ...vInput,
    reasonForRefusal: z.string().min(1, "Reason of reject id required"),
    //evidence : z.instanceof(FileList).optional(),
});
const apiSchema: any = {}  

type DefaultValues = z.input<typeof defaultSchema>;
type FormValues = z.input<typeof formSchema>;
type ApiFormValues = z.input<typeof apiSchema>;

type Props = {
    id: string;
    defaultValues?: DefaultValues;
    onValidate: () => void;
    onReject: (value: ApiFormValues) => void;
    disabled?: boolean;
}

export const RequestFormForValidation = (
    {
        id,
        defaultValues,
        onValidate,
        onReject,
        disabled
    }: Props) => {

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    });

    const handleSubmit = (values: FormValues) => {
        onReject({
            status: status[4],
            reasonForRefusal: values.reasonForRefusal
        });
    }

    return (
        <Form {...form}>
            <div className="flex items-start justify-center min-h-screen space-x-4"> 
                <div className="w-2/3 gap-5 mt-10">
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-4 pt-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Customer fullname</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={true}
                                            placeholder="Fullname"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex gap-5'> 
                            <div className='flex-1'>
                                <FormField
                                    control={form.control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Amount</FormLabel>
                                            <FormControl>
                                                <AmountInput
                                                    {...field}
                                                    disabled={true}
                                                    placeholder="0.00"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='flex-1'>
                                <FormField
                                    control={form.control}
                                    name="payment_date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Payment date</FormLabel>
                                            <FormControl>
                                                <DatePicker
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    disabled={true}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className='flex gap-5'>
                            <div className='flex-1'>
                                <FormField
                                    control={form.control}
                                    name="payment_mode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Payment mode</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={true}
                                                    placeholder="Payment mode"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='flex-1'>
                                <FormField
                                    control={form.control}
                                    name="bank"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bank</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={true}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='mb-10'>
                            <FormField
                                control={form.control}
                                name="reasonForRefusal"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Reason of refusal</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Reason of reject."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>


                        <div className="py-10">
                            <div className='flex justify-center gap-5 mt-10'>
                                <Button
                                    type="submit"
                                    className="w-[200px]"
                                    variant="destructive"
                                    disabled={disabled}
                                >
                                    {disabled ?
                                        (<><Loader2 className='animate-spin size-4 mr-2' /> Loading</>) :
                                        (<><ThumbsDown className="mr-2 h-4 w-4" /> Rejet ICN</>)
                                    }
                                </Button>

                                <Button
                                    type="button"
                                    className="w-[200px]"
                                    variant="success"
                                    onClick={onValidate}
                                    disabled={disabled}
                                >
                                    {disabled ?
                                        (<><Loader2 className='animate-spin size-4 mr-2' /> Loading</>) :
                                        (<>Approve ICN <ThumbsUp className="ml-2 h-4 w-4" /></>)
                                    }
                                </Button>
                            </div>


                        </div>
                    </form>
                </div>

            </div>

        </Form>
    )
}
