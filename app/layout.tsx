import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "./work.css";
import "./responsive.css";

const siteUrl = "https://portfolio-genzio1.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Muhammad Hadi — Developer & Digital Maker",
    template: "%s | Muhammad Hadi",
  },
  description:
    "Muhammad Hadi is an independent developer building thoughtful digital products, responsive web experiences, and interactive systems.",
  applicationName: "Muhammad Hadi Portfolio",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Muhammad Hadi — Developer & Digital Maker",
    description:
      "Thoughtful interfaces, useful systems, and interactive experiences built with intent.",
    siteName: "Muhammad Hadi",
    images: [{ url: "/og-card.svg", width: 1200, height: 630, alt: "Muhammad Hadi portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Hadi — Developer & Digital Maker",
    description:
      "Thoughtful interfaces, useful systems, and interactive experiences built with intent.",
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
  themeColor: "#070A10",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
