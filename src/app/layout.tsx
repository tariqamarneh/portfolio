import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Archivo, IBM_Plex_Sans_Arabic, JetBrains_Mono } from "next/font/google";
import { MotionProvider } from "@/components/MotionProvider";
import { SmoothScroll } from "@/components/SmoothScroll";
import { profile } from "@/content/profile";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
});

const title = `${profile.name} — Senior Software Engineer, AI Agents & Backend`;
const description = `${profile.name} is a Senior Software Engineer in ${profile.location} who builds production AI agents with LangGraph and RAG, and the backend systems behind them. Previously at Amazon and PwC.`;

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: { default: title, template: `%s | ${profile.name}` },
  description,
  applicationName: profile.name,
  authors: [{ name: profile.name, url: profile.siteUrl }],
  creator: profile.name,
  keywords: [
    profile.name,
    `${profile.name} software engineer`,
    `${profile.name} AI engineer`,
    "Senior Software Engineer",
    "AI Engineer Jordan",
    "Software Engineer Amman",
    "LangGraph",
    "LangChain",
    "RAG",
    "AI agents",
    "Backend engineer",
    "BusinessChat",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    firstName: profile.givenName,
    lastName: profile.familyName,
    url: "/",
    siteName: profile.name,
    title,
    description,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  appleWebApp: {
    capable: true,
    title: profile.name,
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false, email: false, address: false },
};

// Structured data so search engines can tie this site to the person and their profiles.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${profile.siteUrl}/#person`,
      name: profile.name,
      givenName: profile.givenName,
      familyName: profile.familyName,
      url: profile.siteUrl,
      image: `${profile.siteUrl}/images/tariq-portrait.png`,
      jobTitle: profile.role,
      description,
      email: `mailto:${profile.email}`,
      telephone: profile.phoneDisplay.replace(/\s/g, ""),
      address: { "@type": "PostalAddress", addressLocality: "Amman", addressCountry: "JO" },
      worksFor: { "@type": "Organization", name: profile.company, url: "https://www.businesschat.io" },
      alumniOf: { "@type": "CollegeOrUniversity", name: "Princess Sumaya University for Technology" },
      knowsLanguage: ["ar", "en"],
      knowsAbout: [
        "AI agents",
        "LangGraph",
        "LangChain",
        "LangSmith",
        "Retrieval-augmented generation",
        "Python",
        "Kotlin",
        "Java",
        "Spring Boot",
        "FastAPI",
        "Google Cloud",
        "AWS",
      ],
      sameAs: [profile.linkedin, profile.github],
    },
    {
      "@type": "WebSite",
      "@id": `${profile.siteUrl}/#website`,
      url: profile.siteUrl,
      name: profile.name,
      about: { "@id": `${profile.siteUrl}/#person` },
      inLanguage: "en",
    },
    {
      "@type": "ProfilePage",
      "@id": `${profile.siteUrl}/#profile`,
      url: profile.siteUrl,
      name: title,
      mainEntity: { "@id": `${profile.siteUrl}/#person` },
    },
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0d1526" },
    { media: "(prefers-color-scheme: light)", color: "#f2f4f8" },
  ],
};

// Applies a saved theme before first paint so there is no flash.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${archivo.variable} ${jetbrains.variable} ${plexArabic.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </head>
      <body className="min-h-dvh">
        <SmoothScroll />
        <MotionProvider>{children}</MotionProvider>
        <Analytics />
      </body>
    </html>
  );
}
