import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Header } from "./header";
import { Social } from "./social";
import { BackButton } from "./back-button";
import Link from "next/link";
import { WandSparkles } from "lucide-react";
import { URI_LOGIN_MAGIC } from "@/config/route.config";

type Props = {
  children: React.ReactNode;
  headerLabel: string;
  headerDescriptionLabel?: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
  showMagicLink?: boolean;
};

export const CardWrapper = ({
  children,
  headerLabel,
  headerDescriptionLabel = "",
  backButtonLabel,
  backButtonHref,
  showSocial,
  showMagicLink,
}: Props) => {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <CardTitle>
         { headerLabel &&  ( <Header label={headerLabel} />)}
        </CardTitle>
        {headerDescriptionLabel && (<CardDescription>{headerDescriptionLabel}</CardDescription>)}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}

      <CardFooter className="flex flex-col">
        <BackButton label={backButtonLabel} href={backButtonHref} />
        {showMagicLink && ( 
          <Link className="flex text-sm" href={URI_LOGIN_MAGIC}>You can also use a magic link  <WandSparkles /></Link>
        )}
      </CardFooter>
    </Card>
  );
};
