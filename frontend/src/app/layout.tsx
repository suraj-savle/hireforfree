import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Configure the Inter font loader
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Configure viewport settings separately (Next.js 14/15/16 standard format)
export const viewport: Viewport = {
  themeColor: "#272d68",
  width: "device-width",
  initialScale: 1,
};

// Enhanced SEO Metadata Configuration targeting high-volume job search metrics
export const metadata: Metadata = {
  title: {
    default: "Hire4Free | Zero-Margin Student & Startup Job Portal",
    template: "%s | Hire4Free",
  },
  description: "Skip the middleman. Hire4Free connects top student talent directly with verified startups and companies completely free. Discover work from home jobs hiring, remote positions, and entry-level career opportunities.",
  keywords: [
    // Core Platform Keywords
    "job portal",
    "student internships",
    "free job posting site",
    "startup hiring platform",
    "remote tech jobs",
    "entry level career opportunities",
    "hire students free",
    "no fee recruitment",
    "university placement software",
    "direct talent matching",
    "Hire4Free",
    "Shunya Tattva Management Consultants",
    
    // High-Volume Job Search & Intent Keywords
    "job search",
    "jobs hiring",
    "jobs hiring near me",
    "jobs urgently hiring",
    "urgently hiring jobs near me",
    "job hiring apps",
    "work from home jobs hiring",
    "job hiring consultancy",
    "job hiring websites",
    "remote jobs hiring",
    "freelancer hire and find jobs",
    "immediate hire jobs near me",
    "jobs hiring now near me",
    "online jobs hiring",
    "free job hiring sites",
    "job search sites",
    "highest paying jobs in india",
    "best salary jobs in india",
    "online jobs",
    "online work",
    "job vacancy",
    "latest job",
    "new vacancy",
    "recruitment portal",
    "we are hiring",
    "career opportunities"
  ],
  authors: [{ name: "Hire4Free Systems" }, { name: "Shunya Tattva Management Consultants" }],
  creator: "Hire4Free Systems",
  publisher: "Hire4Free Systems",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://hire4free.com"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hire4free.com",
    title: "Hire4Free | Zero-Margin Student & Startup Job Portal",
    description: "Connect directly with top employers without operational margins. Apply to placement roles, remote developer tracking, and verified startup jobs near you.",
    siteName: "Hire4Free",
    images: [
      {
        url: "/og-image.png", // Ensure you add an OG banner asset inside your public folder
        width: 1200,
        height: 630,
        alt: "Hire4Free - Connecting Talent Without Margins",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hire4Free | Student & Startup Job Portal",
    description: "Skip the middleman. Connect directly with top employers completely free.",
    images: ["/og-image.png"],
    creator: "@hire4free",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning={true}
    >
      <body className={`${inter.className} min-h-full flex flex-col bg-slate-50 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}