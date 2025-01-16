import { z } from "zod";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useNewUser } from "../hooks/use-new-user";
import { useCreateUser } from "../api/use-create-user";
import { UserForm } from "./user-form";
import { formSchema } from "./user-schema";


/* Form validation */
type FormValues = z.input<typeof formSchema>;
/* Form validation */

export function NewUserSheet() {
    const { isOpen, onClose } = useNewUser();
    const mutation = useCreateUser();

    const onSubmit = (values: FormValues) => {
        mutation.mutate(values, {
            onSuccess: () => {
                onClose();
            },
        });
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4" side="right_special">
                <SheetHeader>
                    <SheetTitle>New User</SheetTitle>
                    <SheetDescription>
                        Create a new User to manage your internal credit transactions.
                    </SheetDescription>
                </SheetHeader>
                <UserForm
                    onSubmit={onSubmit}
                    disabled={mutation.isPending}
                    id={undefined}
                    defaultValues={{
                        name: '',
                        email: '',
                        ldap: true,
                        roleId: ["f0b4f5d1-5cee-42e5-8731-e6722635af24"],  // fe91303b-9577-4638-aa2a-fd1f8c22b28e is the id of role: USER FOR DEFAULT SELECT USER
                        password: '',
                        passwordConfirm: '',
                        unitId:''
                    }}
                    onAction={undefined}
                    onDelete={undefined}
                />
            </SheetContent>
        </Sheet>
    )
}
