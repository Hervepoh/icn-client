import { redirect } from "next/navigation";
import UserAuth from "./userAuth";
import React, { useState } from "react";
import { useLogOutQuery } from "@/lib/redux/features/auth/authApi";

interface ProtectedProps{
    children: React.ReactNode;
}

export default function UserProtected({children}: ProtectedProps){
    // const isAuthenticated = UserAuth();
    // return isAuthenticated ? children : redirect("/login");

    return true ? children : redirect("/login");
}