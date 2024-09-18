"use client"

import "./globals.css";
import { Inter } from "next/font/google";

import { ThemeProvider } from "@/providers/theme-provider";
import { ReduxProvider } from "@/providers/redux-provider";
import { QueryProvider } from "@/providers/query-provider";
import { SheetProvider } from "@/providers/sheet-provider";
import { Toaster } from "@/components/ui/sonner"
import { useLoadUserQuery } from "@/lib/redux/features/api/apiSlice";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import socketIO from "socket.io-client";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
        <QueryProvider>
        <SheetProvider />
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Toaster />
            <Custom>
            {children}
            </Custom>
          </ThemeProvider>
          <SheetProvider />
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}



const socketId = socketIO(process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "", { transports: ["websocket"] });

type Props = {
  children: React.ReactNode
}
const Custom =  ({ children } : Props) => {
  const { isLoading } = useLoadUserQuery({});

  useEffect(() => {
    socketId.on("connection", () => {});
  }, []);

  return <div>{isLoading ? <Loader2 /> : <div>{children} </div>}</div>;
};
