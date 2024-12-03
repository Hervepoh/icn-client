import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Props {
    className?: string
    value: number;
    variant?: "default" | "success",
    size?: "default" | "sm";
};

const colorByVariant = {
    default: "text-primary",
    success: "text-emerald-700",
}

const sizeByVariant = {
    default: "text-md",
    sm: "text-sm",
}

export const LoadingProgress = ({
    className,
    value,
    variant,
    size,
}: Props) => {
    return (
        <div>
            <Progress
                className={cn(className)}
                value={value}
            />
            <p className={cn(
                "text-center font-medium mt-2 text-sky-700",
                colorByVariant[variant || "default"],
                sizeByVariant[size || "default"],
            )}>
                {Math.round(value)} % Complete
            </p>
        </div>
    )
}