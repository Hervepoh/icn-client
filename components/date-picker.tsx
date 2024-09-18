"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { SelectSingleEventHandler } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

type Props = {
    value?: Date,
    onChange?: SelectSingleEventHandler;
    disabled?: boolean
}
export function DatePicker(
    { value, onChange, disabled }: Props
) {

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    disabled={disabled}
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !value && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value ? format(value, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                {/* //DOC: https://github.com/shadcn-ui/ui/discussions/1553 */}
                <Calendar
                    mode="single"
                    selected={value}
                    onSelect={onChange}
                    disabled={disabled}
                    initialFocus
                    captionLayout="dropdown" //Also: dropdown-buttons |  dropdown | buttons 
                    fromYear={2000} 
                    toYear={new Date().getFullYear()}
                    // numberOfMonths={2} //Add this line, if you want, can be 2 or more
                    className="rounded-md border"
                />
            </PopoverContent>
        </Popover>
    );
    
}
