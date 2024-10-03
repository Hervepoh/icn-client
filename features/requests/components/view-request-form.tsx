"use client"

import React from 'react';
import { format } from "date-fns";
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from '@/components/ui/textarea';

import { Select } from "@/components/select"
import { DatePicker } from '@/components/date-picker';
import { AmountInput } from '@/components/amount-input';
import { Checkbox } from '@/components/ui/checkbox';

type Props = {
    id?: string;
    defaultValues: {
        userId: string;
        reference: string;
        name: string;
        bank: string;
        amount: string;
        paymentDate: Date;
        paymentMode: string;
        status: string;
        description: string;
        createdBy: string;
        createdAt: Date;
        validatedBy: string;
        validatedAt: string;
        refusal: boolean;
        reasonForRefusal: string;
    };
    disabled?: boolean;
    bankOptions: { label: string; value: string }[];
    payModeOptions: { label: string; value: string }[];
    userOptions: { label: string; value: string }[];
    statusOptions: { label: string; value: string }[];
}


export const ViewRequestForm = (
    {
        id,
        defaultValues,
        disabled,
        bankOptions,
        payModeOptions,
        userOptions,
        statusOptions,
    }: Props) => {

    const form = useForm({
        defaultValues: defaultValues,
    });
    return (
        <Form {...form}>
            <form className="w-2/3 space-y-4 pt-4"
            >
                <div className="flex gap-5">
                    <FormField
                        control={form.control}
                        name="reference"
                        render={({ field }) => (
                            <FormItem className='flex-1'>
                                <FormLabel>Reference</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} disabled={disabled} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem className='flex-1'>
                                <FormLabel>status</FormLabel>
                                <FormControl>
                                    <Select
                                        placeholder='Select a status'
                                        options={statusOptions}
                                        onCreate={() => ""}
                                        value={field.value}
                                        onChange={() => ""}
                                        disabled={disabled}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className='flex-1'>
                            <FormLabel>Customer fullname</FormLabel>
                            <FormControl>
                                <Input placeholder="shadcn" {...field} disabled={disabled} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-5">
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem className='flex-1'>
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                    <AmountInput placeholder="0.00" {...field} onChange={() => ""}
                                        disabled={disabled}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="paymentDate"
                        render={({ field }) => (
                            <FormItem className='flex-1'>
                                <FormLabel>Payment date</FormLabel>
                                <FormControl>
                                    <DatePicker
                                        value={defaultValues?.paymentDate ? new Date(defaultValues.paymentDate) : new Date()}
                                        disabled={disabled}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex gap-5">
                    <FormField
                        control={form.control}
                        name="bank"
                        render={({ field }) => (
                            <FormItem className='flex-1'>
                                <FormLabel>Bank</FormLabel>
                                <FormControl>
                                    <Select
                                        placeholder='Select a bank'
                                        options={bankOptions}
                                        onCreate={() => ""}
                                        value={field.value}
                                        onChange={() => ""}
                                        disabled={disabled}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="paymentMode"
                        render={({ field }) => (
                            <FormItem className='flex-1'>
                                <FormLabel>Payment Mode</FormLabel>
                                <FormControl>
                                    <Select
                                        placeholder='Select a payment mode'
                                        options={payModeOptions}
                                        onCreate={() => ""}
                                        value={field.value}
                                        onChange={() => ""}
                                        disabled={disabled}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    name="description"
                    render={() => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    value={defaultValues.description}
                                    disabled={disabled}
                                    placeholder="Description"

                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-5">
                    <FormField
                        control={form.control}
                        name="createdBy"
                        render={({ field }) => (
                            <FormItem className='flex-1'>
                                <FormLabel>Created By</FormLabel>
                                <FormControl>
                                    <Select
                                        placeholder='Select a user'
                                        options={userOptions}
                                        onCreate={() => ""}
                                        value={field.value}
                                        onChange={() => ""}
                                        disabled={disabled}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="createdAt"
                        render={({ field }) => (
                            <FormItem className='flex-1'>
                                <FormLabel>createdAt</FormLabel>
                                <FormControl>
                                    <Input value={defaultValues.createdAt ? format(defaultValues.createdAt, "dd/MM/yyyy HH:mm:ss") : ""} disabled={disabled} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex gap-5">
                    <FormField
                        control={form.control}
                        name="validatedBy"
                        render={({ field }) => (
                            <FormItem className='flex-1'>
                                <FormLabel>validate By</FormLabel>
                                <FormControl>
                                    <Select
                                        placeholder='Select a user'
                                        options={userOptions}
                                        onCreate={() => ""}
                                        value={field.value}
                                        onChange={() => ""}
                                        disabled={disabled}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="validatedAt"
                        render={({ field }) => (
                            <FormItem className='flex-1'>
                                <FormLabel>validatedAt</FormLabel>
                                <FormControl>
                                    <Input value={defaultValues.validatedAt ? format(defaultValues.validatedAt, "dd/MM/yyyy HH:mm:ss") : ""} disabled={disabled} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                </div>

                {defaultValues.refusal &&

                    <FormField
                        name="reasonForRefusal"
                        render={() => (
                            <FormItem>
                                <FormLabel>Refusal  <Checkbox
                                    checked={true}
                                    disabled /></FormLabel>
                                <FormControl>
                                    <Textarea
                                        value={defaultValues.reasonForRefusal}
                                        disabled={disabled}

                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                }

                {!defaultValues.refusal &&
                    <div className="flex gap-5">
                        <FormField
                            control={form.control}
                            name="userId"
                            render={({ field }) => (
                                <FormItem className='flex-1'>
                                    <FormLabel>Assign To</FormLabel>
                                    <FormControl>
                                        <Select
                                            placeholder='Select a user'
                                            options={userOptions}
                                            onCreate={() => ""}
                                            value={field.value}
                                            onChange={() => ""}
                                            disabled={disabled}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                }
            </form>
        </Form>
    )
}
