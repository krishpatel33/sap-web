import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Showroom Gold Ornament Catalog — SAP Gold Ornaments",
  description: "Browse our premium wholesale gold ornament collections. Explore HUID-certified antique gold chokers, temple necklaces, lightweight chains, bangles, and bridal jewelry sets from Manek Chowk, Ahmedabad.",
  openGraph: {
    title: "Showroom Gold Ornament Catalog — SAP Gold Ornaments",
    description: "Browse our premium wholesale gold ornament collections. Explore HUID-certified antique gold chokers, temple necklaces, lightweight chains, bangles, and bridal jewelry sets from Manek Chowk, Ahmedabad.",
    url: "https://sap-web-theta.vercel.app/catalog",
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
};

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
