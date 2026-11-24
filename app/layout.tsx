import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "./project-preview.css";
import "./work.css";
import "./responsive.css";

const siteUrl = "https://muhammad-hadi-portfolio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Muhammad Hadi — Digital experiences with a pulse",
    template: "%s | Muhammad Hadi",
  },
  description:
    "Muhammad Hadi is a developer and digital maker shaping thoughtful products, expressive interfaces, and interactive experiences for the web.",
  applicationName: "Muhammad Hadi Portfolio",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Muhammad Hadi — Digital experiences with a pulse",
    description:
      "Thoughtful code, distinctive design, and interactive experiences for the web.",
    siteName: "Muhammad Hadi",
    images: [{ url: "/og-card.svg", width: 1200, height: 630, alt: "Muhammad Hadi portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Hadi — Digital experiences with a pulse",
    description:
      "Thoughtful code, distinctive design, and interactive experiences for the web.",
    images: ["/og-card.svg"],
  },
  icons: {
    icon: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#09070d",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
