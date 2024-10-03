import { TriangleAlert } from 'lucide-react';

// import { useOpenBank } from '@/features/categories/hooks/use-open-bank';
// import { useOpenTransaction } from '@/features/transactions/hooks/use-open-transaction';

import { cn } from '@/lib/utils';


type Props = {
    id: string
    bank: string | null;
    bankId: string | null;
}

export const BankColumn = ({ id, bank, bankId }: Props) => {

    // const { onOpen: onOpenBank } = useOpenBank();
    // const { onOpen: onOpenTransaction } = useOpenTransaction();
    const onClick = () => {
        if (bankId) {
            // onOpenBank(bankId);
        }else {
            // onOpenTransaction(id);
        }

    }

    return (
        <div
            onClick={onClick}
            className={cn('flex items-center cursor-pointer hover:underline',
            !bank && "text-rose-500 hover:no-underline"
            )}>
            { !bank && <TriangleAlert className='mr-2 size-4 shrink-0' />}
            {bank || "Uncategorized"}
        </div>
    )
}

