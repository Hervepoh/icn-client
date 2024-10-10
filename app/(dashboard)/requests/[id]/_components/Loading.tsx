import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"

export const LoadingComponent = () => {
    return (
        <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
            <div className="grid grid-cols-1 lg:grid-cols-4 md:gap-8 pb-2 mb-8">
                <Card className='border-none drop-shadow-sm '>
                    <CardHeader className='gap-y-2 flex-row lg:items-center justify-between'>

                        <div>
                            <Skeleton className="w-32 h-6 mb-2" />
                            <Skeleton className="w-40 h-5" />
                        </div>
                        <div className='flex flex-col lg:flex-row items-center gap-x-2 gap-y-2'>
                            <Skeleton className="w-10 h-10" />
                        </div>
                    </CardHeader>
                    <CardContent>

                    </CardContent>
                </Card>
                <Card className='border-none drop-shadow-sm col-span-3'>
                    <CardHeader className='flex flex-row items-center justify-between gap-x-4'>
                        <div className='space-y-2'>
                            <Skeleton className="w-[500px] h-[20px] rounded-full" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="w-[500px] h-[20px] rounded-full" />

                        <div className="flex h-full items-start justify-center p-6">
                            <Skeleton className="w-full h-[500px]" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

