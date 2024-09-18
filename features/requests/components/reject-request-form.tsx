"use client"
import { z } from "zod"
import { Loader2 } from 'lucide-react';
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
import { Button } from "@/components/ui/button"
import { Textarea } from '@/components/ui/textarea';

import { status } from '@/config/status.config';
import { RejectSchema } from '@/schemas';


const apiSchema: any = {}  // TODO remove this line

type FormValues = z.input<typeof RejectSchema>;
type ApiFormValues = z.input<typeof apiSchema>;

type Props = {
    id?: string;
    defaultValues?: FormValues;
    onSubmit: (value: ApiFormValues) => void;
    disabled?: boolean;
}

export const RejectRequestForm = (
    {
        id,
        defaultValues,
        onSubmit,
        disabled,
    }: Props) => {

    const form = useForm<FormValues>({
        resolver: zodResolver(RejectSchema),
        defaultValues: defaultValues,
    });

    const handleSubmit = (values: FormValues) => {
        onSubmit({
            ...values,
            status: status[4] //rejected status
        });
    }


    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="w-2/3 space-y-4 pt-4"
            >

                <FormField
                    control={form.control}
                    name="reason_for_refusal"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Reason of refusal</FormLabel>
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
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={disabled}
                    >
                        {disabled ? (<><Loader2 className='animate-spin size-4 mr-2' /> Loading</>) : id ? "Save changes" : "Create transaction"}
                    </Button>

                }
            </form>
        </Form>
    )
}
