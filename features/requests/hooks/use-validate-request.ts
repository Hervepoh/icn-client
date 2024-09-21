import { create } from "zustand";

type validateState = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useValidateRequest = create<validateState>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));