"use client"

import { useMountedState } from "react-use";


import { NewRequestSheet } from "@/features/requests/components/new-request-sheet";
import { EditRequestSheet } from "@/features/requests/components/edit-request-sheet";

// import { NewAccountSheet } from "@/features/accounts/components/new-account-sheet";
// import { EditAccountSheet } from "@/features/accounts/components/edit-account-sheet";
import { NewCategorySheet } from "@/features/categories/components/new-category-sheet";
import { EditCategorySheet } from "@/features/categories/components/edit-category-sheet";
import { RejectRequestSheet } from "@/features/requests/components/reject-request-sheet";

// import { NewTransactionSheet } from "@/features/transactions/components/new-transaction-sheet";
// import { EditTransactionSheet } from "@/features/transactions/components/edit-transaction-sheet";

export const SheetProvider = () => {
    const isMounted = useMountedState();

    if (!isMounted) return null;

    return (
        <>
            <NewCategorySheet />
            <EditCategorySheet />
            
            <NewRequestSheet />
            <EditRequestSheet />
            <RejectRequestSheet />

           
            {/* 
            <NewAccountSheet />
            <EditAccountSheet />
            
            
            <EditTransactionSheet /> 
            */}
        </>
    )

}