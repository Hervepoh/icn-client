import { CheckCircledIcon, CircleIcon, CrossCircledIcon, QuestionMarkCircledIcon, StopwatchIcon } from "@radix-ui/react-icons";
import { NewspaperIcon, SandwichIcon, Trash2Icon } from "lucide-react";

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
        icon: SandwichIcon,
        iconColor: 'text-white',
    },
    {
        value: 'draft',
        label: 'Draft',
        icon: Trash2Icon,
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
        label: 'Waiting Commercial input',
        icon: StopwatchIcon,
        iconColor: 'text-white',
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
        icon: CheckCircledIcon,
        iconColor: 'text-white',
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
