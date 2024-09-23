import { create } from "zustand";

type OpenValidationState = {
    id?: string;
    isOpen: boolean;
    onOpen: (id: string) => void;
    onClose: () => void;
}

export const useOpenRequestValidation = create<OpenValidationState>((set) => ({
    id: undefined,
    isOpen: false,
    onOpen: (id: string) => set({ isOpen: true, id }),
    onClose: () => set({ isOpen: false, id: undefined }),
}));