import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../providers/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { cookies } from "next/headers";
import { cookiesKeys } from "@/constants/cookies";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TDC",
  description: "Plataforma entreterimentativa do Tropa de Choque ⚡️",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className={jakarta.className}>
        <ThemeProvider
          attribute="class"
          disableTransitionOnChange
        > 
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
