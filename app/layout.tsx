import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { ScrollAnimation } from "@/app/components/ScrollAnimation";

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SAP Gold Ornaments — Wholesale Gold Jewelry, Ahmedabad",
  description: "Exquisite handcrafted wholesale gold ornaments from Manek Chowk, Ahmedabad since 2000. 100% BIS 916 Hallmarked Gold jewelry.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ScrollAnimation />
        {children}
      </body>
    </html>
  );
}

