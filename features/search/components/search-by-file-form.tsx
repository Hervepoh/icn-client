"use client"

import * as z from 'zod';
import { useForm } from "react-hook-form"
import { Loader2 } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';


const expectedHeaderSchema = z.array(z.string()).refine(
    (headers) =>
        headers.length === 4 &&
        headers[0] === 'NUMACI' &&
        headers[1] === 'ID' &&
        headers[2] === 'PK_BILL_GENERATED_ID' &&
        headers[3] === 'DUE_AMT',
    'Invalid file header. Expected: NUMACI, ID, PK_BILL_GENERATED_ID, DUE_AMT'
);

const excelSchema = z.object({
    NUMACI: z.string(),
    ID: z.number(),
    PK_BILL_GENERATED_ID: z.number(),
    DUE_AMT: z.number(),
});

type ExcelData = z.infer<typeof excelSchema>;

const fileExtensionSchema = z.string().refine(
    (value) => {
        const extension = value.split('.').pop();
        return extension === 'xlsx' || extension === 'csv';
    },
    'Invalid file type. Please upload an Excel or CSV file.'
);


type Props = {
    label: string
    placeholder?: string
    setIsFirstView: (value: boolean) => void;
    setInvoices: (value: any) => void;
    setError: (value: string) => void;
    setIsPending: (value: boolean) => void;
    setViewRecap: (value: boolean) => void;
}

export const SearchByFileForm = ({
    label,
    placeholder,
    setIsFirstView,
    setInvoices,
    setError, setIsPending, setViewRecap }: Props) => {

    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, reset } = useForm();
    const [excelData, setExcelData] = useState<ExcelData[]>([]);

    const onSubmit = (data: any) => {
        setIsFirstView(false);
        setViewRecap(false);
        const file = data.file[0];

        fileExtensionSchema.parse(file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
            const workbook = XLSX.read(e.target?.result, { type: 'binary' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];

            const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            const headers: any = rows[0];
            const GoodHeaderFormat = [
                "NUMACI",
                "ID",
                "PK_BILL_GENERATED_ID",
                "DUE_AMT"
            ];

            if (GoodHeaderFormat.length === headers?.length
                && headers.every((val: string, index: number) => val === GoodHeaderFormat[index])) {

                console.log("Les en-têtes sont au bon format.");

                const jsonData = XLSX.utils.sheet_to_json<ExcelData>(worksheet);
                const invoices = jsonData.map((data) => {
                       return  [
                        null,
                        data.ID,
                        data.PK_BILL_GENERATED_ID,
                        "DONGMO SABINE", // TODO fetch by invoice to get customer name
                        "25/06/2010", // TODO fetch by invoice to get invoice date
                        data.DUE_AMT
                    ]     
                });
                console.log("invoices",invoices)
          
                setInvoices(invoices);
                startTransition(async () => {
                    setIsLoading(true);
                    setIsPending(true);
                 
                 
                    // jsonData.map(async (data) => {
                    //     const newData = {
                    //         reference : data.NUMACI,
                    //         contract : data.ID,
                    //         invoice : data.PK_BILL_GENERATED_ID,
                    //         amount : data.DUE_AMT,
                    //     }
                    //     const config: AxiosRequestConfig = {
                    //         method: 'get',
                    //         maxBodyLength: Infinity,
                    //         url: `http://localhost:8000/api/v1/search-unpaid?by=invoice&value=${newData.invoice}`,
                    //         headers: {},
                    //         withCredentials: true, // Set this to true
                    //         data: ''
                    //     };
                   
                    //     try {
                    //         const response = await axios.request(config);
                    //         if (response.data?.bills) {
                                
                    //         }
                    //     } catch (error) {
                    //         setError("something went wrong");
                    //         setIsLoading(false);
                    //         setIsPending(false);
                    //         if (axios.isAxiosError(error)) {
                    //             throw error;
                    //         } else {
                    //             throw new Error('Une erreur inconnue s\'est produite');
                    //         }
                    //     }
                    // })
                    

                    setIsLoading(false);
                    setIsPending(false);
                 });
            } else {
                console.log("Les en-têtes ne sont pas au bon format.");
            }

            reset();
        };
        reader.readAsBinaryString(file);

        
    }

    const disabled = isLoading;
    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='mb-4'>
                    <Label>Upload dans le panier</Label>
                    <Input
                        type="file"
                        accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                        {...register('file', { required: true })}
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full mt-4"
                    disabled={disabled}
                >
                    {disabled ? (<><Loader2 className='animate-spin size-4 mr-2' /> Loading</>) : "Add to ACI shopping list"}
                </Button>
            </form>

            {excelData.length > 0 && (
                <div>
                    <h2>Validated Excel Data:</h2>
                    <pre>{JSON.stringify(excelData, null, 2)}</pre>
                </div>
            )}
        </div>
    )
}
