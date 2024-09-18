"use client"
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { CircleCheckBig, ListTodo, Loader2, Save, ShoppingBag, Trash } from "lucide-react";
import { BiPlusCircle, BiSearch } from "react-icons/bi";
import { redirect, useRouter } from "next/navigation";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area"
import { DataTable } from './_components/data-table';

import { cn } from "@/lib/utils";

import { useGetRequest } from "@/features/requests/api/use-get-request";
import { SearchByInvoiceForm } from "@/features/search/components/search-by-invoice-form";
import { SearchByContractForm } from "@/features/search/components/search-by-contract-form";
import { SearchByRegroupForm } from "@/features/search/components/search-by-regroup-form";
import { SearchByCodeCliForm } from "@/features/search/components/search-by-codecli-from";
import { columns } from "./_components/columns";
import { SearchByFileForm } from "@/features/search/components/search-by-file-form";
import { Input } from "@/components/ui/input";
import { useGetRequestDetails } from "@/features/requests/api/use-get-request-details";
import { Button } from "@/components/ui/button";
import { useBulkRequestDetails } from "@/features/requests/api/use-bulk-create-request-details";
import { useBulkSaveRequestDetails } from "@/features/requests/api/use-bulk-save-request-details";
import { useEditRequest } from "@/features/requests/api/use-edit-request"
import { InfoCard } from "@/components/info-card";
import { useDeleteRequestDetails } from "@/features/requests/api/use-delete-request-details";
import { toast } from "sonner";

interface Invoice {
    id: string;
    number: string;
    contract: string;
    amount: number;
}

export default function TransactionsDetails() {
    const params = useParams<{ id: string }>();
    const router = useRouter();

    const {
        isLoading,
        isError,
        data,
        error
    } = useGetRequest(params.id)

    const {
        isLoading: details_isLoading,
        isError: details_isError,
        data: details_data,
        error: details_error
    } = useGetRequestDetails(params.id)

    const AddDeltailsTransactionsQuery = useBulkRequestDetails(params.id);
    const SaveDeltailsTransactionsQuery = useBulkSaveRequestDetails(params.id);
    const DeleteDetailTransactionsQuery = useDeleteRequestDetails(params.id);

    const disable = AddDeltailsTransactionsQuery.isPending
        || SaveDeltailsTransactionsQuery.isPending
        || DeleteDetailTransactionsQuery.isPending 
        || details_isLoading

    const [disableSubmit, setDisableSubmit] = useState(true);

    const [view, setView] = useState<"search" | "upload">("search");
    const [viewRecap, setViewRecap] = useState<boolean>(false);
    const [isFirstView, setIsFirstView] = useState(true);

    const [invoices, setInvoices] = useState([]);
    const [isDisable, setIsDisable] = useState(true)

    const [searchError, setSearchError] = useState("")
    const [searchIsLoading, setSearchIsLoading] = useState(false)

    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [selectedInvoices, setSelectedInvoices] = useState<Invoice[]>([]);

    const [finalData, setfinalData] = useState<any[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [totalToPaid, setTotalToPaid] = useState<number>(0);

    useEffect(() => {
        if (details_data) {
            setfinalData(details_data);
            recalculateSelectedInvoices(details_data);
            setViewRecap(true);
        }
    }, [details_data])

    const handleDelete = (id: string) => {
        const newData = [...finalData];
        setfinalData(newData.filter(r => r._id != id));
        DeleteDetailTransactionsQuery.mutate(id, {
            onSuccess: () => {
                console.log("success handleDelete")
            },
        });
    }

    const handleInputChange = (index: number, newValue: number) => {
        if (newValue) {
            const newData = [...finalData];
            // server update
            newData[index].amountTopaid = newValue;
            setfinalData(newData);
            recalculateSelectedInvoices(newData);
        }
    }

    const handleCheckboxChange = (index: number) => {
        const newData = [...finalData];
        newData[index].selected = !newData[index].selected;
        setfinalData(newData);
        recalculateSelectedInvoices(newData);
    };

    const handleSaveChange = () => {
        const newData = [...finalData];
        // Preparing updates datas
        const updates = newData.map((row) => ({
            updateOne: {
                filter: { _id: row._id }, // utiliser l'ID de la ligne
                update: {
                    selected: row.selected,
                    amountTopaid: row.amountTopaid
                },
            },
        }));
        SaveDeltailsTransactionsQuery.mutate(updates);
    };
    //My part
    const handleDisable = () => {
        const isOkay = !(totalToPaid === parseFloat(data?.amount) && !finalData.some(row => row.isDuplicate))
        if (isOkay) {
            setIsDisable(false)
        }

    }
    const handleSubmit = async () => {
        handleSaveChange()
        //EndPoint for status change of the request
        const update = {
            status: "processing"
        }
        //EditStatusAfterSublit.mutate(update)
        router.push('/requests')
        return "Updated";

    }
    /** */

    const handleQualityControl = () => {
        // Build finalData and give every element an attribut isDuplicate
        const newData = finalData.map(row => {
            const key = `${row.contract}-${row.invoice}`;
            const isDuplicate = finalData.filter(r => `${r.contract}-${r.invoice}` === key).length > 1;
            return { ...row, isDuplicate };
        });
        setfinalData(newData);
        const selectedRows = newData.filter((row) => row.selected);
        const newTotalToPaid = selectedRows.reduce((acc, cur) => acc + cur.amountTopaid, 0);

        if (data?.amount === newTotalToPaid && !newData.some((row) => row.isDuplicate)) {
            setDisableSubmit(false);
        }

        toast.info("Quantity controle done !")

    };


    const recalculateSelectedInvoices = (data: any[]) => {
        // Get all selected invoices
        const selectedRows = data.filter((row) => row.selected);
        const newTotal = selectedRows.reduce((acc, cur) => acc + cur.amountUnpaid, 0);
        const newTotalToPaid = selectedRows.reduce((acc, cur) => acc + cur.amountTopaid, 0);
        setTotal(newTotal);
        setTotalToPaid(newTotalToPaid);
    }


    // Search criteria action
    const [selectedOption, setSelectedOption] = useState('');
    const selectRef = useRef<HTMLDivElement>(null);

    const handleOptionChange = (value: string) => {
        setSelectedOption(value);
        if (selectRef.current) {
            selectRef.current.click(); // Ferme le menu déroulant
        }
    };



    return (
        <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
            <div className="grid grid-cols-1 lg:grid-cols-4 md:gap-8 pb-2 mb-8">
                <Card className='border-none drop-shadow-sm '>
                    <CardHeader className='gap-y-2 flex-row lg:items-center justify-between'>
                        {
                            details_isLoading ?
                                <>
                                    <div>
                                        <Skeleton className="w-32 h-6 mb-2" />
                                        <Skeleton className="w-40 h-5" />
                                    </div>
                                    <div className='flex flex-col lg:flex-row items-center gap-x-2 gap-y-2'>
                                        <Skeleton className="w-10 h-10" />
                                    </div>
                                </>
                                :
                                <>
                                    <div>
                                        <CardTitle className='text-2xl line-clamp-1'>{view === "upload" ? "Add" : "Search"}  ...</CardTitle>
                                        <CardDescription>Unpaid bill</CardDescription>
                                    </div>
                                    <div className='flex flex-col lg:flex-row items-center gap-x-2 gap-y-2'>
                                        {view === "upload" ?
                                            <BiPlusCircle size={48} className="sm:w-15" onClick={() => setView("search")} />
                                            : <BiSearch size={48} className="sm:w-15" onClick={() => { setView("upload"); setViewRecap(true); }} />}
                                    </div>
                                </>
                        }

                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {
                                !details_isLoading &&
                                view === "search" &&
                                <div ref={selectRef} className={cn("space-y-2", "mb-5")}>
                                    <Label>Criteria</Label>
                                    <Select value={selectedOption} onValueChange={handleOptionChange}>
                                        <SelectTrigger className="" >
                                            <SelectValue placeholder="Select a criteria" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="regroup">Regroupment code</SelectItem>
                                            <SelectItem value="customer">Customer</SelectItem>
                                            <SelectItem value="contract">Contract number</SelectItem>
                                            <SelectItem value="invoice">Bill number</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>}

                            {
                                view === "search" &&
                                selectedOption === 'regroup' &&
                                <SearchByRegroupForm
                                    key="regroup"
                                    label="Regroup number"
                                    placeholder="value"
                                    setInvoices={setInvoices}
                                    setIsFirstView={setIsFirstView}
                                    setError={setSearchError}
                                    setIsPending={setSearchIsLoading}
                                    setViewRecap={setViewRecap}
                                />
                            }
                            {
                                view === "search" &&
                                selectedOption === 'customer' &&
                                <SearchByCodeCliForm
                                    key="customer"
                                    label="customer name"
                                    placeholder="value"
                                    setInvoices={setInvoices}
                                    setIsFirstView={setIsFirstView}
                                    setError={setSearchError}
                                    setIsPending={setSearchIsLoading}
                                    setViewRecap={setViewRecap}
                                />
                            }
                            {
                                view === "search" &&
                                selectedOption === 'contract' &&
                                <SearchByContractForm
                                    key="contract"
                                    label="Contract number"
                                    placeholder="value"
                                    setInvoices={setInvoices}
                                    setIsFirstView={setIsFirstView}
                                    setError={setSearchError}
                                    setIsPending={setSearchIsLoading}
                                    setViewRecap={setViewRecap}
                                />
                            }
                            {
                                view === "search" &&
                                selectedOption === 'invoice' &&
                                <SearchByInvoiceForm
                                    key="invoice"
                                    label="Bill number"
                                    placeholder="value"
                                    setInvoices={setInvoices}
                                    setIsFirstView={setIsFirstView}
                                    setError={setSearchError}
                                    setIsPending={setSearchIsLoading}
                                    setViewRecap={setViewRecap}
                                />
                            }
                            {
                                view === "upload"
                                &&
                                <SearchByFileForm
                                    key="file"
                                    label="Template file"
                                    placeholder="value"
                                    setInvoices={setInvoices}
                                    setIsFirstView={setIsFirstView}
                                    setError={setSearchError}
                                    setIsPending={setSearchIsLoading}
                                    setViewRecap={setViewRecap}
                                />
                            }

                        </div>

                    </CardContent>
                </Card>
                <Card className='border-none drop-shadow-sm col-span-3'>
                    <CardHeader className='flex flex-row items-center justify-between gap-x-4'>
                        <div className='space-y-2'>
                            <CardTitle className="text-2xl line-clamp-1">
                                {`Reference ACI : ${data?.reference ?? ""}`}
                            </CardTitle>
                            {
                                isLoading ?
                                    (<Skeleton className="w-[500px] h-[20px] rounded-full" />) :
                                    (<CardDescription className="lg:line-clamp-1 lg:flex gap-3">
                                        <div>Customer : <span className="font-bold text-md">{data?.name ?? ""}</span></div>
                                        <div>Amount  :  xfa  <span className="font-bold text-md">{data?.amount}</span></div>
                                        <div>Date  :   <span className="font-bold text-md">{data?.amount}</span></div>
                                        <div>Bank :  <span className="font-bold">{data?.bank.name}</span></div>
                                    </CardDescription>)
                            }

                        </div>

                    </CardHeader>
                    <CardContent>
                        {
                            details_isLoading ?
                                <>
                                    <div className="flex h-full items-center justify-between p-6">
                                        <Skeleton className="w-[500px] h-[20px] rounded-full" />
                                    </div>
                                    <div className="flex h-full items-start justify-center p-6">
                                        <Skeleton className="w-full h-[500px]" />
                                    </div>
                                </>
                                :
                                viewRecap ?
                                    <>
                                        <div className="lg:flex text-center h-full items-center justify-between p-3">
                                            <div className="hidden lg:flex gap-2 items-center">
                                                <ShoppingBag className="mr-4" />
                                            </div>

                                            <div className="my-2">
                                                <span className="font-semibold text-xl">Panier : {` `}
                                                    {totalToPaid} {totalToPaid !== parseFloat(data?.amount) ? "<>" : "=="}  {data?.amount}</span>
                                            </div>

                                            <div className="flex gap-2 flex-col-reverse">
                                                <Button
                                                    onClick={() => handleQualityControl()}
                                                    size="sm"
                                                    className='w-full lg:w-auto'>
                                                    <ListTodo className='size-4 mr-2' />
                                                    Quality control
                                                </Button>

                                                <Button
                                                    disabled={disableSubmit}
                                                    variant={ disableSubmit ? "default": "success" }
                                                    onClick={() => ""}
                                                    size="sm"
                                                    className='w-full lg:w-auto'>
                                                    <CircleCheckBig className='size-4 mr-2' />
                                                    Submit
                                                </Button>
                                            </div>


                                        </div>

                                        <div className="flex flex-col h-full items-start justify-center p-6">
                                            <Table>
                                                <TableCaption>A list of your recent invoices.</TableCaption>
                                                <TableHeader className="bg-gray-200 text-white">
                                                    <TableRow>
                                                        <TableHead></TableHead>
                                                        <TableHead className="font-bold">Contract</TableHead>
                                                        <TableHead className="font-bold">Invoice</TableHead>
                                                        <TableHead className="font-bold">Name</TableHead>
                                                        <TableHead className="font-bold">Due Amount</TableHead>
                                                        <TableHead className="font-bold">Amount to Paid</TableHead>
                                                        <TableHead></TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {finalData.map((row: any, i: any) => (
                                                        <TableRow
                                                            key={i}
                                                            style={{
                                                                backgroundColor: row?.isDuplicate ? '#f559' : row.selected ? '#f1f1f1' : 'transparent',
                                                                color: row.isDuplicate ? 'white' : 'inherit'
                                                            }}
                                                        >
                                                            <TableCell className="font-medium">
                                                                <Input
                                                                    type="checkbox"
                                                                    checked={row.selected}
                                                                    onChange={() => handleCheckboxChange(i)}
                                                                />

                                                            </TableCell>
                                                            <TableCell className="font-medium">{row.contract}</TableCell>
                                                            <TableCell className="font-medium">{row.invoice}</TableCell>
                                                            <TableCell className="font-medium">{row.name}</TableCell>
                                                            <TableCell>{row.amountUnpaid}</TableCell>
                                                            <TableCell>
                                                                <Input
                                                                    type="number"
                                                                    value={row.amountTopaid}
                                                                    onChange={e => handleInputChange(i, parseFloat(e.target.value))}
                                                                    min={0}
                                                                    className="w-[130px]"
                                                                    style={{ color: row.isDuplicate ? 'red' : 'inherit' }}
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center justify-center gap-x-1">
                                                                    <Button
                                                                        disabled={disable}
                                                                        onClick={() => handleDelete(row._id)}
                                                                        size="sm"
                                                                        variant="ghost">
                                                                        <Trash className='size-5' />
                                                                    </Button>
                                                                    {row.isDuplicate && <InfoCard content={
                                                                        row.isDuplicate
                                                                            ? `Key contract-invoice : ${row.contract}-${row.invoice} is duplicate`
                                                                            : `Data inconsistency`} />}
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                                <TableFooter>
                                                    <TableRow>
                                                        <TableCell colSpan={4}>Total</TableCell>
                                                        <TableCell className="text-left">{total.toFixed(0)}</TableCell>
                                                        <TableCell colSpan={2} className="text-left">{totalToPaid.toFixed(0)}</TableCell>
                                                    </TableRow>
                                                </TableFooter>
                                            </Table>

                                            <Button
                                                disabled={disable}
                                                onClick={() => handleSaveChange()}
                                                size="sm"
                                                className='w-full mt-10 lg:w-auto'>
                                                <Save className='size-4 mr-2' />
                                                Save changes
                                            </Button>
                                        </div>
                                    </>
                                    :
                                    <ScrollArea className="flex h-[800px] items-center justify-center p-6 rounded-md">
                                        {
                                            searchIsLoading ? (<Card className='border-none drop-shadow-sm'>
                                                <CardHeader>
                                                    <Skeleton className="w-48 h-8" />
                                                </CardHeader>
                                                <CardContent className='h-[500px] w-full flex items-center justify-center'>
                                                    <Loader2 className='size-6 text-slate-300 animate-spin' /> Searching...
                                                </CardContent>
                                            </Card>) :
                                                isFirstView ? (<Card className='border-none drop-shadow-sm'>
                                                    <CardContent className='h-[500px] w-full flex flex-col items-center text-xl text-bold justify-center'>
                                                        <div className="text-2xl"><BiSearch size={52} className="sm:w-15" /></div>
                                                        <div>Just Search what you want</div>
                                                    </CardContent>
                                                </Card>) :
                                                    <DataTable
                                                        columns={columns}
                                                        data={invoices}
                                                        filterKey={"3"}
                                                        onSubmit={(row: any[]) => {
                                                            const data = row.map((r: any) =>
                                                            ({
                                                                contract: r.original[1].toString(),
                                                                invoice: r.original[2].toString(),
                                                                name: r.original[3].toString(),
                                                                amountUnpaid: r.original[5]
                                                            }));

                                                            AddDeltailsTransactionsQuery.mutate(data);
                                                        }}
                                                        disabled={disable}
                                                    />
                                        }
                                    </ScrollArea>
                        }

                    </CardContent>
                </Card>
            </div>
        </div>
    )
}


