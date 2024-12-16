import { z } from "zod";
import { Loader2 } from "lucide-react";
import { formatDate } from "date-fns";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useBrouillard } from "../hooks/use-brouillard";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
    reference: z.string().min(1, "Reference is required"),
});

type FormValues = z.infer<typeof formSchema>;

export function BrouillardSheet() {
    const { isOpen, onClose } = useBrouillard();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: FormValues) => {
        setIsLoading(true);
        setErrorMessage(null);

        try {
            const response = await axios.get(`/api/requests/brouillard/${data.reference}`, {
                responseType: 'arraybuffer', // Assurer que nous obtenons les données binaires
            });

            // Vérifiez si la réponse est correcte
            if (response.status !== 200) {
                setErrorMessage("Failed to generate file");
                throw new Error('Failed to generate file');
            }

            // Extraire le nom du fichier depuis les en-têtes de réponse
            const contentDisposition = response.headers['content-disposition'];
            let filename = `BROUILLARD_ACI_NUMERO_${data.reference}.xlsx`; // Nom par défaut

            if (contentDisposition) {
                const matches = contentDisposition.match(/filename="?([^"]+)"?/);
                if (matches && matches[1]) {
                    filename = matches[1]; // Utiliser le nom de fichier extrait
                }
            }

            // Manipuler la réponse réussie (télécharger le fichier)
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename; // Utiliser le nom de fichier extrait
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url); // Libérer l'URL pour éviter les fuites de mémoire
        } catch (error: any) {
            setErrorMessage("Failed to generate file, Please try again later");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4" side="right_special2">
                <SheetHeader>
                    <SheetTitle className="text-center">Brouillard</SheetTitle>
                    <SheetDescription className="text-center">
                        Generation of ACI Brouillard
                    </SheetDescription>
                </SheetHeader>
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="size-4 text-muted-foreground animate-spin" />
                    </div>
                ) : (
                    <div className="flex items-start justify-center min-h-screen space-x-4">
                        <div className="gap-2 mt-10">
                            <form onSubmit={handleSubmit(onSubmit)} className="flex">
                                <div className="gap-2">
                                    <Input
                                        id="reference"
                                        {...register("reference")}
                                        className="col-span-4"
                                        placeholder="Reference"
                                    />
                                    {errors.reference && <span className="text-red-500 col-span-4">{errors.reference.message}</span>}
                                    {errorMessage && <div className="text-red-500">{errorMessage}</div>}
                                </div>
                                <div >
                                    <Button type="submit" className="btn btn-primary col-span-4">
                                        Generate Brouillard
                                    </Button>
                                </div>

                            </form>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}