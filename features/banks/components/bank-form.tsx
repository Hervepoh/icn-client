"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
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
import { Loader2, Trash } from 'lucide-react';


// const formSchema = insertCategoriesSchema.pick({
const formSchema = z.object({
    name: z.string(),
});
type FormValues = z.input<typeof formSchema>;

type Props = {
    id?: string;
    defaultValues?: FormValues;
    onSubmit: (value: FormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
}

export const BankForm = ({
    id,
    defaultValues,
    onSubmit,
    onDelete,
    disabled
}: Props) => {

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    });

    const handleSubmit = (values: FormValues) => {
        //console.log(values);
        onSubmit(values);
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
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    disabled={disabled}
                                    placeholder="E.g. Food , Travel , etc."
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                This is your bank display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    className="w-full"
                    disabled={disabled}
                >
                    {disabled ? (<><Loader2 className='animate-spin size-4 mr-2' /> Loading</>) : id ?  "Save changes" : "Create Bank"}
                </Button>
                {
                    !!id && (<Button
                        type="button"
                        className="w-full"
                        variant="outline"
                        onClick={handleDelete}
                        disabled={disabled}
                    >
                        <Trash className='size-4 mr-2' />
                        Delete bank
                    </Button>)
                }
            </form>
        </Form>
    )
}
