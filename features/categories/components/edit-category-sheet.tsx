import { z } from "zod";
import { Loader2 } from "lucide-react";

import { useOpenCategory } from "@/features/categories/hooks/use-open-category";
import { CategoryForm } from "@/features/categories/components/category-form";
import { useGetCategory } from "@/features/categories/api/use-get-category";
import { useUpdateCategory } from "@/features/categories/api/use-edit-category";
import { useDeleteCategory } from "@/features/categories/api/use-delete-category";

import { useConfirm } from "@/hooks/use-confirm";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";


/* Form validation */
const formSchema = z.object({
    name: z.string(),
});
type FormValues = z.input<typeof formSchema>;
/* Form validation */


export function EditCategorySheet() {
    const { isOpen, onClose, onOpen, id } = useOpenCategory();
    const [ConfirmationDialog, confirm] = useConfirm({
        title: "Are you sure?",
        message: "You are about to delete this category",
    });

    const categoryQuery = useGetCategory(id);
    const editMutation = useUpdateCategory(id);
    const deleteMutation = useDeleteCategory(id);

    const isPending = editMutation.isPending
        || deleteMutation.isPending;
    const isLoading = categoryQuery.isLoading;

    const defaultValues = categoryQuery.data
        ? { name: categoryQuery.data?.name }
        : { name: "" };

    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, {
            onSuccess: () => {
                onClose();
            },
        });
    }
    const onDelete = async () => {
        const ok = await confirm();
        deleteMutation.mutate(undefined, {
            onSuccess: () => {
                onClose();
            },
        });
    }
    return (
        <>
            <ConfirmationDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="space-y-4" side="right_special">
                    <SheetHeader>
                        <SheetTitle>Edit Category</SheetTitle>
                        <SheetDescription>
                            Edit an existing category
                        </SheetDescription>
                    </SheetHeader>
                    {isLoading
                        ? (<div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="size-4 text-muted-foreground animate-spin" />
                        </div>)
                        : (
                            <CategoryForm
                                onSubmit={onSubmit}
                                disabled={isPending}
                                id={id}
                                defaultValues={defaultValues}
                                onDelete={onDelete}
                            />
                        )
                    }

                </SheetContent>
            </Sheet>
        </>
    )
}
