import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "./responsive.css";

const siteUrl = "https://portfolio-genzio1.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Muhammad Hadi — Digital Experiences & Product Engineering",
    template: "%s | Muhammad Hadi",
  },
  description:
    "Muhammad Hadi builds thoughtful digital products, expressive interfaces and interactive web experiences with care for every detail.",
  applicationName: "Muhammad Hadi Portfolio",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: "Muhammad Hadi — Digital Experiences & Product Engineering",
    description: "Thoughtful products, expressive interfaces and digital experiences that feel alive.",
    siteName: "Muhammad Hadi",
    images: [{ url: "/og-card.svg", width: 1200, height: 630, alt: "Muhammad Hadi portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Hadi — Digital Experiences & Product Engineering",
    description: "Thoughtful products, expressive interfaces and digital experiences that feel alive.",
    images: ["/og-card.svg"],
  },
  icons: { icon: "/favicon.svg" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#08070d",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
