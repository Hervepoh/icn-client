import { create } from "zustand";

type NewState = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useNewUser = create<NewState>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));