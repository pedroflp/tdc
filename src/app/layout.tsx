import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../providers/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TDCU Beta",
  description: "TDC x Primos in TDCU to play the best of the joguinho",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
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
