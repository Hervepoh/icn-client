"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2, Shield, Trash, User, CheckCircle, Briefcase, DollarSign, PowerOff, Power } from 'lucide-react';

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
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

import { MultiSelect } from "@/components/multi-select"

import { useGetRoles } from "@/features/users/api/use-get-roles"
import { useGetUnits } from "@/features/unit/api/use-get-units"

import { formSchema } from "./user-schema"


// Define types based on the validation schema
type FormValues = z.input<typeof formSchema>;

type Props = {
    id?: string;
    defaultValues?: FormValues;
    onSubmit: (value: FormValues) => void;
    onAction?: () => void;
    onDelete?: () => void;
    disabled?: boolean;
}

export const UserForm = ({
    id,
    defaultValues,
    onSubmit,
    onAction,
    onDelete,
    disabled
}: Props) => {

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    });

    // Fetch units 
    const unitsQuery = useGetUnits();

    // Process unit options
    const unitOptions = (unitsQuery.data ?? []).map((item: { name: any; id: any; regionId: any }) => ({
        label: item.name,
        value: item.id,
        regionId: item.regionId
    }));

    // Define role icons 
    type RoleName = 'ADMIN' | 'VALIDATOR' | 'ASSIGNATOR' | 'MANAGER' | 'COMMERCIAL';
    const roleIcons: Record<RoleName, React.FC> = {
        ADMIN: Shield,
        VALIDATOR: CheckCircle,
        ASSIGNATOR: Briefcase,
        MANAGER: DollarSign,
        COMMERCIAL: User,
    };

    // Fetch roles
    const rolesQuery = useGetRoles();

    // Process roles options
    const rolesOptions = (rolesQuery.data ?? []).map((item: { name: string; id: string }) => {
        // Obtenir l'icône en fonction du nom du rôle, avec une valeur par défaut
        const icon = roleIcons[item.name.toUpperCase() as RoleName] || User; // Utiliser User comme icône par défaut
        return {
            label: item.name,
            value: item.id,
            icon: icon,
        };
    });

    // Handle form submission
    const handleSubmit = (values: FormValues) => {
        onSubmit(values);
    }

    // Handle actions
    const handleAction = () => {
        onAction?.();
    }

    // Handle deletion
    const handleDelete = () => {
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
                                    placeholder="E.g. Herve Ngando."
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    disabled={disabled}
                                    placeholder="herve.ngando@eneo.cm"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone number</FormLabel>
                            <FormControl>
                                <Input
                                    type="phone"
                                    disabled={disabled}
                                    placeholder="Phone number : +237 699312930"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="unitId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Unit Responsible</FormLabel>
                            <FormControl>
                                <Select
                                    placeholder='Select a unit'
                                    options={unitOptions}
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

                <FormField
                    control={form.control}
                    name="ldap"
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-3 px-4 py-2 border rounded-md shadow-sm">
                            <FormLabel className="flex-1">Authentication via LDAP</FormLabel>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={disabled}
                                    className="transition duration-200 ease-in-out"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="*********"
                                    disabled={disabled}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="passwordConfirm"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="*********"
                                    disabled={disabled}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="roleId" // Set the name to the correct field
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Select roles</FormLabel>
                            <FormControl>
                                <MultiSelect
                                    options={rolesOptions}
                                    onValueChange={field.onChange} // Use field.onChange
                                    defaultValue={field.value} // Use field.value for default selected
                                    placeholder="Select roles"
                                    variant="default"
                                    animation={2}
                                    maxCount={4}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="mt-4 w-2/3 space-y-4 pt-4">
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={disabled}
                    >
                        {disabled ? (<><Loader2 className='animate-spin size-4 mr-2' /> Loading</>) : id ? "Save changes" : "Create User"}
                    </Button>
                    {
                        !!id && (<Button
                            type="button"
                            className="w-full"
                            variant={defaultValues?.deleted ? "success" : "destructive"}
                            onClick={handleAction}
                            disabled={disabled}
                        >
                            {defaultValues?.deleted ? <Power className="mr-2 size-4" /> : <PowerOff className="mr-2 size-4" />}
                            {defaultValues?.deleted ? "Reactivation " : "Deactivation "} User
                        </Button>)

                    }
                    {
                        !!id && (<Button
                            type="button"
                            className="w-full"
                            variant="outline"
                            onClick={handleDelete}
                            disabled={disabled}
                        >
                            <Trash className='size-4 mr-2' />
                            Delete User
                        </Button>)

                    }
                </div>

            </form>
        </Form>
    )
}