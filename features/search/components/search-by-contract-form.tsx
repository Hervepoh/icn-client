"use client"
import { z } from "zod"
import axios from 'axios';
import Cookies from 'js-cookie';
import { Loader2 } from 'lucide-react';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { startTransition } from 'react';
import { toast } from 'sonner';

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
import { DatePicker } from '@/components/date-picker-full';

import { useLoadingStore } from '@/hooks/use-loading-store';


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
    setInvoices: (value: any) => void;
    setViewRecap: (value: boolean) => void;
    setNewProgress: (value: number) => void;
}

export const SearchByContractForm = ({
    key,
    label,
    placeholder,
    setInvoices,
    setViewRecap,
    setNewProgress
}: Props) => {

    const { loading, startLoading, stopLoading } = useLoadingStore();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {},
    });

    const timerEndLoading = ():void => {
        setNewProgress(100);
    }
    
    const handleSubmit = (values: FormValues) => {
        setInvoices([]);
        setNewProgress(0);
        startLoading();
        setViewRecap(false);

        startTransition(async () => {
            try {
                const response = await axios.post('/api/search', { enpoint: '/search-by-contract', values: values, accessToken: Cookies.get('access_token') });
                setInvoices(response.data.bills ?? []);
                setTimeout(timerEndLoading, 5000);
                if (response.data?.message) {
                    toast.error(response.data?.message)
                }
            } catch (error) {
                console.error("[SearchByContractForm]",error);// Handle errors from file reading or validation
            } finally {
                stopLoading();
            }
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
                    name="value"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{label}</FormLabel>
                            <FormControl>
                                <Input
                                    disabled={loading}
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
                                    disabled={loading}
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
                                    disabled={loading}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                >
                    {loading ? (<><Loader2 className='animate-spin size-4 mr-2' /> Loading</>) : "Search"}
                </Button>

            </form>
        </Form>
    )
}
