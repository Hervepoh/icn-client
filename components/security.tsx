"use client"
import { redirect } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

interface ProtectedProps {
    children: React.ReactNode;
}


export default function Security({ children }: ProtectedProps) {
    const isAuthenticated = UserAuth();
    //console.log("security isAuthenticated", isAuthenticated)
    return isAuthenticated ? children : redirect("/login");
}

export function UserAuth() {
    const { user } = useSelector((state: any) => state.auth);

    if (user) {
        return true;
    } else {
        return false;
    }
}