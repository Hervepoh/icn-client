"use client"
import { useRouter } from 'next/navigation';
import React from 'react'

// interface loginButtonProps {
//     children: React.ReactNode;
//     mode?: "modal" | "redirect";
//     asChild?: boolean;
// }
type Props = {
    children: React.ReactNode;
    mode?: "modal" | "redirect";
    asChild?: boolean;
}

export const LoginButton = ({
    children,
    mode="redirect",
    asChild}: Props) => {

   const router = useRouter();;
   const onClick = () => {
      router.push("/auth/login");
      // console.log("login btn clicked");
   };

   if (mode === "modal") {
    return (
        <span>
            TODO : Implement modal
        </span>
      )
   }


  return (
    <span onClick={onClick} className="cursor-pointer">
        {children}
    </span>
  )
}