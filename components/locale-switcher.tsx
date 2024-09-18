"use client";
import { CheckIcon, LanguagesIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { useChangeLocale, useCurrentLocale } from "@/locales/client";
import { Button } from "@/components/ui/button";

const locales = [
  {
    name: "English",
    value: "en",
  },
  {
    name: "French",
    value: "fr",
  },
];

export default function LocaleSwitcher() {
  // const changeLocale = useChangeLocale({ preserveSearchParams: true });
  // const currentLocale = useCurrentLocale();
  const changeLocale = (value: string) => "";
  const currentLocale = "fr";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className=" text-white dark:text-black">
        <Button variant="ghost" size="sm" className="w-9 px-0">
          <LanguagesIcon className=" h-5 w-5 " />
          <span className="sr-only">Change Locale</span>
        </Button>
      </DropdownMenuTrigger> 
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale.value}
            onClick={() => changeLocale(locale.value as typeof currentLocale)}
            disabled={locale.value === currentLocale}
          >
            <span>{locale.name}</span>
            {locale.value === currentLocale ? (
              <DropdownMenuShortcut>
                <CheckIcon className="h-4 w-4" />
              </DropdownMenuShortcut>
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
