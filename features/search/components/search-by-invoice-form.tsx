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
import { NEXT_PUBLIC_SERVER_URI } from '@/secret';
import Cookies from 'js-cookie';


const formSchema = z.object({
    value: z.string(),
});

type FormValues = z.input<typeof formSchema>;

type Props = {
    label: string
    placeholder?: string
    setIsFirstView: (value: boolean) => void;
    setInvoices: (value: any) => void;
    setError: (value: string) => void;
    setIsPending: (value: boolean) => void;
    setViewRecap: (value: boolean) => void;
}

export const SearchByInvoiceForm = ({
    label,
    placeholder,
    setIsFirstView,
    setInvoices,
    setError,
    setIsPending,
    setViewRecap
}: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {},
    });

    const handleSubmit = (values: FormValues) => {
   

        startTransition(async () => {
            setIsLoading(true);
            setIsPending(true);

            // const config: AxiosRequestConfig = {
            //     method: 'get',
            //     maxBodyLength: Infinity,
            //     url: `${NEXT_PUBLIC_SERVER_URI}/search-unpaid?by=invoice&value=${values.value}`,
            //     headers: { 'Authorization': Cookies.get('access_token') },
            //     withCredentials: true, // Set this to true
            //     data: ''
            // };
            try {
                // const response = await axios.request(config);
                const response = await axios.post('/api/search' ,{ enpoint: '/search-by-invoice', values: values , accessToken : Cookies.get('access_token')});

                setInvoices(response.data.bills ?? []);
                setIsLoading(false);
                setIsPending(false);
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

        });

        setIsFirstView(false);
        setViewRecap(false);
    }

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
                                    disabled={isLoading}
                                    placeholder={placeholder}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                >
                    {isLoading ? (<><Loader2 className='animate-spin size-4 mr-2' /> Loading</>) : "Search"}
                </Button>

            </form>
        </Form>
    )
}
