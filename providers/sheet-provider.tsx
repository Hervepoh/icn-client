"use client"

import { useMountedState } from "react-use";

import { NewCategorySheet } from "@/features/categories/components/new-category-sheet";
import { EditCategorySheet } from "@/features/categories/components/edit-category-sheet";

import { NewRequestSheet } from "@/features/requests/components/new-request-sheet";
import { EditRequestSheet } from "@/features/requests/components/edit-request-sheet";
import { ViewRequestSheet } from "@/features/requests/components/view-request-sheet";
import { OpenRequestForValidationSheet } from "@/features/requests/components/open-request-for-validation-sheet";
import { OpenRequestForAssignationSheet } from "@/features/requests/components/open-request-for-assignation-sheet";
import { BrouillardSheet } from "@/features/requests/components/brouillard-sheet";
import { NewUserSheet } from "@/features/users/components/new-user-sheet";
import { EditUserSheet } from "@/features/users/components/edit-user-sheet";


export const SheetProvider = () => {
    const isMounted = useMountedState();

    if (!isMounted) return null;

    return (
        <>
            <NewCategorySheet />
            <EditCategorySheet />
            <NewUserSheet />
            <EditUserSheet />
            <NewRequestSheet />
            <EditRequestSheet />
            <ViewRequestSheet />
            <OpenRequestForValidationSheet />
            <OpenRequestForAssignationSheet />
            <BrouillardSheet />
        </>
    )

}