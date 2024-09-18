"use client"
import React from 'react'
import Metadata from '@/components/metadata';
import { Header } from '@/components/header';

type Props = {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
    return (
        <>
            <Metadata
                title="ICN CASHING"
                description="Plateforme moderne et sécurisée de gestion des avis de credit internes (ACI)"
                keywords="Prograaming,MERN,Redux,Machine Learning"
            /> 
             
            <Header />
            <main className="px-3 lg:px-14">
                {children}
            </main> 
        </>
    );
}