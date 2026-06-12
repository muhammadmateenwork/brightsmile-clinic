import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BrightSmile Dental Clinic - Your Perfect Smile Starts Here",
  description: "Premium dental care with expert dentists, advanced technology, and a comfortable experience. Book your appointment today for teeth cleaning, implants, braces, whitening, and more.",
  keywords: ["dental clinic", "dentist", "teeth whitening", "dental implants", "braces", "root canal", "dental care", "orthodontics"],
  authors: [{ name: "BrightSmile Dental Clinic" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "BrightSmile Dental Clinic",
    description: "Your Perfect Smile Starts Here - Premium dental care with expert dentists",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
