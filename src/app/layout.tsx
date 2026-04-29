import "@/styles/globals.css";

import { type Metadata } from "next";
import { Cairo } from "next/font/google";

import { AhdMotionProvider } from "@/components/app/motion";
import { DirectionProvider } from "@/components/ui/direction";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  title: "عهد | Ahd",
  description: "عقود مراحل ممولة تربط التنفيذ بحالة الدفع.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={cn(cairo.variable, "font-sans")}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground min-h-screen antialiased">
        <TRPCReactProvider>
          <DirectionProvider dir="rtl">
            <AhdMotionProvider>
              <TooltipProvider>{children}</TooltipProvider>
            </AhdMotionProvider>
            <Toaster richColors position="top-center" />
          </DirectionProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
