import { create } from "zustand";

// Define the Transaction interface
interface Lock {
    transactionId: string;
    userId: string;
    users: any;
}


// Define the TransactionState interface
type LockState = {
    lock: Lock[];
    setLock: (locks: Lock[]) => void;
    clearLock: () => void;
}

export const useTransactionStore = create<LockState>((set) => ({
    lock: [],
    setLock: (lock) => set({ lock }),
    clearLock: () => set({ lock: [] }),
}));