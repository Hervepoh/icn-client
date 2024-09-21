"use client"
import React from 'react'
import { toast } from 'sonner';
import Image from "next/image";
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import { style } from '@/config/layout.config';
import Metadata from '@/components/metadata';
import ThemeSwitcher from '@/components/theme-switcher';
import LocaleSwitcher from '@/components/locale-switcher';
import { useUserStore } from '@/features/users/hooks/use-user-store';

type Props = {
    children: React.ReactNode;
}

export default function AuthLayout({ children }: Props) {

    return (
        <>
            <Metadata
                title="ICN CASHING"
                description="Plateforme moderne et sécurisée de gestion des avis de credit internes (ACI)"
                keywords="Prograaming,MERN,Redux,Machine Learning"
            />
            <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
                {/** First Column of the grid */}
                <div className="h-full lg:flex flex-col items-center justify-center px-4">
                    {children}
                </div>
                {/** Second Column of the grid */}
                <div className={cn(
                    "h-full hidden lg:flex items-center justify-center",
                    style.linearGradiant,
                    "dark:bg-lime-700"
                )}>
                    <Image src="/logo_eneo.png" alt="logo" height={500} width={500} />
                </div>
                <div className='absolute flex right-5 top-5'>
                    <ThemeSwitcher />
                </div>
                <div className='absolute flex right-5 bottom-5'>
                    <LocaleSwitcher />
                </div>
            </div>
        </>

    );
}