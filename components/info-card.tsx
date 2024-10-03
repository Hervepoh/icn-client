import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Button } from "./ui/button"
import { Info } from "lucide-react"


type Props = {
    content: string
}

export const InfoCard = ({ content }: Props) => {
    return (
        <HoverCard>
            <HoverCardTrigger>
                <Button
                size="sm"
                variant="secondary">
                <Info className='size-5' />
            </Button></HoverCardTrigger>
            <HoverCardContent>
                {content}
            </HoverCardContent>
        </HoverCard>
    )
}
