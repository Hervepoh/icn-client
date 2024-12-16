"use client"
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";
import { BiPlusCircle, BiSearch } from "react-icons/bi";
import { CircleCheckBig, Info, Loader2, Save, ShoppingBag, Trash } from "lucide-react";

import { cn, formatCurrency } from "@/lib/utils";
import { status } from "@/config/status.config";
import { useAlert } from '@/hooks/use-alert';
import { useLoadingStore } from "@/hooks/use-loading-store";

import { useUserStore } from "@/features/users/hooks/use-user-store";
import { useGetRequest } from "@/features/requests/api/use-get-request";
import { useEditRequest } from '@/features/requests/api/use-edit-request';
import { useGetRequestDetails } from "@/features/requests/api/use-get-request-details";
import { useBulkRequestDetails } from "@/features/requests/api/use-bulk-create-request-details";
import { useBulkSaveRequestDetails } from "@/features/requests/api/use-bulk-save-request-details";
import { useDeleteRequestDetails } from "@/features/requests/api/use-delete-request-details";
import { SearchByInvoiceForm } from "@/features/search/components/search-by-invoice-form";
import { SearchByContractForm } from "@/features/search/components/search-by-contract-form";
import { SearchByRegroupForm } from "@/features/search/components/search-by-regroup-form";
import { SearchByFileForm } from "@/features/search/components/search-by-file-form";

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
    HoverCard,
    HoverCardContent,
    HoverCardTrigger
} from "@/components/ui/hover-card";
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { InfoCard } from "@/components/info-card";
import { LoadingProgress } from "@/components/loading-progress";

import { DataTable } from './_components/data-table';
import { columns } from "./_components/columns";
import { LoadingComponent } from "./_components/Loading";
import { qa } from "@/lib/qa";


export default function TransactionsDetails() {
    const params = useParams<{ id: string }>();
    const router = useRouter();

    const { user } = useUserStore();
    const { loading } = useLoadingStore();

    const [view, setView] = useState<"search" | "upload">("search");
    const [viewRecap, setViewRecap] = useState<boolean>(false);
    const [newProgress, setNewProgress] = useState(0);
    const [message, setMessage] = useState("");

    const [invoices, setInvoices] = useState([]);
    const [finalData, setfinalData] = useState<any[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [totalToPaid, setTotalToPaid] = useState<number>(0);
    const [totalCreditToApply, setTotalCreditToApply] = useState<number>(0);
    const [onSubmit, setOnSubmit] = useState<boolean>(false);

    const [ConfirmationDialog, confirm] = useAlert({ title: "Quality Assurance Control", message: message });

    const { isLoading: request_isLoading, data } = useGetRequest(params.id)
    const { isLoading: details_isLoading, data: details_data } = useGetRequestDetails(params.id)

    const EditTransactionsQuery = useEditRequest(params.id);
    const AddDeltailsTransactionsQuery = useBulkRequestDetails(params.id);
    const SaveDeltailsTransactionsQuery = useBulkSaveRequestDetails(params.id);
    const DeleteDetailTransactionsQuery = useDeleteRequestDetails(params.id);

    const disable = AddDeltailsTransactionsQuery.isPending
        || SaveDeltailsTransactionsQuery.isPending
        || DeleteDetailTransactionsQuery.isPending
        || EditTransactionsQuery.isPending

    const isLoading = request_isLoading || details_isLoading;

    useEffect(() => {
        if (details_data) {
            setfinalData(details_data);
            recalculateSelectedInvoices(details_data);
            setViewRecap(true);
        }
    }, [details_data])

    const handleReset = () => {
        setfinalData([]);
        setTotal(0);
        setTotalToPaid(0);
        setTotalCreditToApply(0);
    }

    const removItem = (id: string) => {
        const newData = [...finalData];
        setfinalData(newData.filter(r => r.id != id));
        DeleteDetailTransactionsQuery.mutate(id, {
            onSuccess: () => {
                toast.success("Successfully deleted")
            },
        });
    }

    const handleDelete = (id: string) => {
        removItem(id);
        window.location.reload();
    }

    const handleDeleteAll = () => {
        const newData = [...finalData];
        newData.forEach((item) => {
            removItem(item.id)
        })
        handleReset();
    }

    const handleInputChange = (index: number, newValue: number) => {
        if (newValue) {
            const newData = [...finalData];
            // TODO server update
            newData[index].amountTopaid = newValue;
            setfinalData(newData);
            recalculateSelectedInvoices(newData);
        }
    }

    const handleCheckboxChange = (index: number) => {
        const newData = [...finalData];
        newData[index].selected = !newData[index].selected;
        // TODO server update
        setfinalData(newData);
        recalculateSelectedInvoices(newData);
    };

    const handleSaveChange = async () => {
        try {
            const newData = [...finalData];
            // Preparing updates datas
            if (newData.length > 0) {
                const updates = newData.map((row) => ({
                    id: row.id,
                    selected: row.selected,
                    amountTopaid: row.amountTopaid
                }));
                SaveDeltailsTransactionsQuery.mutate(updates);
            }
            return true
        } catch (error) {
            console.error("An error occurred:", error);
            toast.error('An error occurred while processing your request.');
            return false
        }

    };

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const handleSubmit = async () => {
        setOnSubmit(true);
        try {

            const save = await handleSaveChange();
            await sleep(500); // Attendre 1000 = 1 secondes
            if (save) {
                const qa = await qualityControl()
                if (qa) {
                    //EndPoint for status change of the request
                    EditTransactionsQuery.mutate({ status: status[7], userId: user?.id, unitId: user?.unitId }, {
                        onSuccess: () => {
                            toast.success('Task Completed')
                            router.push('/requests');
                        },
                    });
                } else {
                    const ok = await confirm();
                    if (ok) {
                        console.log("User is inform")
                        setOnSubmit(false);
                    }
                }
            }

        } catch (error) {
            console.error("An error occurred:", error);
            toast.error('An error occurred while processing your request.');
        }

    }

    const qualityControl = async () => {
        // Build finalData and give every element an attribut isDuplicate
        const newData = finalData.map(row => {
            const key = `${row.contract}-${row.invoice}`;
            const isDuplicate = finalData.filter(r => `${r.contract}-${r.invoice}` === key).length > 1;
            return { ...row, isDuplicate };
        });

        setfinalData(newData);
        const selectedRows = newData.filter((row) => row.selected);
        const newTotalToPaid = selectedRows.reduce((acc, cur) => acc + cur.amountTopaid, 0);

        // Check for amount mismatch
        if (data?.amount != newTotalToPaid) {
            setMessage(`
                We detect an inconsistency data. <br/>
                The amount you are attempting to pay does not match the amount specified in the ACI. <br/><br/>
                <p> AMOUNT ACI: <strong className='text-bold text-primary'>${data?.amount}</strong>  </p>
                  <p>Amount Incoices : <strong className='text-bold text-primary'> ${newTotalToPaid}</strong>  </p><br/>
                 Please review the amount and try again. 
                `);
            return false; // Return false if there's an error
        }

        // Check for duplicate invoices
        const duplicates = newData.filter(row => row.isDuplicate && row.selected);
        if (duplicates.length > 0) {
            const duplicateDetails = duplicates.map(row =>
                `Bill : ${row.invoice} - Contrat : ${row.contract}`
            ).join(',<br/>');

            setMessage(`
                 We detect an inconsistency data. <br/>
                You have duplicate incoices : 
                <p> <strong className='text-bold text-primary'>${duplicateDetails}</strong>.</p>
                Please fix this issue to contibue.
            `);
            return false; // Return false if there are duplicates
        }

        // Check quality_assurance and message if qualityControl failed
        const QA = await qa(params.id)
        if (!QA) {
            setMessage("Internal server Error"); // Set the message from the response if quality assurance fails
            return false;
        }
        if (!QA.quality_assurance) {
            setMessage(QA.message); // Set the message from the response if quality assurance fails
            return false;
        }

        // All checks passed
        return true;
    };

    const recalculateSelectedInvoices = (data: any[]) => {
        // Get all selected invoices
        const selectedRows = data.filter((row) => row.selected);
        const newTotal = selectedRows.reduce((acc, cur) => acc + cur.amountUnpaid, 0);
        const newTotalToPaid = selectedRows.reduce((acc, cur) => acc + cur.amountTopaid, 0);
        const newTotalCreditToApply = selectedRows.reduce((acc, cur) => {
            const credit = cur.amountTopaid - cur.amountUnpaid
            return acc + (credit > 0 ? credit : 0)
        }, 0);
        setTotal(newTotal);
        setTotalToPaid(newTotalToPaid);
        setTotalCreditToApply(newTotalCreditToApply);
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


    if (isLoading) {
        return <LoadingComponent />
    }

    return (
        <>
            <ConfirmationDialog />
            <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
                <div className="grid grid-cols-1 lg:grid-cols-5 md:gap-8 pb-2 mb-8">
                    {data?.statusId == 6 &&
                        <Card className='border-none drop-shadow-sm '>
                            <CardHeader className='gap-y-2 flex-row lg:items-center justify-between'>
                                <button
                                    className='w-full flex justify-between items-start'
                                    onClick={() => view === "upload" ? setView("search") : (setView("upload"), setViewRecap(true))}
                                >
                                    <div>
                                        <CardTitle className='text-2xl line-clamp-1'>{view === "upload" ? "Add" : "Search"}  ...</CardTitle>
                                        <CardDescription>Unpaid bill</CardDescription>
                                    </div>
                                    <div className='flex flex-col lg:flex-row items-center gap-x-2 gap-y-2'>
                                        {view === "upload" ?
                                            <BiSearch size={48} className="sm:w-15" onClick={() => setView("search")} />
                                            : <BiPlusCircle size={48} className="sm:w-15" onClick={() => { setView("upload"); setViewRecap(true); }} />}
                                    </div>
                                </button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {
                                        view === "search" && (
                                            <div className="flex flex-col gap-y-2">
                                                <SearchByFileForm
                                                    key="file"
                                                    label="Upload a file"
                                                    setInvoices={setInvoices}
                                                    setViewRecap={setViewRecap}
                                                    setNewProgress={setNewProgress}
                                                    reference={data?.reference}
                                                />


                                                <div ref={selectRef} className={cn("space-y-2", "my-5")}>
                                                    <Label>Criteria</Label>
                                                    <Select value={selectedOption} onValueChange={handleOptionChange}>
                                                        <SelectTrigger className="" >
                                                            <SelectValue placeholder="Select a criteria" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="regroup">Regroupment code</SelectItem>
                                                            <SelectItem value="contract">Contract number</SelectItem>
                                                            <SelectItem value="invoice">Bill number</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                            </div>
                                        )
                                    }

                                    {
                                        view === "search" &&
                                        selectedOption === 'regroup' &&
                                        <SearchByRegroupForm
                                            key="regroup"
                                            label="Regroup number"
                                            placeholder="value"
                                            setInvoices={setInvoices}
                                            setViewRecap={setViewRecap}
                                            setNewProgress={setNewProgress}
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
                                            setViewRecap={setViewRecap}
                                            setNewProgress={setNewProgress}
                                        />
                                    }
                                    {
                                        view === "search" &&
                                        selectedOption === 'invoice' &&
                                        <SearchByInvoiceForm
                                            key="invoice"
                                            label="Invoice number"
                                            placeholder="value"
                                            setInvoices={setInvoices}
                                            setNewProgress={setNewProgress}
                                            setViewRecap={setViewRecap}
                                        />
                                    }
                                    {
                                        view === "upload" &&
                                        <SearchByFileForm
                                            key="file"
                                            label="Upload a file"
                                            setInvoices={setInvoices}
                                            setViewRecap={setViewRecap}
                                            setNewProgress={setNewProgress}
                                            reference={data?.reference}
                                        />
                                    }

                                </div>

                            </CardContent>
                        </Card>
                    }
                    <Card className={ cn('border-none drop-shadow-sm', data?.statusId == 6 ? 'col-span-4':'col-span-5') }>
                        <CardHeader className='flex flex-row items-center justify-between gap-x-4'>
                            <div className='space-y-2'>
                                <CardTitle className="text-2xl line-clamp-1">
                                    {`Reference ACI : ${data?.reference ?? ""}`}
                                </CardTitle>
                                {
                                    isLoading ?
                                        (<Skeleton className="w-[500px] h-[20px] rounded-full" />) :
                                        (<CardDescription>
                                            <div className="lg:line-clamp-1 lg:flex gap-3">
                                                <div>Customer : <span className="font-bold text-md">{data?.name ?? ""}</span></div>
                                                <div>Amount  :  xfa  <span className="font-bold text-md">{data?.amount}</span></div>
                                                <div>Date  :   <span className="font-bold text-md">{format(new Date(data?.paymentDate || new Date()), 'dd/MM/yyyy')}</span></div>
                                                <div>Bank :  <span className="font-bold">{data?.bank.name}</span></div>
                                            </div>
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
                                            <div className="mt-5">
                                                <div className="flex justify-between">
                                                    <div>Number of invoices :  <span className="font-bold text-md">{` `}{finalData.length.toString().padStart(2, '0')}</span></div>
                                                    <div className="flex gap-3">
                                                        Selected : <span className="font-bold text-md">{finalData.filter((row) => row.selected).length.toString().padStart(2, '0')}</span>
                                                        UnSelected : <span className="font-bold text-md">{finalData.filter((row) => !row.selected).length.toString().padStart(2, '0')}</span>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between">
                                                    <div>Amount Invoice : <span className="font-bold text-md">{formatCurrency(totalToPaid)}</span></div>
                                                    <div>Amount ACI : <span className="font-bold text-md">{formatCurrency(data?.amount)}</span></div>
                                                </div>
                                            </div>
                                            <div className="lg:flex text-center h-full items-center justify-between p-3">
                                                <div className="hidden lg:flex gap-2 items-center">
                                                    <ShoppingBag className="mr-4" />
                                                </div>

                                                <div className="my-2 gap-y-2 flex flex-col items-center">
                                                    Difference between ACI and amount collected
                                                    {<Badge variant={parseFloat(data?.amount) - totalToPaid !== 0 ? 'destructive' : 'success'} className="text-xl">{formatCurrency(parseFloat(data?.amount) - totalToPaid)} </Badge>}

                                                </div>
                                                {data?.statusId == 6 &&
                                                    <div className="flex gap-2 flex-col-reverse">
                                                        <Button
                                                            disabled={disable && onSubmit}
                                                            onClick={() => handleSubmit()}
                                                            size="sm"
                                                            className='w-full lg:w-auto'>
                                                            {
                                                                disable ?
                                                                    (<><Loader2 className='animate-spin size-4 mr-2' /> Loading</>) :
                                                                    (<><CircleCheckBig className='size-4 mr-2' /> Submit</>)
                                                            }
                                                        </Button>
                                                    </div>
                                                }
                                                {data?.statusId != 6 && <div />}


                                            </div>

                                            <div className="flex flex-col h-full items-start justify-center">
                                                <Table>
                                                    <TableCaption>A list of your invoices.</TableCaption>
                                                    <TableHeader className="bg-gray-200 text-white">
                                                        <TableRow>
                                                            <TableHead></TableHead>
                                                            <TableHead style={{ width: '5px' }}></TableHead>
                                                            <TableHead className="font-bold">Contract</TableHead>
                                                            <TableHead className="font-bold">Invoice</TableHead>
                                                            <TableHead className="font-bold">Name</TableHead>
                                                            <TableHead className="font-bold">Due Amount</TableHead>
                                                            <TableHead className="font-bold">Amount to Paid</TableHead>
                                                            <TableHead className="font-bold">Avoir</TableHead>
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
                                                                        disabled={data?.statusId != 6}
                                                                        onChange={() => handleCheckboxChange(i)}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    {row.amountUnpaid !== row.amountTopaid && <HoverCard>
                                                                        <HoverCardTrigger> <Info /></HoverCardTrigger>
                                                                        <HoverCardContent>
                                                                            amountTopaid – amountUnpaid are different
                                                                        </HoverCardContent>
                                                                    </HoverCard>}
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
                                                                        disabled={data?.statusId != 6 || disable}
                                                                        className="w-[130px]"
                                                                        style={{ color: row.isDuplicate ? 'red' : 'inherit' }}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Input
                                                                        type="number"
                                                                        value={(row.amountTopaid - row.amountUnpaid > 0) ? row.amountTopaid - row.amountUnpaid : 0}
                                                                        min={0}
                                                                        disabled
                                                                        className="w-[130px]"
                                                                        style={{ color: row.isDuplicate ? 'red' : 'inherit' }}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex items-center justify-center gap-x-1">
                                                                        {data?.statusId == 6 && <Button
                                                                            disabled={disable}
                                                                            onClick={() => handleDelete(row.id)}
                                                                            size="sm"
                                                                            variant="ghost">
                                                                            <Trash className='size-5' />
                                                                        </Button>}

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
                                                            <TableCell colSpan={5} className="text-center">Total</TableCell>
                                                            <TableCell className="text-left">{total.toFixed(0)}</TableCell>
                                                            <TableCell className="text-left">{totalToPaid.toFixed(0)}</TableCell>
                                                            <TableCell colSpan={2} className="text-left">{totalCreditToApply.toFixed(0)}</TableCell>
                                                        </TableRow>
                                                    </TableFooter>
                                                </Table>

                                                {data?.statusId == 6 &&
                                                    <div className="flex gap-2">
                                                        <Button
                                                            disabled={disable || finalData.length == 0}
                                                            onClick={() => handleSaveChange()}
                                                            size="sm"
                                                            className='w-full mt-10 lg:w-auto'>
                                                            <Save className='size-4 mr-2' />
                                                            Save changes
                                                        </Button>
                                                        <Button
                                                            disabled={disable || finalData.length == 0}
                                                            onClick={() => handleDeleteAll()}
                                                            variant="destructive"
                                                            size="sm"
                                                            className='w-full mt-10 lg:w-auto'>
                                                            <Save className='size-4 mr-2' />
                                                            Clear all invoices
                                                        </Button>
                                                    </div>
                                                }
                                            </div>
                                        </>
                                        :
                                        <ScrollArea className="flex h-full w-full items-center justify-center rounded-md">
                                            {
                                                loading ?
                                                    (<Card className='border-none drop-shadow-sm'>
                                                        <CardHeader>
                                                            <Skeleton className="w-48 h-8" />
                                                        </CardHeader>
                                                        <CardContent className='h-[500px] w-full flex flex-col items-center justify-center'>
                                                            <div className="flex my-5"><Loader2 className='size-6 text-slate-300 animate-spin' /> {` `} Searching...</div>
                                                            <LoadingProgress value={newProgress} className="w-[500px]" />
                                                        </CardContent>
                                                    </Card>)
                                                    : (
                                                        <div className="overflow-x-auto w-full">
                                                            <DataTable
                                                                columns={columns}
                                                                data={invoices}
                                                                filterKey={"3"}
                                                                onSubmit={(row: any[]) => {

                                                                    // Filter rows where r.original[6] is empty
                                                                    const filteredData = row.filter((r: any) => !r.original[7]);

                                                                    // Map the filtered data
                                                                    const data = filteredData.map((r: any) => ({
                                                                        contract: r.original[1].toString(),
                                                                        invoice: r.original[2].toString(),
                                                                        name: r.original[3] ? r.original[3].toString() : "",
                                                                        date: r.original[4] ? r.original[4].toString() : "",
                                                                        amountUnpaid: r.original[5],
                                                                        amountTopaid: r.original[6] ?? r.original[5],
                                                                    }));

                                                                    // Check if there's data to mutate
                                                                    if (data.length > 0) {
                                                                        AddDeltailsTransactionsQuery.mutate(data);
                                                                    } else {
                                                                        toast.info("No valid rows to add.")
                                                                    }
                                                                    // const data = row.map((r: any) =>
                                                                    // ({
                                                                    //     contract: r.original[1].toString(),
                                                                    //     invoice: r.original[2].toString(),
                                                                    //     name: r.original[3] ? r.original[3].toString() : "",
                                                                    //     amountUnpaid: r.original[5],
                                                                    //     amountTopaid: r.original[6] ?? r.original[5],
                                                                    // }));
                                                                    // AddDeltailsTransactionsQuery.mutate(data);
                                                                }}
                                                                disabled={disable}
                                                            />
                                                        </div>
                                                    )

                                            }
                                        </ScrollArea>
                            }

                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}



