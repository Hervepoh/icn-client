import { create } from "zustand";

// Define the LoadingState interface
type LoadingState = {
    loading: boolean;
    startLoading: () => void;
    stopLoading: () => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
    loading: false,
    startLoading: () => set({ loading:true }),
    stopLoading: () => set({ loading:false }),
}));