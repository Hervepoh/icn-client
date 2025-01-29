"use client"

import * as XLSX from 'xlsx';
import * as z from 'zod';
import axios from 'axios';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { useForm } from "react-hook-form"
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from '@/components/ui/label';

import { useAlert } from '@/hooks/use-alert';
import { useLoadingStore } from '@/hooks/use-loading-store';


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
        return extension === 'xlsx'  || extension === 'xls' || extension === 'csv';
    },
    'Invalid file type. Please upload an Excel or CSV file.'
);


type Props = {
    label: string
    placeholder?: string
    setInvoices: (value: any) => void;
    setViewRecap: (value: boolean) => void;
    setNewProgress: (value: number) => void;
    reference: string
}

export const SearchByFileForm = ({
    label,
    placeholder,
    setInvoices,
    setViewRecap,
    setNewProgress,
    reference,
}: Props) => {
    useEffect(() => {
      setNewProgress(0);
    }, [])
    
    const [message, setMessage] = useState("");
    
    const { loading, startLoading, stopLoading } = useLoadingStore();
    const { register, handleSubmit, reset } = useForm();
    const [ConfirmationDialog, confirm] = useAlert({ title: "You can not process this action", message });

    const validateNumaci = (bills: any[], expectedNumaci: string) => {
        const errors: string[] = [];
        bills.forEach((bill, index) => {
            if (bill.NUMACI != expectedNumaci) {
                errors.push(`Error: Bill at index ${index} has an invalid NUMACI: ${bill.NUMACI}. Expected: ${expectedNumaci}.`);
            }
        });
        return errors;
    };

    const cleanJsonData = (obj: any) => {
        const nvlObj: { [key: string]: string | number } = {};
        for (const key in obj) {
            const nvlKey = key.trim();
            nvlObj[nvlKey] = (typeof obj[key] === 'string') ? obj[key].trim() : obj[key];
        }
        return nvlObj;
    }

    // const readFile = (file: File) => {
    //     return new Promise<any[]>((resolve, reject) => {
    //         const reader = new FileReader();
    //         reader.onload = (e) => {
               
    //             const workbook = XLSX.read(e.target?.result, { type: 'binary' });
    //             const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    //             const headers: any = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];

    //             const GoodHeaderFormat = ["NUMACI", "ID", "PK_BILL_GENERATED_ID", "DUE_AMT"];
    //             if (GoodHeaderFormat.length === headers.length && headers.every((val: string, index: number) => val === GoodHeaderFormat[index])) {
    //                 const jsonData = XLSX.utils.sheet_to_json<ExcelData>(worksheet);
    //                 const cleanData = jsonData.map(cleanJsonData)
    //                 resolve(cleanData);
    //             } else {
    //                 setMessage("Headers are in the wrong format, please use the template. Expected: NUMACI, ID, PK_BILL_GENERATED_ID, DUE_AMT");
    //                 confirm();
    //                 reject(new Error("Invalid header format"));
    //             }
    //         };
    //         reader.onerror = (error) => reject(error);
    //         reader.readAsBinaryString(file);
    //     });
    // };

    const readFile = (file: File) => {
        return new Promise<any[]>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    // Read the file based on its type
                    const data = new Uint8Array(e.target?.result as ArrayBuffer);
                    const workbook = XLSX.read(data, { type: 'array' });
    
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const headers: any = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];
    
                    const GoodHeaderFormat = ["NUMACI", "ID", "PK_BILL_GENERATED_ID", "DUE_AMT"];
                    if (GoodHeaderFormat.length === headers.length && headers.every((val: string, index: number) => val === GoodHeaderFormat[index])) {
                        const jsonData = XLSX.utils.sheet_to_json<ExcelData>(worksheet);
                        const cleanData = jsonData.map(cleanJsonData);
                        resolve(cleanData);
                    } else {
                        setMessage("Headers are in the wrong format, please use the template. Expected: NUMACI, ID, PK_BILL_GENERATED_ID, DUE_AMT");
                        confirm();
                        reject(new Error("Invalid header format"));
                    }
                } catch (error:any) {
                    reject(new Error("Error reading the file: " + error?.message));
                }
            };
    
            reader.onerror = (error) => reject(error);
            reader.readAsArrayBuffer(file); // Change to readAsArrayBuffer for better compatibility
        });
    };


    const fetchData = async (items: any[]) => {
        const validationErrors = validateNumaci(items, reference);
        if (validationErrors.length > 0) {
            setMessage("Invalid ACI Number in your file");
            const ok = await confirm();
            stopLoading();
            return;
        }

        const totalItems = items.length;
        const chunkSize = 15; // Limit the number of simultant request
        const invoices = [];
        for (let i = 0; i < totalItems; i+=chunkSize) {
            const chunk = items.slice(i, i+chunkSize);
            const promises = chunk.map(async (invoice: { PK_BILL_GENERATED_ID: any; ID: any; DUE_AMT: any; }) => {
                const response = await axios.post('/api/search', { enpoint: '/search-paid-or-unpaid-by-invoice', values: invoice.PK_BILL_GENERATED_ID, accessToken: Cookies.get('access_token') });
                const goodData = response.data.bills ?? [];
                return [
                    goodData.length > 0 ? goodData[0][0] : "",
                    invoice.ID,
                    invoice.PK_BILL_GENERATED_ID,
                    goodData.length > 0 ? goodData[0][3] : "",
                    goodData.length > 0 ? goodData[0][4] : "",
                    goodData.length > 0 ? goodData[0][5] : 0,
                    invoice.DUE_AMT,
                    goodData.length > 0 ? goodData[0][6] : "",
                    goodData.length > 0 ? (invoice.ID !== goodData[0][1] ? "Inconsistency key contract-invoice" : "") : "Invoice not exist"
                ];
            });

            try {
                const responses = await Promise.all(promises);
                invoices.push(...responses);
                // Update the progression percentage
                const newProgress = Math.round(((i+chunk.length)/totalItems) * 100);
                setNewProgress(newProgress);
            } catch (error) {
                console.error("FETCH DATA",error);
            }

            
        }
        setInvoices(invoices);
    }

    const onSubmit = async (data: any) => {
        setInvoices([]);
        setNewProgress(0);
        startLoading();
        setViewRecap(false);
 
        try {
            const file = data.file[0];
            fileExtensionSchema.parse(file.name);
            const jsonData = await readFile(file);
            // await fetchInvoices(jsonData);
            await fetchData(jsonData);
        } catch (error:any) {
            toast.error(error.message); // Handle errors from file reading or validation
        } finally {
            reset();
            stopLoading();
        }
    };

    return (
        <>
            <ConfirmationDialog />
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='mb-4'>
                        <Label>{label}</Label>
                        <Input
                            placeholder={placeholder}
                            className='mt-2'
                            type="file"
                            accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                            {...register('file', { required: true })}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full mt-4"
                        disabled={loading}
                    >
                        {loading ? (<><Loader2 className='animate-spin size-4 mr-2' /> Loading</>) : "Add to ACI invoices list"}
                    </Button>
                </form>
            </div>
        </>
    )
}
