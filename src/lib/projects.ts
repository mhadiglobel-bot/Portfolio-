export type Project = {
  index: string;
  name: string;
  wordmark: string;
  tagline: string;
  category: string;
  description: string;
  href: string;
  image: string;
  tags: string[];
  year: string;
  accent: string;
};

/**
 * The single source of truth for the selected work section.
 * Order here is the order rendered on the page.
 */
export const projects: Project[] = [
  {
    index: "01",
    name: "Audixo",
    wordmark: "AU",
    tagline: "Online audio studio",
    category: "Audio / Web app",
    description:
      "A browser-based audio studio for recording, trimming, vocal separation and effects — a focused workflow that keeps the sound front and centre.",
    href: "https://audixo.tiers.rest",
    image: "/projects/audixo.jpg",
    tags: ["Audio tool", "Web app", "Interface"],
    year: "2026",
    accent: "#ff3d9a",
  },
  {
    index: "02",
    name: "Rank Ur Business",
    wordmark: "RB",
    tagline: "Business discovery platform",
    category: "Directory / SaaS",
    description:
      "A discovery platform helping local businesses and online brands get found, with search, filters and listings designed to make exploring feel effortless.",
    href: "https://urbusiness.tiers.rest",
    image: "/projects/urbusiness.jpg",
    tags: ["Directory", "Search", "SaaS"],
    year: "2026",
    accent: "#a855f7",
  },
  {
    index: "03",
    name: "Alden Rovell",
    wordmark: "AR",
    tagline: "Curated commerce storefront",
    category: "Commerce / Retail",
    description:
      "A polished storefront for jewellery, footwear and lifestyle essentials, shaped around a clear, mobile-first shopping experience.",
    href: "https://aldenrovell.com",
    image: "/projects/aldenrovell.jpg",
    tags: ["E-commerce", "Storefront", "Brand"],
    year: "2026",
    accent: "#e879f9",
  },
  {
    index: "04",
    name: "Mirfaq International",
    wordmark: "MI",
    tagline: "Umrah transport platform",
    category: "Travel / Ground services",
    description:
      "A ground-services platform for Umrah travellers and agencies — airport transfers, intercity transport and package enquiries in one considered flow.",
    href: "https://www.mirfaqinternational.com",
    image: "/projects/mirfaq.jpg",
    tags: ["Travel", "Booking", "Platform"],
    year: "2026",
    accent: "#818cf8",
  },
  {
    index: "05",
    name: "Genzio AI",
    wordmark: "GZ",
    tagline: "AI outreach automation",
    category: "AI / Product engineering",
    description:
      "A cold-outreach automation platform that turns inboxes, leads and follow-up sequences into one visual workflow — built to feel fast, clear and effortless.",
    href: "https://genzioai.vercel.app",
    image: "/projects/genzioai.jpg",
    tags: ["AI SaaS", "Automation", "Product"],
    year: "2026",
    accent: "#c084fc",
  },
];
