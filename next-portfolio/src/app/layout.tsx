import type { Metadata, Viewport } from "next";
import { Fraunces, JetBrains_Mono } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { SITE, LINKS, LINKEDIN_URL } from "@/lib/content";
import { Atmosphere } from "@/components/atmosphere/Atmosphere";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.baseUrl),
  title: {
    default: `${SITE.name} | ${SITE.role}`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "I turn ambiguous problems into LLM architectures, agentic workflows, and decision products people actually use. MSc Business Analytics @ UCD Smurfit, ex-IndiGo — building production AI grounded in measurable business outcomes.",
  keywords: [
    "AI Strategy",
    "Forward Deployed Engineer",
    "LLM Architecture",
    "RAG",
    "Agentic AI",
    "Decision Intelligence",
    "Business Analytics",
    "Digital Transformation",
    "Advait Dharmadhikari",
  ],
  authors: [{ name: SITE.name, url: LINKEDIN_URL }],
  creator: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE.baseUrl,
    title: `${SITE.name} | ${SITE.role}`,
    description:
      "Architecting decision systems — LLM architectures, agentic workflows, and AI product strategy grounded in measurable business outcomes.",
    siteName: SITE.name,
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: `${SITE.name} — ${SITE.role}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | ${SITE.role}`,
    description:
      "Architecting decision systems — LLM architectures, agentic workflows, and AI product strategy.",
    images: ["/og.svg"],
  },
  robots: { index: true, follow: true },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.name,
  jobTitle: SITE.role,
  email: `mailto:${SITE.email}`,
  url: SITE.baseUrl,
  address: { "@type": "PostalAddress", addressLocality: "Dublin", addressCountry: "IE" },
  alumniOf: [
    "University College Dublin (Michael Smurfit Graduate Business School)",
    "IIT Kanpur",
    "Christ University",
  ],
  worksFor: { "@type": "Organization", name: "Frensei" },
  sameAs: [
    LINKS.github,
    LINKEDIN_URL,
    LINKS.medium,
    LINKS.instagram,
    LINKS.spotifyBusinessTechnologist,
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${GeistSans.variable} ${jetbrains.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="vignette antialiased">
        <Atmosphere />
        {children}
      </body>
    </html>
  );
}
