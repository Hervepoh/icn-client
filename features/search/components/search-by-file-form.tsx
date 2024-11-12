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
import { toast, Toaster } from 'sonner';
import Cookies from 'js-cookie';


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
    reference: string
}

export const SearchByFileForm = ({
    label,
    placeholder,
    setIsFirstView,
    setInvoices,
    setError, setIsPending, setViewRecap,
    reference,
}: Props) => {

    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, reset } = useForm();
    const [excelData, setExcelData] = useState<ExcelData[]>([]);

    const validateNumaci = (bills: any[], expectedNumaci: string) => {
        const errors: string[] = [];
        bills.forEach((bill, index) => {
            if (bill.NUMACI != expectedNumaci) {
                errors.push(`Error: Bill at index ${index} has an invalid NUMACI: ${bill.NUMACI}. Expected: ${expectedNumaci}.`);
            }
        });
        return errors;
    };

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

                const jsonData = XLSX.utils.sheet_to_json<ExcelData>(worksheet);

                // Validation
                const validationErrors = validateNumaci(jsonData, reference);

               // Displaying Errors
                if (validationErrors.length > 0) {
                    validationErrors.forEach(error => {
                        toast.error(error); 
                    });
                   
                } else {
                    startTransition(async () => {
                        setIsLoading(true);
    
                        const invoices = await Promise.all(jsonData.map(async (invoice) => {
                            const response = await axios.post('/api/search', { enpoint: '/search-paid-or-unpaid-by-invoice', values: invoice.PK_BILL_GENERATED_ID, accessToken: Cookies.get('access_token') });
                            const goodData = response.data.bills ?? [];
                            const result = [
                                goodData.length > 0 ? goodData[0][0] : "",
                                invoice.ID,
                                invoice.PK_BILL_GENERATED_ID,
                                goodData.length > 0 ? goodData[0][3] : "",
                                goodData.length > 0 ? goodData[0][4] : "",
                                goodData.length > 0 ? goodData[0][5] : 0,
                                invoice.DUE_AMT,
                                goodData.length > 0 ? (invoice.ID !== goodData[0][1] ? "Inconsistency key contract-invoice" : "") : "Invoice not exist"
                            ]
    
                            return result;
                        }));
    
                        setInvoices(invoices);
    
                        setIsLoading(false);
                        setIsPending(false);
                    });
                }

        
            } else {
                toast.error("Headers are in a wrong format , please use the template")
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
                    <Label>Upload a file</Label>
                    <Input
                    className='mt-2'
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
                    {disabled ? (<><Loader2 className='animate-spin size-4 mr-2' /> Loading</>) : "Add to ACI invoices list"}
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
