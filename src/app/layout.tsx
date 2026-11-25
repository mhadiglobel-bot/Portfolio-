import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, Space_Grotesk } from "next/font/google";
import "./globals.css";
import CursorGlow from "@/components/CursorGlow";
import SmoothScroll from "@/components/SmoothScroll";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://muhammadhadi.vercel.app"),
  title: "Muhammad Hadi — Digital Experiences & Product Engineering",
  description:
    "Independent developer and product engineer crafting live products, expressive interfaces and experiences that feel alive.",
  openGraph: {
    title: "Muhammad Hadi — Digital Experiences & Product Engineering",
    description:
      "Independent developer and product engineer crafting live products, expressive interfaces and experiences that feel alive.",
    type: "website",
    images: ["/hadi-portrait.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Hadi — Digital Experiences & Product Engineering",
    description:
      "Independent developer and product engineer crafting live products, expressive interfaces and experiences that feel alive.",
    images: ["/hadi-portrait.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: "#07060b",
  width: "device-width",
  initialScale: 1,
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Muhammad Hadi",
  url: "https://muhammadhadi.vercel.app",
  jobTitle: "Independent Developer & Product Engineer",
  email: "mailto:mhadi.globel@gmail.com",
  sameAs: ["https://github.com/mhadiglobel-bot"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${instrumentSerif.variable}`}
    >
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <div className="noise" aria-hidden="true" />
        <CursorGlow />
        <SmoothScroll />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  );
}
