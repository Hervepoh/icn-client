"use client";
import { useTheme } from "next-themes";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import { BiMoon, BiSun } from "react-icons/bi";
import { Skeleton } from "./ui/skeleton";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <Skeleton className="h-[25px] w-[25px] rounded-full mx-4" />;
  }

  return (
    <div className="flex items-center justify-center mx-4">
        {theme === "light" ? 
        (<BiMoon 
          className="cursor-pointer"
          size={25}
          fill="white"
          onClick={() => setTheme("dark")}
          />) :
          (<BiSun  
            className="cursor-pointer"
            size={25}
            fill="dark"
            onClick={() => setTheme("light")}
            />) 
        }
    </div>
    
  );
};

export default ThemeSwitcher;
