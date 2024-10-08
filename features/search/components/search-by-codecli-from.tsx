"use client"
import { Loader2 } from 'lucide-react';

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { startTransition, useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

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
import { format } from 'date-fns';
import { NEXT_PUBLIC_SERVER_URI } from '@/secret';
import Cookies from 'js-cookie';


const formSchema = z.object({
    value: z.string(),
    from: z.date(),
    to: z.date(),
});

type FormValues = z.input<typeof formSchema>;

type Props = {
    key: string
    label: string
    placeholder?: string
    setIsFirstView: (value: boolean) => void;
    setInvoices: (value: any) => void;
    setError: (value: string) => void;
    setIsPending: (value: boolean) => void;
    setViewRecap: (value: boolean) => void;
}

export const SearchByCodeCliForm = ({
    key,
    label,
    placeholder,
    setIsFirstView,
    setInvoices,
    setError, setIsPending , setViewRecap }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {},
    });

    const handleSubmit = (values: FormValues) => {
        setIsFirstView(false);

        startTransition(async () => {
            setIsLoading(true);
            setIsPending(true);

            try {
                const response = await axios.post('/api/search' ,{ enpoint: '/by-codecli', values: values , accessToken : Cookies.get('access_token')});
                setInvoices(response.data.bills  ?? []);
            } catch (error) {
                setError("something went wrong");
                setIsLoading(false);
                setIsPending(false);
                if (axios.isAxiosError(error)) {
                    throw error;
                } else {
                    throw new Error('Une erreur inconnue s\'est produite');
                }
            }
            setIsLoading(false);
            setIsPending(false);
        });
        
        setViewRecap(false);
    }

    const disabled = isLoading;
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
                            <FormLabel>{label}</FormLabel>
                            <FormControl>
                                <Input
                                    disabled={disabled}
                                    placeholder={placeholder}
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
