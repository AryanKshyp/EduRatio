import type { Metadata } from "next";
import { Baloo_2, Geist, Geist_Mono, Nunito } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui/Navbar";
import { PenAssistant } from "@/components/pen/PenAssistant";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["700", "800"],
});

export const metadata: Metadata = {
  title: "EduRatio — Grade 8 Rational Numbers",
  description: "Intelligent tutoring for Grade 8 rational numbers with Pen, your penguin guide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${nunito.variable} ${baloo.variable} h-full antialiased`}
    >
      <body className="min-h-full overflow-x-hidden bg-white font-[family-name:var(--font-nunito)] text-[#2F4156]">
        <Navbar />
        <main className="w-full max-w-none px-5 py-3 md:px-10 md:py-4 lg:px-14">{children}</main>
        <PenAssistant />
      </body>
    </html>
  );
}
