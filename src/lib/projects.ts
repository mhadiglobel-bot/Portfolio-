export type Project = {
  index: string;
  name: string;
  category: string;
  description: string;
  href: string;
  image: string;
  accent: string;
};

/**
 * Verified live projects and the screenshots maintained in /public/projects.
 * Keep descriptions factual and links pointed at the live products.
 */
export const projects: Project[] = [
  {
    index: "01",
    name: "Audixo",
    category: "Audio / Web app",
    description:
      "A browser-based audio studio for recording, trimming, vocal separation and effects, with a focused workflow that keeps the sound front and centre.",
    href: "https://audixo.tiers.rest",
    image: "/projects/audixo.jpg",
    accent: "#ff3d9a",
  },
  {
    index: "02",
    name: "Rank Ur Business",
    category: "Directory / SaaS",
    description:
      "A discovery platform helping local businesses and online brands get found, with search, filters and listings designed to make exploring feel effortless.",
    href: "https://urbusiness.tiers.rest",
    image: "/projects/urbusiness.jpg",
    accent: "#a855f7",
  },
  {
    index: "03",
    name: "Alden Rovell",
    category: "Commerce / Retail",
    description:
      "A polished storefront for jewellery, footwear and lifestyle essentials, shaped around a clear, mobile-first shopping experience.",
    href: "https://aldenrovell.com",
    image: "/projects/aldenrovell.jpg",
    accent: "#e879f9",
  },
  {
    index: "04",
    name: "Mirfaq International",
    category: "Travel / Ground services",
    description:
      "A ground-services platform for Umrah travellers and agencies, covering airport transfers, intercity transport and package enquiries in one considered flow.",
    href: "https://www.mirfaqinternational.com",
    image: "/projects/mirfaq.jpg",
    accent: "#818cf8",
  },
  {
    index: "05",
    name: "Genzio AI",
    category: "AI / Product engineering",
    description:
      "A cold-outreach automation platform that turns inboxes, leads and follow-up sequences into one visual workflow, built to feel fast, clear and effortless.",
    href: "https://genzioai.vercel.app",
    image: "/projects/genzioai.jpg",
    accent: "#c084fc",
  },
];
