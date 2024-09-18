"use client"

import React from "react";
import { useSelector } from "react-redux";
import { redirect, useRouter } from "next/navigation";

import { UserAuth } from "@/components/security";

interface Props {
    children: React.ReactNode;
}


export default function IsAuthenticated({ children }: Props) {
    const isAuthenticated = UserAuth();
   // console.log("isAuthenticated",isAuthenticated);
    const router = useRouter();
    if (isAuthenticated) {
        redirect("/")
    }

    return children;
}
