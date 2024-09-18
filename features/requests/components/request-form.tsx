"use client"
import { Loader2, Trash } from 'lucide-react';

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from '@/components/ui/textarea';

import { Select } from "@/components/select"
import { DatePicker } from '@/components/date-picker';
import { AmountInput } from '@/components/amount-input';
import { convertAmountToMilliunits } from '@/lib/utils';



const formSchema = z.object({
    name: z.string(),
    payment_date: z.coerce.date(),
    payment_mode: z.string(),
    bank: z.string(),
    amount: z.string(),
    description: z.string().nullable().optional(),
    //evidence : z.instanceof(FileList).optional(),
});

// const apiSchema = insertTransactionsSchema.omit({
//     id: true,
//     createdBy: true,
//     createdAt: true,
//     updatedAt: true
// });
const apiSchema: any = {}  // TODO remove this line

type FormValues = z.input<typeof formSchema>;
type ApiFormValues = z.input<typeof apiSchema>;

type Props = {
    id?: string;
    defaultValues?: FormValues;
    onSubmit: (value: ApiFormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
    bankOptions: { label: string; value: string }[];
    payModeOptions: { label: string; value: string }[];
    onCreateBank: (name: string) => void;
    onCreatePayMode: (name: string) => void;
    editable?: boolean;
}

export const RequestForm = (
    {
        id,
        defaultValues,
        onSubmit,
        onDelete,
        disabled,
        bankOptions,
        payModeOptions,
        onCreateBank,
        onCreatePayMode,
        editable = true
    }: Props) => {

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    });

    const handleSubmit = (values: FormValues) => {
        const amount = parseFloat(values.amount);
        const amountInMilliunits = convertAmountToMilliunits(amount);
        // console.log(values);
        onSubmit({
            ...values,
            amount: amountInMilliunits
        });
    }

    const handleDelete = () => {
        console.log("delete");
        onDelete?.();
    }


    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="w-2/3 space-y-4 pt-4"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Customer fullname</FormLabel>
                            <FormControl>
                                <Input
                                    disabled={disabled}
                                    placeholder="Fullname"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                                <AmountInput
                                    {...field}
                                    disabled={disabled}
                                    placeholder="0.00"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


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
                                    disabled={disabled}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="payment_mode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Payment mode</FormLabel>
                            <FormControl>
                                <Select
                                    placeholder='Select a payment mode'
                                    options={payModeOptions}
                                    onCreate={onCreatePayMode}
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={disabled}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bank"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bank</FormLabel>
                            <FormControl>
                                <Select
                                    placeholder='Select a bank'
                                    options={bankOptions}
                                    onCreate={onCreateBank}
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={disabled}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Proof of payment</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    value={field.value ?? ""}
                                    disabled={disabled}
                                    placeholder="Optional notes"

                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {
                    editable && (
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={disabled}
                        >
                            {disabled ? (<><Loader2 className='animate-spin size-4 mr-2' /> Loading</>) : id ? "Save changes" : "Create transaction"}
                        </Button>
                    )
                }

                {
                    !!id && editable && (<Button
                        type="button"
                        className="w-full"
                        variant="outline"
                        onClick={handleDelete}
                        disabled={disabled}
                    >
                        <Trash className='size-4 mr-2' />
                        Delete transaction
                    </Button>)
                }
            </form>
        </Form>
    )
}
