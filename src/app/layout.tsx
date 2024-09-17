import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "../providers/ThemeProvider";
import "./globals.css";

const primaryFont = Space_Grotesk({ subsets: ["latin"] });

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
      <body className={primaryFont.className}>
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
