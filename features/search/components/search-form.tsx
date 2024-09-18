"use client"
import { Loader2 } from 'lucide-react';

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

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
import { DatePicker } from '@/components/date-picker';


const formSchema = z.object({
    value: z.string(),
    from: z.date(),
    to: z.date(),
});

const apiSchema: any = {}  // TODO remove this line

type FormValues = z.input<typeof formSchema>;
type ApiFormValues = z.input<typeof apiSchema>;

type Props = {
    key: string
    label: string
    placeholder?: string
}

export const SearchForm = ({ key,label,placeholder }: Props) => {
    //const { mutate, isPending, isError ,...data} = useGetUnpaid(key);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {},
    });

    const handleSubmit = (values: FormValues) => {
        const value = values.value
        const from = values.from
        const to = values.to
        console.log("ok search input");
        // mutate({ value , from , to }, {
        //     onSuccess: () => {
        //         // onClose();
        //         //window.location.reload();
        //     },
        // });
    }

    const disabled = false  //isPending;
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="w-2/3 space-y-4 pt-4"
            >

                <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{ label }</FormLabel>
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
                    name="from"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>From</FormLabel>
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
                    name="to"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>To</FormLabel>
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

                <Button
                    type="submit"
                    className="w-full"
                    disabled={disabled}
                >
                    {disabled ? (<><Loader2 className='animate-spin size-4 mr-2' /> Loading</>) : "Search"}
                </Button>

            </form>
        </Form>
    )
}
