import React from "react"

import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { style } from "@/config/layout.config";
import { Filters } from "@/components/filters";
import { HeaderLogo } from "@/components/header-logo";
import { Navigation } from "@/components/navigation";
import { WelcomeMsg } from "@/components/welcome-msg";
import { UserNav } from "@/components/user-nav";
import ThemeSwitcher from "@/components/theme-switcher";
import LocaleSwitcher from "@/components/locale-switcher";
import UserProtected from "@/components/security/userProtected";


type Props = {}

export const Header = ({ }: Props) => {
    const { user } = useSelector((state: any) => state.auth);  // redux state

    return (
        <UserProtected>
        <header className={cn(
            "px-4 py-8 pb-36  lg:px-14",
            style.linearGradiant,
            "dark:bg-lime-700"
        )}>
            <div className="max-w-screen-2xl mx-auto">
                <div className="w-full flex items-center justify-between mb-14">
                    {/* left */}
                    <div className="hidden lg:flex items-center  lg:gap-x-16">
                        <HeaderLogo />
                    </div>
                    {/* center */}
                    <Navigation />
                     {/* right */}
                    <div className="flex items-center justify-center">
                        <LocaleSwitcher />
                        <ThemeSwitcher />
                        <UserNav user={user} />
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row items-center lg:justify-between">
                    <WelcomeMsg />
                    <Filters />
                </div>
            </div>
        </header>
        </UserProtected>
    );
}
