"use client"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Loader2 } from 'lucide-react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Select } from "@/components/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DatePicker } from '@/components/date-picker';
import { AmountInput } from '@/components/amount-input';
import { MdPeople } from "react-icons/md";


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
    aassignTo: z.string().min(1, "You need to select a key account manager"),
    //evidence : z.instanceof(FileList).optional(),
});
const apiSchema: any = {}

type DefaultValues = z.input<typeof defaultSchema>;
type FormValues = z.input<typeof formSchema>;
type ApiFormValues = z.input<typeof apiSchema>;

type Props = {
    id: string;
    defaultValues?: DefaultValues;
    onAssign: (value:any) => void;
    usersOptions: { label: string; value: string }[];
    disabled?: boolean;
}

export const RequestFormForAssignation = (
    {
        id,
        defaultValues,
        onAssign,
        usersOptions,
        disabled
    }: Props) => {

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    });

    const handleSubmit = (values: FormValues) => {
         onAssign({userId:values.aassignTo});
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
                                name="aassignTo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Key Account Manager</FormLabel>
                                        <FormControl>
                                            <Select
                                                placeholder='Select a key account manager'
                                                options={usersOptions}
                                                value={field.value}
                                                onChange={field.onChange}
                                                disabled={disabled}
                                                onCreate={() => ''}
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
                                    disabled={disabled}
                                >
                                    {disabled ?
                                        (<><Loader2 className='animate-spin size-4 mr-2' /> Loading</>) :
                                        (<><MdPeople className="mr-2 h-4 w-4" /> ASSIGN</>)
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