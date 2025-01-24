import { CheckCircledIcon, CircleIcon, CrossCircledIcon, QuestionMarkCircledIcon, StopwatchIcon } from "@radix-ui/react-icons";
import { NewspaperIcon, SandwichIcon, SquarePenIcon, Trash2Icon } from "lucide-react";
import { LuBookOpenCheck } from "react-icons/lu";

export const status = [
    'deleted',
    "draft",
    "initiated",
    "validated",
    "rejected",
    "pending_commercial_input",
    "pending_finance_validation",
    "processing",
    "treated"
]

export const statuses = [
    {
        value: 'deleted',
        label: 'Deleted',
        icon: Trash2Icon,
        iconColor: 'text-white',
    },
    {
        value: 'draft',
        label: 'Draft',
        icon: SquarePenIcon ,
        iconColor: 'text-white',
    },
    {
        value: 'initiated',
        label: 'Initiated',
        icon: NewspaperIcon,
        iconColor: 'text-black',
    },
    {
        value: 'validated',
        label: 'Validated',
        icon: CheckCircledIcon,
        iconColor: 'text-black',
    },
    {
        value: 'rejected',
        label: 'Rejected',
        icon: CrossCircledIcon,
        iconColor: 'text-white',
    },
    {
        value: 'pending_commercial_input',
        label: 'Awaiting KAM input',
        icon: SquarePenIcon,
        iconColor: 'text-black',
    },
    {
        value: 'pending_finance_validation',
        label: 'Awaiting DFI verification',
        icon: SquarePenIcon,
        iconColor: 'text-black',
    },
    {
        value: 'processing',
        label: 'In process',
        icon: StopwatchIcon,
        iconColor: 'text-white',
    },
    {
        value: 'treated',
        label: 'Treated',
        icon: LuBookOpenCheck  ,
        iconColor: 'text-black',
    },

]

export const statusStyles: { [key: string]: "default" | "success" | "destructive" | "outline" | "secondary" | "primary" | "warning" | null | undefined } = {
    "draft": "default",
    "initiated": "primary",
    "validated": "success",
    "rejected": "destructive",
    "pending_commercial_input": "primary",
    "pending_finance_validation": "warning",
    "processing": "default",
    "treated": "success",
};
