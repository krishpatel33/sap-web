import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { ScrollAnimation } from "@/app/components/ScrollAnimation";
import { CustomCursor } from "@/app/components/CustomCursor";

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
  metadataBase: new URL("https://sap-web-theta.vercel.app"),
  title: "SAP Gold Ornaments — Wholesale Gold Jewelry, Ahmedabad",
  description: "Exquisite handcrafted wholesale gold ornaments from Manek Chowk, Ahmedabad since 2000. 100% BIS 916 Hallmarked Gold jewelry.",
  icons: {
    icon: "/favicon.jpeg",
    shortcut: "/favicon.jpeg",
    apple: "/favicon.jpeg",
  },
  openGraph: {
    title: "SAP Gold Ornaments — Wholesale Gold Jewelry, Ahmedabad",
    description: "Exquisite handcrafted wholesale gold ornaments from Manek Chowk, Ahmedabad since 2000. 100% BIS 916 Hallmarked Gold jewelry.",
    siteName: "SAP Gold Ornaments",
    images: [
      {
        url: "/logo.jpg",
        width: 800,
        height: 800,
        alt: "SAP Gold Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SAP Gold Ornaments — Wholesale Gold Jewelry, Ahmedabad",
    description: "Exquisite handcrafted wholesale gold ornaments from Manek Chowk, Ahmedabad since 2000. 100% BIS 916 Hallmarked Gold jewelry.",
    images: ["/logo.jpg"],
  },
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
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}

