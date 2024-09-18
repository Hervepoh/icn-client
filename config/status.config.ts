import { CheckCircledIcon, CircleIcon, CrossCircledIcon, QuestionMarkCircledIcon, StopwatchIcon } from "@radix-ui/react-icons";

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
        icon: CrossCircledIcon,
    },
    {
        value: 'draft',
        label: 'Draft',
        icon: QuestionMarkCircledIcon,
    },
    {
        value: 'initiated',
        label: 'Initiated',
        icon: CircleIcon,
    },
    {
        value: 'validated',
        label: 'Validated',
        icon: CheckCircledIcon,
    },
    {
        value: 'rejected',
        label: 'Rejected',
        icon: CrossCircledIcon,
    },
    {
        value: 'processing',
        label: 'In Progress',
        icon: StopwatchIcon,
    },
    {
        value: 'treated',
        label: 'Treated',
        icon: CheckCircledIcon,
    },

]

export const statusStyles: { [key: string]: "default" | "success" | "destructive" | "outline" | "secondary" | "primary" | "warning" | null | undefined } = {
    "draft": "destructive",
    "initiated": "primary",
    "validated": "success",
    "rejected": "destructive",
    "pending_commercial_input": "warning",
    "pending_finance_validation": "warning",
    "processing": "default",
    "treated": "success",
};
