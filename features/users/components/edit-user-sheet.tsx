import { z } from "zod";
import { Loader2 } from "lucide-react";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useOpenUser } from "../hooks/use-open-user";
import { UserForm } from "./user-form";
import { useGetUser } from "../api/use-get-user";
import { useUpdateUser } from "../api/use-edit-user";

import { useConfirm } from "@/hooks/use-confirm";
import { useDisReactiveUser } from "../api/use-dis-reactivate-user";
import { formSchema } from "./user-schema";
import { useDeleteUser } from "../api/use-delete-user";


/* Form validation */
type FormValues = z.input<typeof formSchema>;
/* Form validation */

export function EditUserSheet() {
    const { isOpen, onClose, id } = useOpenUser();


    const UserQuery = useGetUser(id);
    const editMutation = useUpdateUser(id);
    const actionMutation = useDisReactiveUser(id);
    const deleteMutation = useDeleteUser(id);

    const isPending = editMutation.isPending
        || actionMutation.isPending
        || deleteMutation.isPending;

    const isLoading = UserQuery.isLoading;

    const defaultValues = UserQuery.data
        ? {
            name: UserQuery.data.name,
            email: UserQuery.data.email,
            unitId: UserQuery.data.unitId,
            ldap: UserQuery.data.ldap,
            password: UserQuery.data.password,
            passwordConfirm: UserQuery.data.password,
            roleId: UserQuery.data.roleId,
            deleted: UserQuery.data.deleted
        }
        : {
            name: "",
            email: "",
            unitId: "",
            ldap: true,
            password: "",
            passwordConfirm: "",
            roleId: [],
            deleted: false
        };

    const action = defaultValues.deleted ? "Deactivation" : "Reactivation";
    const [ConfirmationActionDialog, actionConfirm] = useConfirm({
        title: "Are you sure?",
        message: `You are about to ${action.toLowerCase()} this user. Are you sure you want to proceed?`,
    });

    const [ConfirmationDialog, confirm] = useConfirm({
        title: "Are you sure?",
        message: `You are about to delete this user.?`,
    });

    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, {
            onSuccess: () => {
                onClose();
            },
        });
    }

    const onAction = async () => {
        const ok = await actionConfirm();
        if (ok) {
            actionMutation.mutate(undefined, {
                onSuccess: () => {
                    onClose();
                },
            });
        }
    }

    const onDelete = async () => {
        const ok = await confirm();
        if (ok) {
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    onClose();
                },
            });
        }
    }

    return (
        <>
            <ConfirmationDialog />
            <ConfirmationActionDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="space-y-4" side="right_special">
                    <SheetHeader>
                        <SheetTitle>Edit User</SheetTitle>
                        <SheetDescription>
                            Edit an existing User
                        </SheetDescription>
                    </SheetHeader>
                    {isLoading
                        ? (<div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="size-4 text-muted-foreground animate-spin" />
                        </div>)
                        : (
                            <UserForm
                                onSubmit={onSubmit}
                                disabled={isPending}
                                id={id}
                                defaultValues={defaultValues}
                                onAction={onAction}
                                onDelete={onDelete}
                            />
                        )
                    }

                </SheetContent>
            </Sheet>
        </>
    )
}
