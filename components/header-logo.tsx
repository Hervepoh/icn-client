import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

type Props = {}

export const HeaderLogo = (props: Props) => {
    return (
        <Link href="/">
            <div className='items-center hidden lg:flex relative'>
                <Image src="/logo_eneo.png" alt="Logo" height={70} width={70} className='absolute top-4 right-0'/>
                <p className='font-semibold bg-gradient-to-r from-white to-white/30 dark:from-black  dark:to-black/30 text-transparent bg-clip-text text-2xl ml-2.5'>
                ICN Cashing
                </p>
            </div>
        </Link>
    );
}
